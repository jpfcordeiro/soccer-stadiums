"""
Script para buscar e enriquecer estádios de futebol do Brasil via SPARQL da Wikidata.
Execução: python scripts/fetch_stadiums_wikidata.py
"""

import json
import re
import ssl
import urllib.parse
import urllib.request
from pathlib import Path

WIKIDATA_SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"
GEOJSON_PATH = Path(__file__).resolve().parent.parent / "public" / "data" / "stadiums.geojson"

SPARQL_QUERY = """
SELECT ?stadium ?stadiumLabel ?coords ?capacity ?opened ?image ?teamLabel ?cityLabel ?stateLabel WHERE {
  ?stadium wdt:P31/wdt:P279* wd:Q483110; # Instância de estádio
           wdt:P17 wd:Q155;             # No Brasil
           wdt:P625 ?coords.            # Coordenadas

  OPTIONAL { ?stadium wdt:P1083 ?capacity. } # Capacidade
  OPTIONAL { ?stadium wdt:P571 ?opened. }    # Data de abertura
  OPTIONAL { ?stadium wdt:P18 ?image. }      # Imagem
  OPTIONAL { ?stadium wdt:P127 ?team. }      # Clube mandante
  OPTIONAL { ?stadium wdt:P131 ?city. }      # Localização administrativa / cidade

  SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,en". }
}
ORDER BY DESC(?capacity)
LIMIT 120
"""

def parse_coordinates(point_str: str):
    """Extrai [lng, lat] de strings no formato 'Point(-43.2302 -22.9122)'"""
    match = re.search(r"Point\(([-\d.]+)\s+([-\d.]+)\)", point_str)
    if match:
        lng = float(match.group(1))
        lat = float(match.group(2))
        return [round(lng, 4), round(lat, 4)]
    return None

def parse_year(opened_str: str):
    """Extrai o ano da data (ex: '1950-06-16T00:00:00Z')"""
    if not opened_str:
        return None
    match = re.search(r"^(\d{4})", opened_str)
    return int(match.group(1)) if match else None

def update_geojson():
    print(f"Lendo estádios atuais de {GEOJSON_PATH}...")
    current_data = {"type": "FeatureCollection", "features": []}
    if GEOJSON_PATH.exists():
        with open(GEOJSON_PATH, "r", encoding="utf-8") as f:
            try:
                current_data = json.load(f)
            except Exception as e:
                print(f"Erro ao ler GeoJSON existente: {e}")

    features = current_data.get("features", [])
    print(f"Estádios já cadastrados: {len(features)}")

    # Indexar estádios existentes por nome normalizado e coordenadas próximas
    existing_names = {f["properties"]["stadium"].lower().strip(): f for f in features}

    print("Consultando Wikidata SPARQL Endpoint...")
    params = urllib.parse.urlencode({"query": SPARQL_QUERY, "format": "json"})
    url = f"{WIKIDATA_SPARQL_ENDPOINT}?{params}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "FutMapsBrasil/1.0 (https://github.com/jpfcordeiro/soccer-stadiums)"}
    )

    bindings = []
    ssl_context = ssl._create_unverified_context()
    try:
        with urllib.request.urlopen(req, timeout=30, context=ssl_context) as response:
            data = json.loads(response.read().decode("utf-8"))
            bindings = data.get("results", {}).get("bindings", [])
            print(f"Registros recebidos da Wikidata: {len(bindings)}")
    except Exception as e:
        print(f"Aviso na consulta da Wikidata: {e}")

    added_count = 0
    updated_count = 0

    for item in bindings:
        stadium_label = item.get("stadiumLabel", {}).get("value", "")
        coords_raw = item.get("coords", {}).get("value", "")
        capacity_raw = item.get("capacity", {}).get("value")
        opened_raw = item.get("opened", {}).get("value", "")
        image_url = item.get("image", {}).get("value", "")
        team_label = item.get("teamLabel", {}).get("value", "")
        city_label = item.get("cityLabel", {}).get("value", "")

        if image_url and image_url.startswith("http://"):
            image_url = image_url.replace("http://", "https://")

        coords = parse_coordinates(coords_raw)
        if not coords or not stadium_label:
            continue

        try:
            capacity = int(float(capacity_raw)) if capacity_raw else 10000
        except ValueError:
            capacity = 10000

        # Filtrar estádios muito pequenos (< 8.000) para manter foco no futebol profissional
        if capacity < 8000:
            continue

        year_opened = parse_year(opened_raw) or 1970
        norm_name = stadium_label.lower().strip()

        # Se já existe, apenas complementa dados que faltam
        matched = None
        for name, feat in existing_names.items():
            if norm_name in name or name in norm_name:
                matched = feat
                break

        if matched:
            props = matched["properties"]
            if not props.get("image") and image_url:
                props["image"] = image_url
                props["image_credits"] = "Wikimedia Commons"
                props["image_url"] = image_url
                updated_count += 1
            if not props.get("capacity") or props.get("capacity") == 0:
                props["capacity"] = capacity
                updated_count += 1
        else:
            # Novo estádio descoberto na Wikidata
            new_feature = {
                "type": "Feature",
                "properties": {
                    "team": team_label if team_label and not team_label.startswith("Q") else "Clubes Locais",
                    "stadium": stadium_label,
                    "capacity": capacity,
                    "city": city_label if city_label and not city_label.startswith("Q") else "Brasil",
                    "state": "BR",
                    "year_opened": year_opened,
                    "surface": "Natural",
                    "division": "Outras",
                    "dimensions": "105m x 68m",
                    "image": image_url if image_url else None,
                    "image_credits": "Wikimedia Commons" if image_url else None,
                    "image_url": image_url if image_url else None
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": coords
                }
            }
            features.append(new_feature)
            existing_names[norm_name] = new_feature
            added_count += 1

    # Salva o arquivo atualizado
    current_data["features"] = features
    with open(GEOJSON_PATH, "w", encoding="utf-8") as f:
        json.dump(current_data, f, ensure_ascii=False, indent=2)

    print(f"\n==========================================")
    print(f"Atualização concluída com sucesso!")
    print(f"Total de estádios no mapa agora: {len(features)}")
    print(f"Novos estádios adicionados: {added_count}")
    print(f"Estádios enriquecidos com fotos/dados: {updated_count}")
    print(f"Arquivo salvo em: {GEOJSON_PATH}")
    print(f"==========================================")

if __name__ == "__main__":
    update_geojson()

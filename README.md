# FutMaps Brasil ⚽🗺️

Aplicação interativa de visualização geoespacial dos principais estádios de futebol do Brasil, desenvolvida com **React**, **TypeScript**, **Leaflet** e **Tailwind CSS**.

---

## 🌟 Funcionalidades

- **🗺️ Mapa Interativo em Alta Performance:** Renderização de marcadores e limites estaduais com suporte a alternância de camadas base (CartoDB Dark/Moderno, OpenStreetMap padrão e Imagens de Satélite).
- **🔍 Busca Inteligente em Tempo Real:** Pesquisa simultânea por nome do estádio, time mandante ou cidade.
- **📍 Filtros Regionais e por UF:** Seletor de estados com contagem dinâmica de estádios em cada unidade federativa.
- **👥 Filtro por Capacidade de Público:** Slider para filtrar estádios por capacidade mínima (ex: arenas com mais de 40 mil ou 60 mil torcedores).
- **✈️ Navegação com Câmera Fluida (`flyTo`):** Clicar em qualquer estádio na lista da barra lateral move suavemente a câmera até o estádio e abre seu popup.
- **🖼️ Cards e Popups Ricos:** Fotos reais em alta definição com fallback elegante, detalhes técnicos (ano de abertura, capacidade oficial, mandantes) e atalho direto para traçar rota no **Google Maps**.
- **📊 Estatísticas Dinâmicas:** Resumo instantâneo do total de estádios exibidos e soma da capacidade total de público.

---

## 🛠️ Tecnologias Utilizadas

- **React 18** com hooks modernos e tipagem estrita
- **TypeScript** com tipagem geoespacial completa (`@types/geojson`)
- **Leaflet & React-Leaflet** para renderização de mapas interativos
- **Vite** para compilação ultrarrápida
- **Tailwind CSS** para estilização responsiva e tema esportivo moderno
- **ESLint** com regras estritas configuradas

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/jpfcordeiro/soccer-stadiums.git
   cd soccer-stadiums
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Para gerar a build de produção:**
   ```bash
   npm run build
   ```

5. **Para validar o código com o linter:**
   ```bash
   npm run lint
   ```

---

## 📂 Estrutura de Dados GeoJSON

Os estádios estão cadastrados em [`public/data/stadiums.geojson`](public/data/stadiums.geojson) seguindo o padrão GeoJSON:

```json
{
  "type": "Feature",
  "properties": {
    "team": "Flamengo e Fluminense",
    "stadium": "Maracanã",
    "capacity": 78838,
    "city": "Rio de Janeiro",
    "state": "RJ",
    "year_opened": 1950,
    "image": "/estadios/maracana/maracana_1.jpg",
    "image_credits": "Victor Barbosa",
    "image_url": "https://www.pexels.com/..."
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-43.2302, -22.9122]
  }
}
```

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para mais informações.

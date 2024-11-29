import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import L, { Icon, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export const MapaStadiums = () => {
  const [stadiumsJson, setStadiumsJson] = useState<any>(null);
  const center = new LatLng(-14.235, -51.9253);

  const customIcon = new Icon({
    iconUrl: "icon.svg",
    iconSize: [32, 32],
  });

  useEffect(() => {
    fetch("/data/stadiums.geojson")
      .then((response) => response.json())
      .then((data) => setStadiumsJson(data))
      .catch((error) => console.error("Erro ao carregar o arquivo GeoJSON:", error));
  }, []);

  return (
    <MapContainer center={center} zoom={5} style={{ width: "100%", height: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://github.com/jpfcordeiro">jpfcordeiro</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stadiumsJson && (
        <GeoJSON
          data={stadiumsJson}
          pointToLayer={(_feature, latlng) => {
            const marker = new L.Marker(latlng, { icon: customIcon, riseOnHover: true });

            const popupContent = `
              <div class="p-4">
                <table class="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th class="px-4 py-2 text-left bg-gray-200">Informações</th>
                      <th class="px-4 py-2 text-left bg-gray-200">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="px-4 py-2 border-b">Estádio</td>
                      <td class="px-4 py-2 border-b font-semibold">${_feature.properties.stadium}</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 border-b">Time</td>
                      <td class="px-4 py-2 border-b font-semibold">${_feature.properties.team}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `;

            marker.bindPopup(popupContent);

            return marker;
          }}
        ></GeoJSON>
      )}
    </MapContainer>
  );
};

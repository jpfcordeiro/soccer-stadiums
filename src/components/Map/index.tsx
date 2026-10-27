import React, { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";
import { Icon, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";

import type { GeoJsonObject } from "geojson";
import type {
  StadiumFeature,
  StadiumFeatureCollection,
  StadiumFilterState,
} from "../../types/stadium";
import { StadiumPopup } from "./StadiumPopup";
import { MapController } from "./MapController";
import { Sidebar } from "../Sidebar";

export const MapaStadiums: React.FC = () => {
  const [stadiumsCollection, setStadiumsCollection] =
    useState<StadiumFeatureCollection | null>(null);
  const [estadosPais, setEstadosPais] = useState<GeoJsonObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de navegação e filtros
  const [selectedStadium, setSelectedStadium] = useState<StadiumFeature | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filters, setFilters] = useState<StadiumFilterState>({
    search: "",
    state: "",
    minCapacity: 0,
    surface: "",
    division: "",
    onlyWorldCup: false,
  });

  const center = useMemo(() => new LatLng(-14.235, -51.9253), []);

  // Ícone de marcador personalizado
  const stadiumIcon = useMemo(
    () =>
      new Icon({
        iconUrl: "/icon.svg",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -32],
      }),
    []
  );

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch("/data/stadiums.geojson").then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar dados dos estádios");
        return res.json();
      }),
      fetch("/data/br_states.json")
        .then((res) => {
          if (!res.ok) throw new Error("Falha ao carregar estados");
          return res.json();
        })
        .catch((err) => {
          console.warn("Estados não carregados:", err);
          return null;
        }),
    ])
      .then(([stadiumsData, statesData]) => {
        setStadiumsCollection(stadiumsData);
        setEstadosPais(statesData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erro no carregamento:", err);
        setError("Não foi possível carregar os dados geográficos.");
        setIsLoading(false);
      });
  }, []);

  const stadiumsList = useMemo(() => {
    return stadiumsCollection?.features || [];
  }, [stadiumsCollection]);

  // Contagem de estádios por estado para o mapa de polígonos
  const stadiumsCountByState = useMemo(() => {
    const map: Record<string, number> = {};
    stadiumsList.forEach((stadium) => {
      const uf = stadium.properties.state?.toUpperCase();
      if (uf) map[uf] = (map[uf] || 0) + 1;
    });
    return map;
  }, [stadiumsList]);

  // Filtragem dinâmica
  const filteredStadiums = useMemo(() => {
    return stadiumsList.filter((feature) => {
      const props = feature.properties;
      const searchLower = filters.search.toLowerCase().trim();

      // Busca por estádio, time ou cidade
      const matchesSearch =
        !searchLower ||
        props.stadium.toLowerCase().includes(searchLower) ||
        props.team.toLowerCase().includes(searchLower) ||
        props.city.toLowerCase().includes(searchLower);

      // Filtro por UF
      const matchesState = !filters.state || props.state === filters.state;

      // Filtro por capacidade mínima
      const matchesCapacity = props.capacity >= filters.minCapacity;

      // Filtro por tipo de gramado
      const matchesSurface = !filters.surface || props.surface === filters.surface;

      // Filtro por divisão
      const matchesDivision = !filters.division || props.division === filters.division;

      // Filtro por Copa do Mundo
      const matchesWorldCup =
        !filters.onlyWorldCup || (Array.isArray(props.world_cup) && props.world_cup.length > 0);

      return (
        matchesSearch &&
        matchesState &&
        matchesCapacity &&
        matchesSurface &&
        matchesDivision &&
        matchesWorldCup
      );
    });
  }, [stadiumsList, filters]);

  const handleFilterChange = (updated: Partial<StadiumFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectStadium = (stadium: StadiumFeature) => {
    setSelectedStadium(stadium);
  };

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-950 text-red-400 p-6 text-center">
        <div>
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-medium transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-300">Carregando mapa dos estádios...</span>
        </div>
      )}

      {/* Painel lateral de filtros e lista */}
      <Sidebar
        stadiums={stadiumsList}
        filteredStadiums={filteredStadiums}
        selectedStadium={selectedStadium}
        onSelectStadium={handleSelectStadium}
        filters={filters}
        onFilterChange={handleFilterChange}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Container do Mapa */}
      <MapContainer
        center={center}
        zoom={4}
        minZoom={3}
        maxZoom={18}
        className="w-full h-full"
      >
        <MapController selectedStadium={selectedStadium} />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="CartoDB Dark (Moderno)">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap Padrão">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satélite / Terreno">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Polígonos dos Estados do Brasil */}
        {estadosPais && (
          <GeoJSON
            key="br-states-layer"
            data={estadosPais}
            style={(feature) => {
              const uf = feature?.id !== undefined ? String(feature.id) : undefined;
              const hasStadium = uf && (stadiumsCountByState[uf] || 0) > 0;
              return {
                color: hasStadium ? "#10b981" : "#64748b",
                weight: hasStadium ? 1.5 : 0.8,
                fillColor: hasStadium ? "#059669" : "#334155",
                fillOpacity: hasStadium ? 0.08 : 0.02,
                dashArray: hasStadium ? undefined : "2, 4",
              };
            }}
            onEachFeature={(feature, layer) => {
              const uf = feature?.id !== undefined ? String(feature.id) : undefined;
              const count = uf ? stadiumsCountByState[uf] || 0 : 0;
              layer.bindTooltip(
                `<strong>${uf}</strong> - ${
                  count === 1 ? "1 estádio" : `${count} estádios`
                }`,
                { sticky: true, opacity: 0.9 }
              );

              layer.on({
                mouseover: (e) => {
                  const target = e.target;
                  target.setStyle({
                    weight: 2.5,
                    fillOpacity: 0.2,
                  });
                },
                mouseout: (e) => {
                  const target = e.target;
                  target.setStyle({
                    weight: count > 0 ? 1.5 : 0.8,
                    fillOpacity: count > 0 ? 0.08 : 0.02,
                  });
                },
                click: () => {
                  if (uf) {
                    handleFilterChange({ state: filters.state === uf ? "" : uf });
                  }
                },
              });
            }}
          />
        )}

        {/* Marcadores React com Popups customizados */}
        {filteredStadiums.map((stadium) => {
          const [lng, lat] = stadium.geometry.coordinates;
          const isSelected =
            selectedStadium?.properties.stadium === stadium.properties.stadium;

          return (
            <Marker
              key={stadium.properties.stadium}
              position={[lat, lng]}
              icon={stadiumIcon}
              riseOnHover
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{
                click: () => {
                  setSelectedStadium(stadium);
                },
              }}
            >
              <Popup className="custom-stadium-popup">
                <StadiumPopup
                  properties={stadium.properties}
                  coordinates={[lng, lat]}
                />
              </Popup>
              <Tooltip direction="top" offset={[0, -32]} opacity={0.9}>
                <span className="font-semibold text-xs text-slate-800">
                  {stadium.properties.stadium} ({stadium.properties.team})
                </span>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

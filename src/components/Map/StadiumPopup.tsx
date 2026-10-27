import React, { useState } from "react";
import type { StadiumProperties } from "../../types/stadium";
import { WeatherBadge } from "./WeatherBadge";

interface StadiumPopupProps {
  properties: StadiumProperties;
  coordinates: [number, number]; // [lng, lat]
}

export const StadiumPopup: React.FC<StadiumPopupProps> = ({ properties, coordinates }) => {
  const [imageError, setImageError] = useState(false);
  const [lng, lat] = coordinates;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;

  return (
    <div className="w-80 max-w-sm font-sans text-slate-800 -m-1">
      {/* Imagem com fallback elegante */}
      <div className="relative w-full h-40 bg-slate-800 rounded-t-lg overflow-hidden flex items-center justify-center">
        {!imageError && properties.image ? (
          <img
            src={properties.image}
            alt={properties.stadium}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <svg
              className="w-10 h-10 mb-1 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-xs font-medium text-slate-300">{properties.stadium}</span>
          </div>
        )}

        {/* Badges superiores na imagem */}
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          {properties.world_cup && properties.world_cup.length > 0 && (
            <span className="bg-amber-500/95 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1 backdrop-blur-sm">
              🏆 Copa {properties.world_cup.join(" & ")}
            </span>
          )}
          {properties.surface && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded shadow text-white backdrop-blur-sm ${
                properties.surface === "Sintético"
                  ? "bg-purple-600/90"
                  : properties.surface === "Híbrido"
                  ? "bg-blue-600/90"
                  : "bg-emerald-600/90"
              }`}
            >
              Grama {properties.surface}
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 bg-slate-900/90 text-emerald-400 border border-slate-700/80 text-[11px] font-black px-2 py-0.5 rounded shadow backdrop-blur-sm">
          {properties.state}
        </div>
      </div>

      {/* Conteúdo Informativo */}
      <div className="p-3.5 bg-white rounded-b-lg space-y-2.5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-black text-base text-slate-900 leading-tight">
              {properties.stadium}
            </h3>
            {properties.division && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {properties.division}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-emerald-700 mt-0.5 flex items-center gap-1.5">
            {properties.team_badge && (
              <img
                src={properties.team_badge}
                alt=""
                className="w-4 h-4 object-contain inline-block"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            )}
            <span>{properties.team}</span>
          </p>
        </div>

        {/* Dados técnicos em grid */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Capacidade</span>
            <span className="font-extrabold text-slate-800">
              {properties.capacity.toLocaleString("pt-BR")} lug.
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Inauguração</span>
            <span className="font-extrabold text-slate-800">{properties.year_opened}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Cidade</span>
            <span className="font-medium text-slate-700">{properties.city} - {properties.state}</span>
          </div>
          {properties.transport && (
            <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-start gap-1 text-[11px] text-slate-600">
              <span className="text-xs">🚇</span>
              <span className="leading-tight">{properties.transport}</span>
            </div>
          )}
        </div>

        {/* Widget de Clima ao Vivo da Open-Meteo */}
        <WeatherBadge lat={lat} lng={lng} />

        {/* Botões de Ação */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors text-center shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Como Chegar
          </a>

          <a
            href={streetViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors text-center shadow-sm"
          >
            <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Visão 360°
          </a>
        </div>

        {properties.image_credits && (
          <p className="text-[10px] text-slate-400 text-center truncate pt-1 border-t border-slate-100">
            Foto:{" "}
            {properties.image_url ? (
              <a
                href={properties.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:underline hover:text-emerald-600"
              >
                {properties.image_credits}
              </a>
            ) : (
              properties.image_credits
            )}
          </p>
        )}
      </div>
    </div>
  );
};

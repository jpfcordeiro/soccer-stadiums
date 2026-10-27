import React, { useState } from "react";
import type { StadiumFeature, StadiumFilterState } from "../../types/stadium";

interface SidebarProps {
  stadiums: StadiumFeature[];
  filteredStadiums: StadiumFeature[];
  selectedStadium: StadiumFeature | null;
  onSelectStadium: (stadium: StadiumFeature) => void;
  filters: StadiumFilterState;
  onFilterChange: (filters: Partial<StadiumFilterState>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  stadiums,
  filteredStadiums,
  selectedStadium,
  onSelectStadium,
  filters,
  onFilterChange,
  isOpen,
  onToggle,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Lista única de estados disponíveis com contagem
  const stateCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    stadiums.forEach((item) => {
      const uf = item.properties.state;
      counts[uf] = (counts[uf] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [stadiums]);

  // Capacidade total acumulada dos estádios filtrados
  const totalCapacity = React.useMemo(() => {
    return filteredStadiums.reduce((acc, curr) => acc + (curr.properties.capacity || 0), 0);
  }, [filteredStadiums]);

  // Ao selecionar um estádio no mobile, fecha automaticamente a sidebar para ver o mapa
  const handleStadiumClick = (stadium: StadiumFeature) => {
    onSelectStadium(stadium);
    if (window.innerWidth < 640) {
      onToggle();
    }
  };

  return (
    <>
      {/* Backdrop para mobile quando a sidebar estiver aberta */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 z-[990] sm:hidden backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Botão flutuante para reabrir quando fechada */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="absolute top-3 left-3 z-[1000] bg-slate-900/90 text-white p-2.5 rounded-xl shadow-xl hover:bg-slate-800 transition-all border border-slate-700/50 flex items-center gap-2 backdrop-blur-sm"
          title="Abrir painel lateral"
        >
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-xs font-semibold hidden sm:inline">Explorar Estádios ({filteredStadiums.length})</span>
        </button>
      )}

      {/* Container Lateral */}
      <aside
        className={`absolute top-0 left-0 bottom-0 z-[1000] w-full sm:w-96 bg-slate-900/95 text-slate-100 backdrop-blur-md border-r border-slate-800 flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header do Painel */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Estádios do Brasil</h2>
              <p className="text-[11px] text-slate-400">
                {filteredStadiums.length} de {stadiums.length} selecionados
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            title="Recolher painel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Filtros */}
        <div className="p-4 space-y-3 border-b border-slate-800/80 bg-slate-900/50">
          {/* Busca por texto */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar estádio, time ou cidade..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: "" })}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Abas Rápidas de Divisão */}
          <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs">
            {["", "Série A", "Série B"].map((div) => {
              const label = div === "" ? "Todas Divisões" : div;
              const active = filters.division === div;
              return (
                <button
                  key={div}
                  onClick={() => onFilterChange({ division: div })}
                  className={`flex-1 py-1 px-2 rounded-md font-semibold text-[11px] transition-all ${
                    active
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Botão de Filtros Avançados */}
          <button
            onClick={() => setShowAdvancedFilters((prev) => !prev)}
            className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 py-1"
          >
            <span className="font-medium flex items-center gap-1.5">
              <span>⚙️</span> Filtros Avançados (UF, Gramado, Copa)
            </span>
            <span>{showAdvancedFilters ? "▲" : "▼"}</span>
          </button>

          {/* Filtros Avançados Recolhíveis */}
          {showAdvancedFilters && (
            <div className="space-y-2.5 pt-1 border-t border-slate-800/60 animate-fadeIn">
              {/* Filtro por UF */}
              <div className="flex gap-2 items-center">
                <select
                  value={filters.state}
                  onChange={(e) => onFilterChange({ state: e.target.value })}
                  className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Todos os Estados ({stadiums.length})</option>
                  {stateCounts.map(([uf, count]) => (
                    <option key={uf} value={uf}>
                      {uf} ({count} {count === 1 ? "estádio" : "estádios"})
                    </option>
                  ))}
                </select>

                {filters.state && (
                  <button
                    onClick={() => onFilterChange({ state: "" })}
                    className="px-2 py-1.5 text-xs text-emerald-400 hover:bg-slate-800 rounded border border-slate-700"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Filtro por Tipo de Gramado */}
              <div className="flex gap-1.5 items-center">
                <label className="text-[11px] text-slate-400 w-16">Gramado:</label>
                <select
                  value={filters.surface}
                  onChange={(e) => onFilterChange({ surface: e.target.value })}
                  className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Qualquer Tipo</option>
                  <option value="Natural">Natural</option>
                  <option value="Sintético">Sintético</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              {/* Checkbox Apenas Estádios de Copa */}
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-0.5">
                <input
                  type="checkbox"
                  checked={filters.onlyWorldCup}
                  onChange={(e) => onFilterChange({ onlyWorldCup: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="flex items-center gap-1">
                  🏆 Apenas Estádios de Copa do Mundo
                </span>
              </label>

              {/* Filtro por Capacidade Mínima */}
              <div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
                  <span>Capacidade Mínima</span>
                  <span className="font-semibold text-emerald-400">
                    {filters.minCapacity > 0
                      ? `${filters.minCapacity.toLocaleString("pt-BR")} lug.`
                      : "Qualquer"}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={70000}
                  step={5000}
                  value={filters.minCapacity}
                  onChange={(e) => onFilterChange({ minCapacity: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Mini Cards de Estatísticas */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Estádios Filtrados</span>
              <span className="text-sm font-bold text-white">{filteredStadiums.length}</span>
            </div>
            <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Capacidade Total</span>
              <span className="text-sm font-bold text-emerald-400">
                {(totalCapacity / 1000).toFixed(0)}k <span className="text-[10px] font-normal text-slate-400">lugares</span>
              </span>
            </div>
          </div>
        </div>

        {/* Lista de Estádios Rolável */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
          {filteredStadiums.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400">
              <svg className="w-10 h-10 mx-auto mb-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-medium">Nenhum estádio encontrado</p>
              <p className="text-[11px] text-slate-500 mt-1">Tente ajustar seus termos de busca ou filtros.</p>
            </div>
          ) : (
            filteredStadiums.map((stadium) => {
              const isSelected =
                selectedStadium?.properties.stadium === stadium.properties.stadium;
              const props = stadium.properties;
              return (
                <div
                  key={props.stadium}
                  onClick={() => handleStadiumClick(stadium)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? "bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/50"
                      : "bg-slate-950/40 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 leading-snug">
                        {props.stadium}
                      </h4>
                      <p className="text-[11px] text-emerald-400 font-medium">
                        {props.team}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                      {props.state}
                    </span>
                  </div>

                  {/* Badges do estádio no card */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                    {props.division && (
                      <span className="px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-300 font-medium border border-slate-700/60">
                        {props.division}
                      </span>
                    )}
                    {props.surface && (
                      <span className="px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-300 font-medium border border-slate-700/60">
                        {props.surface}
                      </span>
                    )}
                    {props.world_cup && props.world_cup.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                        🏆 Copa {props.world_cup.join("&")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {props.city}
                    </span>
                    <span className="font-semibold text-slate-200">
                      {props.capacity.toLocaleString("pt-BR")} lug.
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
};

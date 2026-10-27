import React from "react";

export const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-2.5 px-4 text-xs z-10">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p className="mb-0 text-[11px]">
          &copy; {new Date().getFullYear()} FutMaps Brasil &bull; Desenvolvido por{" "}
          <a
            href="https://github.com/jpfcordeiro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
          >
            jpfcordeiro
          </a>
        </p>
        <div className="text-[10px] text-slate-500 flex items-center gap-2">
          <span>Dados via OpenStreetMap & GeoJSON</span>
          <span>&bull;</span>
          <span>Imagens com licenças Creative Commons / Domínio Público</span>
        </div>
      </div>
    </footer>
  );
};

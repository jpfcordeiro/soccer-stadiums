import "./App.css";
import { SiteFooter } from "./components/Footer";
import { SiteHeader } from "./components/Header";
import { MapaStadiums } from "./components/Map";

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950">
      <SiteHeader />
      <main className="flex-1 relative overflow-hidden">
        <MapaStadiums />
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;

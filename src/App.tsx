import "./App.css";
import { SiteFooter } from "./components/Footer";
import { SiteHeader } from "./components/Header";
import { MapaStadiums } from "./components/Map";

function App() {
  return (
    <div className="app-container flex flex-col h-screen">
      <SiteHeader />
      <main className="flex-grow flex">
        <div className="flex-grow h-full bg-black rounded-lg">
          <MapaStadiums />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;

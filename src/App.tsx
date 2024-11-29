import "./App.css";
import { MapaStadiums } from "./components/Map";

function App() {
  return (
    <>
      <h1>Bem-vindo ao FutMaps Brasil</h1>
      <div className="w-auto h-[500px] bg-black rounded-lg">
        <MapaStadiums />
      </div>
    </>
  );
}

export default App;

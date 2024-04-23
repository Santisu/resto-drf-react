import { PlatoCard } from "../components/Platos/PlatoCard";
import { useRush } from "../context/RushProvider";
import VentaCreate from "../components/Rush/VentaCreate";

export default function PlatosPage() {
  const { platos } = useRush();


  return (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {platos.map((plato) => (
        <PlatoCard key={plato.id} platoObj={plato}></PlatoCard>
      ))}
      </div>
     <VentaCreate />

    </>
  );
}

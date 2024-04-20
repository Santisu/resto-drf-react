import { usePlatos } from "../context/PlatoProvider";
import { PlatoCard } from "../components/Platos/PlatoCard";
import { PlatoUpdateDialog } from "../components";
export default function PlatosPage() {
  const { platos } = usePlatos();

  return (
    <>
        <PlatoUpdateDialog />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {platos.map((plato) => (
        <PlatoCard key={plato.id} platoObj={plato}></PlatoCard>
      ))}
      </div>
    </>
  );
}

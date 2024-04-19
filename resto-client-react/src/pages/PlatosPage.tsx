import { usePlatos } from "../context/PlatoProvider";
import { PlatoCard } from "../components/Platos/PlatoCard";
import  Button  from "../components/Button";
export default function PlatosPage() {
  const { platos } = usePlatos();

  return (
    <>
        <Button texto="Crear plato" tipo="green" onClick={() => {console.log(platos)}}></Button>
      {platos.map((plato) => (
        <PlatoCard key={plato.id} platoObj={plato}></PlatoCard>
      ))}
    </>
  );
}

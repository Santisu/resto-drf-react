import { useState } from "react";
import { Plato, VentaRegistroCreate } from "../../models";
import RegistroCreate from "./RegistroCreate";
import { useRush } from "../../context/RushProvider";

export default function VentaCreate() {
  const { platos: activePlatos } = useRush();
  const [platos, setPlatos] = useState<Plato[]>(activePlatos);
  const [registros, setRegistros] = useState<VentaRegistroCreate[]>([]);

  const onDelete = (index: number) => {
    const platoId = registros[index].platoId;
    const newRegistros = [...registros];
    newRegistros.splice(index, 1);
    setRegistros(newRegistros);
    const deletedPlato = activePlatos.find((plato) => plato.id === platoId);
    if (deletedPlato) {
      setPlatos([...platos, deletedPlato]);
    }
  };

  const addRegistro = (registro: VentaRegistroCreate) => {
    const platoId = registro.platoId;
    const newRegistros = [...registros, registro];
    setRegistros(newRegistros);

    const updatedPlatos = platos.filter((plato) => plato.id !== platoId);
    setPlatos(updatedPlatos);
  };

  const updateRegistro = (updatedRegistro: VentaRegistroCreate) => {
    const updatedRegistros = registros.map((registro) => {
      if (registro.platoId === updatedRegistro.platoId) {
        return updatedRegistro;
      } else {
        return registro;
      }
    });
    setRegistros(updatedRegistros);
  };

  return (
    <>
      <div className="bg-red-100">
        {registros.map((registro, index) => (
          <div key={index}>
            <RegistroCreate
              platos={platos}
              registro={registro}
              onDelete={() => onDelete(index)}
              updateRegistro={updateRegistro}
            />
          </div>
        ))}
      </div>
      <RegistroCreate addRegistro={addRegistro} platos={platos} />
    </>
  );
}

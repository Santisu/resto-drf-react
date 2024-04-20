import React, { useEffect, useState } from "react";
import Button from "../Button";
import { usePlatos } from "../../context";
import { Plato, Precio } from "../../models";
import PlatoPrecioRow from "./PlatoPrecioRow";
import { PlatoUpdateDialog } from "./PlatoUpdateDialog";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";

interface Props {
  platoObj: Plato;
}

export const PlatoCard: React.FC<Props> = ({ platoObj: initialPlatoObj }) => {
  const { updatePlato } = usePlatos();
  const [platoObj, setPlatoObj] = useState<Plato>(initialPlatoObj);

  useEffect(() => {
    console.log("platoObj", platoObj);
    setPlatoObj(initialPlatoObj);
  }, [initialPlatoObj]);

  const updateActive = () => {
    const updatedPlato = { ...platoObj, is_active: !platoObj.is_active };
    setPlatoObj(updatedPlato);
    updatePlato(updatedPlato);
  };

  const updatePrecioActive = (updatedPrecio: Precio, index: number) => {
    const updatedPrecios = [...platoObj.precios];
    updatedPrecios[index] = updatedPrecio;
    const updatedPlato = { ...platoObj, precios: updatedPrecios };
    setPlatoObj(updatedPlato);
    updatePlato(updatedPlato);
  };

  return (
    <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-default">
      <h5 className="my-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {platoObj.nombre}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {platoObj.descripcion}
      </p>
      <div className="flex justify-between py-4">
        <Button
          onClick={updateActive}
          texto={platoObj.is_active ? "Activo" : "Inactivo"}
          tipo={platoObj.is_active ? "green" : "red"}
        />
        <PlatoUpdateDialog platoObj={platoObj} />
      </div>

      <div>
        <Accordion>
          <AccordionSummary aria-controls="precios" id="precios">
            <div className="flex justify-between w-full">
              <Typography variant="h6">Precio</Typography>
              <Typography variant="h6">Cantidad</Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            {platoObj.precios.map((p, index) => (
              <PlatoPrecioRow
                key={index}
                precioObj={p}
                id={index}
                updatePrecioActive={updatePrecioActive}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

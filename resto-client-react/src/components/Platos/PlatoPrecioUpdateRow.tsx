import React, { useState } from "react";
import { Precio } from "../../models";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface Props {
    index: number;
    precioObj: Precio;
    updatePrecio: (updatedPrecio: Precio, index: number) => void
}

export default function PlatoPrecioUpdateRow({ precioObj, updatePrecio, index }: Props) {
  const { precio, cantidad } = precioObj;
  const [isActive, setIsActive] = useState(precioObj.is_active); 


  const handlePrecioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrecio = Number(event.target.value);
    updatePrecio({ ...precioObj, precio: newPrecio }, index);
  }

const handleActivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newActivo = event.target.checked;
    setIsActive(newActivo)
    updatePrecio({ ...precioObj, is_active: newActivo }, index); 
};

  return (
    <div className="flex">
      <TextField
        autoFocus
        required
        margin="dense"
        id={`cantidad-${index}`}
        name={`cantidad-${index}`}
        label="Cantidad"
        type="number"
        value={cantidad} // Mostrar la cantidad actual
        disabled // Deshabilitar la edición de la cantidad
        fullWidth
        variant="outlined"
        className="mr-2" // Espacio entre los elementos
      />
      <TextField
        autoFocus
        required
        margin="dense"
        id={`precio-${index}`}
        name={`precio-${index}`}
        label="Precio"
        type="number"
        value={precio}
        onChange={handlePrecioChange}
        fullWidth
        variant="outlined"
        className="mx-2"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isActive}
            onChange={handleActivoChange}
            name={`activo-${index}`}
          />
        }
        label="Activo"
      />
    </div>
  );
}

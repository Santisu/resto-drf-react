import React from "react";
import { Precio } from "../../models";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface Props {
    index: number;
    precioObj: Precio;
    updatePrecio: (updatedPrecio: Precio) => void;
}

export default function PlatoPrecioUpdateRow({ precioObj, updatePrecio, index }: Props) {
  const { precio, cantidad, activo } = precioObj;


  const handlePrecioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrecio = Number(event.target.value);
    updatePrecio({ ...precioObj, precio: newPrecio });
  };


  const handleActivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newActivo = event.target.checked;
    updatePrecio({ ...precioObj, activo: newActivo });
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
            checked={activo}
            onChange={handleActivoChange}
            name={`activo-${index}`}
          />
        }
        label="Activo"
      />
    </div>
  );
}

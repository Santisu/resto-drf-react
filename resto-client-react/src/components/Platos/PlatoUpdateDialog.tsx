import React, { useEffect, useState } from "react";
import  Button from "../Button";
import { TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle"
import { usePlatos } from "../../context/PlatoProvider";
import { Plato, Precio } from "../../models";
import PlatoPrecioUpdateRow from "./PlatoPrecioUpdateRow";

interface Props {
  platoObj?: Plato;
}

export const PlatoUpdateDialog: React.FC<Props> = ({ platoObj }) => {
  const { updatePlato, createPlato } = usePlatos();
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [precios, setPrecios] = useState<Precio[]>([]);
  const [activo, setActivo] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [nuevoPrecio, setNuevoPrecio] = useState<number>(0);
  const [nuevaCantidad, setNuevaCantidad] = useState<number>(0);

useEffect(() => {
  setNombre(platoObj ? platoObj.nombre : "");
  setDescripcion(platoObj ? platoObj.descripcion : "");
  setPrecios(platoObj ? platoObj.precios : []);
  setActivo(platoObj ? platoObj.is_active : true);
}, [open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdatePlato = () => {
    const updatedPlato: Plato = {
      ...platoObj!,
      nombre: nombre,
      descripcion: descripcion,
      precios: precios,
      is_active: activo,
    };
    updatePlato(updatedPlato);
    handleClose();
  };

  const handleCreatePlato = () => {
    const newPlato: Plato = {
      id: 0,
      nombre: nombre,
      descripcion: descripcion,
      precios: precios,
      is_active: activo,
    };
    createPlato(newPlato);
    handleClose();
  }

  const updatePrecio = (updatedPrecio: Precio, index: number) => {
    // Copiar la lista de precios actual
    console.log(updatedPrecio, index)
    const updatedPrecios = [...precios];

    // Reemplazar el precio en el índice dado con el precio actualizado
    updatedPrecios[index] = updatedPrecio;

    // Actualizar el estado de la lista de precios con la lista actualizada
    setPrecios(updatedPrecios);
};

  const handleAddPrecio = () => {
    if  (!(nuevoPrecio !== 0 && nuevaCantidad !== 0 && !precios.some((p) => p.cantidad === nuevaCantidad))){
        alert("Esa cantidad ya está registrada");
    }
    if (nuevoPrecio !== 0 && nuevaCantidad !== 0 && !precios.some((p) => p.cantidad === nuevaCantidad)) {
      const newPrecio: Precio = {
        precio: nuevoPrecio,
        cantidad: nuevaCantidad,
        is_active: false,
      };
      setPrecios([...precios, newPrecio]);
      setNuevoPrecio(0);
      setNuevaCantidad(0);
    }
  };

  return (
    <>
      {
        platoObj
        ? <Button onClick={handleClickOpen} texto="Actualizar" tipo="default" />
        : <Button onClick={handleClickOpen} texto="Agregar Plato" tipo="green" />
      }
      
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleUpdatePlato();
          },
        }}
      >
        <DialogTitle>{ platoObj ? `Actualizar ${platoObj.nombre}` : "Crear plato"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Modifique cualquier campo y haga click en Actualizar.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="nombre"
            name="nombre"
            label="Nombre"
            type="text"
            fullWidth
            variant="outlined"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="descripcion"
            name="descripcion"
            label="Descripción"
            type="text"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
          />
          {precios.length > 0 ? (
    precios.map((p, index) => (
        <PlatoPrecioUpdateRow
            key={index}
            precioObj={p}
            updatePrecio={(updatedPrecio) => updatePrecio(updatedPrecio, index)}
            index={index}
        />
    ))
) : (
    <PlatoPrecioUpdateRow
        key={precios.length}
        precioObj={{
            precio: 0,
            cantidad: 1,
            is_active: false
        }}
        updatePrecio={(updatedPrecio) => updatePrecio(updatedPrecio, precios.length)}
        index={precios.length}
    />
)}

          {
             platoObj
             ?<>
             <div className="flex">
               <TextField
                 autoFocus
                 required
                 margin="dense"
                 id="nuevaCantidad"
                 name="nuevaCantidad"
                 label="Nueva Cantidad"
                 type="number"
                 value={nuevaCantidad}
                 onChange={(event) => setNuevaCantidad(Number(event.target.value))}
                 fullWidth
                 variant="outlined"
               />
               <TextField
                 autoFocus
                 required
                 margin="dense"
                 id="nuevoPrecio"
                 name="nuevoPrecio"
                 label="Nuevo Precio"
                 type="number"
                 value={nuevoPrecio}
                 onChange={(event) => setNuevoPrecio(Number(event.target.value))}
                 fullWidth
                 variant="outlined"
               />
             </div>
             <Button onClick={handleAddPrecio} texto="Agregar Precio" tipo="default" />
             </>
            : <></>
          }
          
        </DialogContent>
        <div className="flex justify-between p-6">
        <Button
          onClick={()=>{setActivo(!activo)}}
          texto={activo ? "Activo" : "Inactivo"}
          tipo={activo ? "green" : "red"}
        />
        <div>
            
        <Button onClick={handleClose} tipo="red" texto="Cancelar" />
        {
          platoObj
          ? <Button onClick={handleUpdatePlato} tipo="default" texto="Actualizar" />
          : <Button onClick={handleCreatePlato} tipo="green" texto="Crear" />
        }
        </div>
      </div>
            
        
      </Dialog>
    </>
  );
};

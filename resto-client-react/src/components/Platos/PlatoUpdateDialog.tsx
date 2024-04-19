// import React, { useState } from "react";
// import Button from "./Button";
// import TextField from "@mui/material/TextField";
// import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import { Plato, Precio } from "../models";
// import PlatoPrecioUpdateRow from "./PlatoPrecioUpdateRow";

// interface Props {
//   platoObj: Plato;
// }

// export default function PlatoUpdateDialog({ platoObj }: Props) {
//   const { id } = platoObj;
//   const [nombre, setNombre] = useState(platoObj.nombre);
//   const [precios, setPrecios] = useState<Precio[]>(platoObj.precios);
//   const [activo, setActivo] = useState(platoObj.is_active);
//   const [descripcion, setDescripcion] = useState(platoObj.descripcion);
//   const [open, setOpen] = useState(false);
//   const [nuevoPrecio, setNuevoPrecio] = useState<number>(0); // Nuevo estado local para el precio
//   const [nuevaCantidad, setNuevaCantidad] = useState<number>(0); // Nuevo estado local para la cantidad

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const updatePrecio = (updatedPrecio: Precio) => {
//     // Obtener el índice del precio actualizado en la lista de precios
//     const updatedIndex = precios.findIndex(
//       (p) =>
//         p.precio === updatedPrecio.precio &&
//         p.cantidad === updatedPrecio.cantidad
//     );

//     // Crear una nueva lista de precios con el precio actualizado
//     const updatedPrecios = [...precios];
//     updatedPrecios[updatedIndex] = updatedPrecio;

//     // Actualizar el estado de la lista de precios con la lista actualizada
//     setPrecios(updatedPrecios);
//   };

//   const handleAddPrecio = () => {
//     if (
//       nuevoPrecio !== 0 &&
//       nuevaCantidad !== 0 &&
//       !precios.some((p) => p.cantidad === nuevaCantidad)
//     ) {
//       const newPrecio: Precio = {
//         precio: nuevoPrecio,
//         cantidad: nuevaCantidad,
//         activo: false,
//       };
//       setPrecios([...precios, newPrecio]);
//       setNuevoPrecio(0);
//       setNuevaCantidad(0);
//     }
//   };

//   return (
//     <React.Fragment>
//       <Button onClick={handleClickOpen} texto="Actualizar" tipo="default" />
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           component: "form",
//           onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
//             event.preventDefault();
//             const formData = new FormData(event.currentTarget);
//             const formJson = Object.fromEntries(formData.entries());
//             const email = formJson.email;
//             console.log(email);
//             handleClose();
//           },
//         }}
//       >
//         <DialogTitle>Actualizar {platoObj.nombre}</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Modifique cualquier campo y haga click en Actualizar.
//           </DialogContentText>
//           <TextField
//             autoFocus
//             required
//             margin="dense"
//             id="nombre"
//             name="nombre"
//             label="Nombre"
//             type="text"
//             fullWidth
//             variant="outlined"
//             defaultValue={nombre}
//             onChange={(event) => setNombre(event.target.value)}
//           />
//           <TextField
//             autoFocus
//             required
//             margin="dense"
//             id="descripcion"
//             name="descripcion"
//             label="Descripción"
//             type="text"
//             multiline
//             rows={4}
//             fullWidth
//             variant="outlined"
//             defaultValue={descripcion}
//             onChange={(event) => setDescripcion(event.target.value)}
//           />

//           <div>
//             {precios.map((p, index) => (
//               <PlatoPrecioUpdateRow
//                 key={index}
//                 precioObj={p}
//                 updatePrecio={updatePrecio}
//                 id={index}
//               />
//             ))}
//             <div>
//               <div className="flex">
//                 <TextField
//                   autoFocus
//                   required
//                   margin="dense"
//                   id="nuevaCantidad"
//                   name="nuevaCantidad"
//                   label="Nueva Cantidad"
//                   type="number"
//                   value={nuevaCantidad}
//                   onChange={(event) =>
//                     setNuevaCantidad(Number(event.target.value))
//                   }
//                   fullWidth
//                   variant="outlined"
//                 />
//                 <TextField
//                   autoFocus
//                   required
//                   margin="dense"
//                   id="nuevoPrecio"
//                   name="nuevoPrecio"
//                   label="Nuevo Precio"
//                   type="number"
//                   value={nuevoPrecio}
//                   onChange={(event) =>
//                     setNuevoPrecio(Number(event.target.value))
//                   }
//                   fullWidth
//                   variant="outlined"
//                 />
//               </div>
//               <Button
//                 onClick={handleAddPrecio}
//                 texto="Agregar Precio"
//                 tipo="default"
//               />
//             </div>
//           </div>
//         </DialogContent>
//         <div className="flex justify-between p-6">
//           {activo ? (
//             <Button
//               onClick={() => setActivo(!activo)}
//               texto="Activo"
//               tipo="green"
//             ></Button>
//           ) : (
//             <Button
//               onClick={() => setActivo(!activo)}
//               texto="Inactivo"
//               tipo="red"
//             ></Button>
//           )}
//           <div>
//             <Button onClick={handleClose} tipo="red" texto="Cancelar" />
//             <Button tipo="default" texto="Actualizar" />
//           </div>
//         </div>
//       </Dialog>
//     </React.Fragment>
//   );
// }


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
  platoObj: Plato;
}

export const PlatoUpdateDialog: React.FC<Props> = ({ platoObj }) => {
  const { updatePlato } = usePlatos();
  const [nombre, setNombre] = useState(platoObj.nombre);
  const [descripcion, setDescripcion] = useState(platoObj.descripcion);
  const [precios, setPrecios] = useState<Precio[]>(platoObj.precios);
  const [activo, setActivo] = useState(platoObj.is_active);
  const [open, setOpen] = useState(false);
  const [nuevoPrecio, setNuevoPrecio] = useState<number>(0);
  const [nuevaCantidad, setNuevaCantidad] = useState<number>(0);

useEffect(() => {
  setNombre(platoObj.nombre);
  setDescripcion(platoObj.descripcion);
  setPrecios(platoObj.precios);
  setActivo(platoObj.is_active);
}, [open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdatePlato = () => {
    const updatedPlato: Plato = {
      ...platoObj,
      nombre: nombre,
      descripcion: descripcion,
      precios: precios,
      is_active: activo,
    };
    const platoForServer = {
        nombre: updatedPlato.nombre,
        descripcion: updatedPlato.descripcion,
        is_active: updatedPlato.is_active,
    }
    const preciosForServer = updatedPlato.precios.map((p) => {
        return {
            precio: p.precio,
            cantidad: p.cantidad,
            activo: p.activo
        }
    })
    // todo Actualizar plato y precios en servidor
    updatePlato(updatedPlato);
    handleClose();
  };

  const updatePrecio = (updatedPrecio: Precio, index: number) => {
    const updatedPrecios = [...precios];
    updatedPrecios[index] = updatedPrecio;
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
        activo: false,
      };
      setPrecios([...precios, newPrecio]);
      setNuevoPrecio(0);
      setNuevaCantidad(0);
    }
  };

  return (
    <>
      <Button onClick={handleClickOpen} texto="Actualizar" tipo="default" />
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
        <DialogTitle>Actualizar {platoObj.nombre}</DialogTitle>
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

          {precios.map((p, index) => (
            <PlatoPrecioUpdateRow
              key={index}
              precioObj={p}
              updatePrecio={(updatedPrecio) => updatePrecio(updatedPrecio, index)}
              index={index}
            />
          ))}
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
        </DialogContent>
        <div className="flex justify-between p-6">
        <Button
          onClick={()=>{setActivo(!activo)}}
          texto={activo ? "Inactivo" : "Activo"}
          tipo={activo ? "red" : "green"}
        />
        <div>
            
        <Button onClick={handleClose} tipo="red" texto="Cancelar" />
        <Button onClick={handleUpdatePlato} tipo="default" texto="Actualizar" />
        </div>
      </div>
            
        
      </Dialog>
    </>
  );
};

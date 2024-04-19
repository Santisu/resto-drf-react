import { Typography } from "@mui/material";
import { Precio } from "../../models";

interface Props {
    id: number
    precioObj: Precio
    updatePrecioActive: (updatedPrecio: Precio, index: number) => void
}

export default function PlatoPrecioRow({
    id,
    precioObj,
    updatePrecioActive,
}: Props) {
  const { precio, cantidad, activo} = precioObj
  
  const clickPrecioActive = () => {
    const updatedPrecio = { ...precioObj, activo: !activo };
    // todo actualizar precio en servidor

    updatePrecioActive(updatedPrecio, id);
  };

  return (
    <>
      <div
        key={id}
        className={
          activo
            ? "bg-green-100 hover:bg-green-200 py-1 cursor-pointer"
            : "bg-red-100 hover:bg-red-200 py-1 cursor-pointer"
        }
        onClick={() => clickPrecioActive()}
      >
        <div className="flex justify-between w-full">
          <Typography fontWeight={700} marginLeft={1}>
            {precio}
          </Typography>
          <Typography fontWeight={700} marginRight={5}>
            {cantidad}
          </Typography>
        </div>
      </div>
    </>
  );
}

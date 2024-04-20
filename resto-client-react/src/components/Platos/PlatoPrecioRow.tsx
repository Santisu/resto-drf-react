import { Typography } from "@mui/material";
import { Precio } from "../../models";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
    id: number;
    precioObj: Precio;
    updatePrecioActive: (updatedPrecio: Precio, index: number) => void;
}

export default function PlatoPrecioRow({
    id,
    precioObj,
    updatePrecioActive,
}: Props) {
    const { precio, cantidad } = precioObj;
    const [isActive, setIsActive] = useState(precioObj.is_active);

    const clickPrecioActive = () => {
        if (cantidad === 1){
          toast.error('El valor unitario debe estar siempre activo');
          return
        }
        const updatedPrecio = { ...precioObj, is_active: !isActive };
        setIsActive(!isActive);
        updatePrecioActive(updatedPrecio, id);
    };

    return (
        <>
            <div
                key={id}
                className={
                    isActive
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

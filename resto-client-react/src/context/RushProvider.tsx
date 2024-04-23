import { createContext, useEffect, useState, useContext } from "react";
import { Plato, VentaCreate, VentaResponse } from "../models";
import { getPlatos, getPlatosRush } from "../api/authService";
import toast from "react-hot-toast";

type RushContextType = {
  platos: Plato[];
  createVenta: (venta: VentaCreate) => void;
  updateVenta: (venta: VentaCreate) => void;
  ventasToday: VentaResponse[];
};

type Props = { children: React.ReactNode };

const RushContext = createContext<RushContextType>({} as RushContextType);

export const RushProvider = ({ children }: Props) => {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [ventasToday, setVentasToday] = useState<Venta[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    obtenerPlatos()
    .then((platos) => {
      if (platos) {
        setPlatos(platos);
        setIsReady(true);
      }
    });
  }, []);

  const updateVenta = async (updatedVenta: Venta) => {
    // try {
    //   const platoFromServer: Plato = await putPlato(updatedPlato);
    //   if (!platoFromServer.is_active) {
    //     setPlatos((prevPlatos) => {
    //       const filteredPlatos = prevPlatos.filter((plato) => plato.id !== platoFromServer.id);
    //       return [...filteredPlatos, platoFromServer];
    //     });
    //   } else {
    //     setPlatos((prevPlatos) =>
    //       prevPlatos.map((plato) =>
    //         plato.id === platoFromServer.id ? platoFromServer : plato
    //       )
    //     );
    //   }
    //   console.log(platos)
    // } catch (error: any) {
    //   if ((typeof error.message === 'object') ){
    //     Object.entries(error.message).forEach(([key, value]) => {
    //       toast.error(`${key}: ${value}`);
    //     });
    //   } else {
    //     toast.error(error.message);
    //   }
    // }
  };

  const createVenta = async (newVenta: Venta) => {
    // try {
    //   const elplato = PlatoCreateDto.create(newPlato)
    //   const platoFromServer: Plato = await postPlato(elplato);
    //   console.log(platoFromServer)
    //   setPlatos((prevPlatos) => [...prevPlatos, platoFromServer]);

    // } catch (error: any) {
    //   if ((typeof error.message === 'object') ){
    //     Object.entries(error.message).forEach(([key, value]) => {
    //       toast.error(`${key}: ${value}`);
    //     });
    //   } else {
    //     toast.error(error.message);
    //   }
    // }
  };
  
  const obtenerPlatos = async() => {
    try {
      const platosFromServer: Plato[] = await getPlatosRush();
      return platosFromServer;
    } catch (error: any) {
      if ((typeof error.message === 'object') ){
        Object.entries(error.message).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
      } else {
        toast.error(error.message);
      }
    }
  }


  return (
    <RushContext.Provider
      value={{
        platos,
        updateVenta,
        createVenta,
        ventasToday,
      }}
    >
      {isReady ? children : null}
    </RushContext.Provider>
  );
};

export const useRush = () => useContext(RushContext);

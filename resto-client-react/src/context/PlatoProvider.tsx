import { createContext, useEffect, useState, useContext } from "react";
import { Plato, PlatoCreateDto, Precio } from "../models";
import { getPlatos, postPlato, putPlato, updatePrecio } from "../api/authService";
import toast from "react-hot-toast";

type PlatosContextType = {
  platos: Plato[];
  updatePlato: (plato: Plato) => void;
  createPlato: (plato: Plato) => void;
  actualizarPrecio: (precio: Precio, plato: Plato) => void;
};

type Props = { children: React.ReactNode };

const PlatosContext = createContext<PlatosContextType>({} as PlatosContextType);

export const PlatosProvider = ({ children }: Props) => {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    obtenerPlatos().then((platos) => {
      if (platos) {
        setPlatos(platos);
        setIsReady(true);
      }
    });
  }, []);

  const updatePlato = async (updatedPlato: Plato) => {
    try {
      const platoFromServer: Plato = await putPlato(updatedPlato);
      if (!platoFromServer.is_active) {
        setPlatos((prevPlatos) => {
          const filteredPlatos = prevPlatos.filter((plato) => plato.id !== platoFromServer.id);
          return [...filteredPlatos, platoFromServer];
        });
      } else {
        setPlatos((prevPlatos) =>
          prevPlatos.map((plato) =>
            plato.id === platoFromServer.id ? platoFromServer : plato
          )
        );
      }
      console.log(platos)
    } catch (error: any) {
      if ((typeof error.message === 'object') ){
        Object.entries(error.message).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
      } else {
        toast.error(error.message);
      }
    }
  };

  const createPlato = async (newPlato: Plato) => {
    try {
      const elplato = PlatoCreateDto.create(newPlato)
      const platoFromServer: Plato = await postPlato(elplato);
      console.log(platoFromServer)
      setPlatos((prevPlatos) => [...prevPlatos, platoFromServer]);

    } catch (error: any) {
      if ((typeof error.message === 'object') ){
        Object.entries(error.message).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
      } else {
        toast.error(error.message);
      }
    }
  };
  
  const obtenerPlatos = async() => {
    try {
      const platosFromServer: Plato[] = await getPlatos();
      console.log(platosFromServer)
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

  const actualizarPrecio = async (precio: Precio, plato:Plato) => {
    try {
      const platoFromServer: Plato = await updatePrecio(precio, plato);
      setPlatos((prevPlatos) =>
        prevPlatos.map((plato) =>
          plato.id === platoFromServer.id ? platoFromServer : plato
        )
      )
    } catch (error: any) {
      
    }
  }

  return (
    <PlatosContext.Provider
      value={{
        platos,
        updatePlato,
        createPlato,
        actualizarPrecio,
      }}
    >
      {isReady ? children : null}
    </PlatosContext.Provider>
  );
};

export const usePlatos = () => useContext(PlatosContext);

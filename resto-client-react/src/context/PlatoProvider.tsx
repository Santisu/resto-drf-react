import { createContext, useEffect, useState, useContext } from "react";
import { Plato } from "../models";

type PlatosContextType = {
  platos: Plato[];
  updatePlato: (plato: Plato) => void;
};

type Props = { children: React.ReactNode };

const PlatosContext = createContext<PlatosContextType>({} as PlatosContextType);

export const PlatosProvider = ({ children }: Props) => {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hardCodePlato = {
      id: 1,
      nombre: "Takoyaki",
      descripcion:
        "Hecho a base de harina de trigo y pulpo. Se hace en forma de una bola.",
      is_active: true,
      precios: [
        { precio: 1000, cantidad: 1, activo: false },
        { precio: 2000, cantidad: 2, activo: true },
       
      ],
    };
    setPlatos([hardCodePlato]);
    setIsReady(true);
  }, []);

  const updatePlato = (updatedPlato: Plato) => {
    setPlatos((prevPlatos) =>
      prevPlatos.map((plato) =>
        plato.id === updatedPlato.id ? updatedPlato : plato
      )
    );
  };

  return (
    <PlatosContext.Provider
      value={{
        platos,
        updatePlato,
      }}
    >
      {isReady ? children : null}
    </PlatosContext.Provider>
  );
};

export const usePlatos = () => useContext(PlatosContext);

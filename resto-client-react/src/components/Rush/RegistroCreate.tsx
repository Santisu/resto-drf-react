import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { Plato, VentaRegistroCreate } from '../../models';
import Button from '../Button';
import { useRush } from '../../context/RushProvider';

interface Props {
  platos: Plato[];
  registro?: VentaRegistroCreate;
  onDelete?: () => void;
  addRegistro?: (registro: VentaRegistroCreate) => void;
  updateRegistro?: (updatedRegistro: VentaRegistroCreate) => void;
}

export default function RegistroCreate({
  registro,
  onDelete,
  addRegistro,
  updateRegistro,
  platos,
}: Props) {
  const { platos: activePlatos } = useRush();
  const [selectedPlato, setSelectedPlato] = useState<Plato | undefined>(undefined);
  const [selectedCantidad, setSelectedCantidad] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!registro && selectedPlato !== undefined && selectedCantidad !== undefined) {
      const nuevoRegistro: VentaRegistroCreate = {
        platoId: selectedPlato.id,
        cantidad: selectedCantidad,
      };
      addRegistro && addRegistro(nuevoRegistro);
      setSelectedPlato(undefined);
      setSelectedCantidad(undefined);
    }
  }, [selectedPlato, selectedCantidad]);

  useEffect(() => {
    if (registro) {
      setSelectedPlato(activePlatos.find((plato) => plato.id === registro.platoId));
      setSelectedCantidad(registro.cantidad);
    }
  }, []);

  const handlePlatoChange = (event: SelectChangeEvent<number>) => {
    // Solo permitir cambios si no hay un registro seleccionado
    if (!registro) {
      let platoId = Number(event.target.value);
      setSelectedPlato(activePlatos.find((plato) => plato.id === platoId));
    }
  };

  const handleCantidadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let cantidad = Number(event.target.value);
    if (cantidad < 1 || isNaN(cantidad)) {
      cantidad = 1;
    }
    setSelectedCantidad(cantidad);
    // Actualizar el registro si registro está definido
    if (registro) {
      const updatedRegistro: VentaRegistroCreate = { ...registro, cantidad: cantidad };
      updateRegistro && updateRegistro(updatedRegistro);
    }
  };

  return (
    <div>
      <Box sx={{ minWidth: '100%' }}>
        <FormControl fullWidth>
          <InputLabel id="platos-label">Platos</InputLabel>
          <Select
            labelId="platos-label"
            id="platos-select"
            value={selectedPlato?.id || ''}
            label="Platos"
            onChange={handlePlatoChange}
            disabled={!!registro} // Deshabilitar la selección de platos si hay un registro seleccionado
          >
            {activePlatos.map((mappedPlato) => (
              <MenuItem
                key={mappedPlato.id}
                value={mappedPlato.id}
                disabled={!platos.find((plato) => plato.id === mappedPlato.id)}
              >
                {mappedPlato.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: '20%' }}>
        <TextField
          id="outlined-number"
          label="Cantidad"
          type="number"
          value={selectedCantidad || ''}
          onChange={handleCantidadChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      {onDelete && (
        <Box>
          <Button texto="Eliminar" tipo="red" onClick={onDelete} />
        </Box>
      )}
    </div>
  );
}

import { CustomError } from "../errors/CustomError"



export interface Plato {
    id: number
    nombre: string
    descripcion: string
    is_active: boolean
    precios: Precio[]
    
}

export interface CreatePlatoRequest {
    nombre: string
    is_active: boolean
    descripcion: string
    precio_unitario: number
}
export interface Precio {
    cantidad: number
    precio: number
    is_active: boolean
}

export class PlatoCreateDto {
    private constructor(
        public readonly nombre: string,
        public readonly is_active: boolean,
        public readonly descripcion: string,
        public readonly precio_unitario: number
    ) { }
    static create(request: Plato) {
        if (request.precios.length < 0) {
            throw new CustomError(400, "Plato debe tener precio");
        }
        const precioUnitario = request.precios.find((precio) => precio.cantidad === 1);
        if (precioUnitario) {
            return new PlatoCreateDto(request.nombre, request.is_active, request.descripcion, precioUnitario.precio);
        } else {
            throw new CustomError(400, "Plato debe tener precio unitario");
        }
    }
}
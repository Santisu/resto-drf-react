import { Plato } from "./Plato"


export interface VentaResponse {
    id: number
    precio_sin_descuento: number
    precio_con_descuento: number
    descuento: number
    timestamp: string
    is_paid: boolean
    is_delivered: boolean
    comentario: string
    detalle: VentaDetalleResponse[]
}


export interface VentaDetalleResponse {
    id: number
    plato: Plato
    precio_sin_descuento: number
    precio_con_descuento: number
    descuento: number
}



export interface VentaRegistroCreate {
    platoId: number
    cantidad: number
}

export interface VentaCreate {
    is_paid: boolean
    is_delivered: boolean
    comentario: string
    detalle: VentaRegistroCreate[]
}
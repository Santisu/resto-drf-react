


export interface Plato {
    id: number
    nombre: string
    descripcion: string
    is_active: boolean
    precios: Precio[]
    
}


export interface Precio {
    cantidad: number
    precio: number
    activo: boolean
}
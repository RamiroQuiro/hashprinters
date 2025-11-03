export interface Event {
  id: string
  nombre: string
  hashtag: string
  fecha: string
  descripcion: string
  isActive: boolean
}
export interface Fotos {
  id: string
  imageUrl: string
  username: string
  caption: string
  isPrinted: boolean
  isPrinting: boolean
}

import type { Event } from '@/types'
import { useState } from 'react'


interface EventoActualProps {
  currentEvent: Event | null
  onEventChange: (event: Event | null) => void
}

export default function Eventos({ currentEvent, onEventChange }: EventoActualProps) {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      nombre: 'Boda de Ana & Juan',
      hashtag: 'BodaAnaJuan2024',
      fecha: '2024-11-15',
      descripcion: 'Celebración de boda en Santiago del Estero',
      isActive: false
    },
    {
      id: '2',
      nombre: 'Fiesta Patronal 2024',
      hashtag: 'FiestaSantiagueña2024',
      fecha: '2024-12-10',
      descripcion: 'Fiesta tradicional de Santiago del Estero',
      isActive: false
    }
  ])

  const [newEvent, setNewEvent] = useState<Omit<Event, 'id' | 'isActive'>>({
    nombre: '',
    hashtag: '',
    fecha: '',
    descripcion: ''
  })

  /**
   * Handle creating a new event
   */
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.nombre || !newEvent.hashtag || !newEvent.fecha) {
      alert('Por favor, completa los campos obligatorios: Nombre, Hashtag y Fecha')
      return
    }

    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      isActive: false
    }
try {
  const response=await fetch('/api/eventos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message)
  }
  const data = await response.json()
  setEvents([...events, data])
  setNewEvent({
    nombre: '',
    hashtag: '',
    fecha: '',
    descripcion: ''
  })
} catch (error) {
  console.error('Error al crear el evento:', error)
}
  }

  /**
   * Handle activating an event
   */
  const handleActivateEvent = (event: Event) => {
    // Deactivate all other events
    const updatedEvents = events.map(e => ({
      ...e,
      isActive: e.id === event.id
    }))
    
    setEvents(updatedEvents)
    onEventChange(event)
  }

  /**
   * Handle deactivating current event
   */
  const handleDeactivateEvent = () => {
    const updatedEvents = events.map(e => ({
      ...e,
      isActive: false
    }))
    
    setEvents(updatedEvents)
    onEventChange(null)
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Eventos</h2>
        
        {/* Create New Event */}
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Crear Nuevo Evento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Evento *
              </label>
              <input
                type="text"
                value={newEvent.nombre}
                onChange={(e) => setNewEvent({...newEvent, nombre: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Boda de Ana & Juan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hashtag de Instagram *
              </label>
              <input
                type="text"
                value={newEvent.hashtag}
                onChange={(e) => setNewEvent({...newEvent, hashtag: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: BodaAnaJuan2024 (sin el #)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha del Evento *
              </label>
              <input
                type="date"
                value={newEvent.fecha}
                onChange={(e) => setNewEvent({...newEvent, fecha: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                type="text"
                value={newEvent.descripcion}
                onChange={(e) => setNewEvent({...newEvent, descripcion: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción opcional del evento"
              />
            </div>
          </div>
          <button
            onClick={handleCreateEvent}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Crear Evento
          </button>
        </div>

        {/* Events List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Eventos Existentes</h3>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{event.nombre}</h4>
                    <p className="text-sm text-gray-600">#{event.hashtag}</p> 
                    <p className="text-sm text-gray-500">{event.fecha} - {event.descripcion}</p>
                  </div>
                  <div className="flex space-x-2">
                    {event.isActive ? (
                      <button
                        onClick={handleDeactivateEvent}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivateEvent(event)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                      >
                        Activar Evento
                      </button>
                    )}
                  </div>
                </div>
                {event.isActive && (
                  <div className="mt-2 p-2 bg-green-100 text-green-700 rounded text-sm">
                    ✅ Este evento está actualmente activo en la pantalla pública
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
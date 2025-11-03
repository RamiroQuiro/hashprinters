import Button from '@/components/atomos/Button'
import { activateEvent, eventosStore, fetchEventos } from '@/context/eventos.store'
import type { Event } from '@/types'
import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'

export default function Eventos() {
  // Correct: Use the store directly for rendering.
  const {loading,data:eventos,error} = useStore(eventosStore)
console.log('eventos del storage ->',eventos)
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id' | 'isActive'>>({
    nombre: '',
    hashtag: '',
    fecha: '',
    descripcion: ''
  })

  // Correct: Fetch initial data only once on component mount.
  useEffect(() => {
    fetchEventos()
  }, [])

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newEvent.nombre || !newEvent.hashtag || !newEvent.fecha) {
      alert('Por favor, completa los campos obligatorios: Nombre, Hashtag y Fecha')
      return
    }

    const eventPayload: Omit<Event, 'id'> = {
      ...newEvent,
      isActive: false
    }
    try {
      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventPayload)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }
      
      // Correct: Reset form and refetch all events to update the list.
      setNewEvent({
        nombre: '',
        hashtag: '',
        fecha: '',
        descripcion: ''
      })
      await fetchEventos();

    } catch (error) {
      console.error('Error al crear el evento:', error)
    }
  }

  const handleActivarEvento = (event: Event) => {
    activateEvent(event);
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
            {/* Correct: Render from the store variable `eventos` */}
            {eventos?.map((event) => (
              event && event.id && (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{event.nombre}</h4>
                    <p className="text-sm text-gray-600">#{event.hashtag}</p> 
                    <p className="text-sm text-gray-500">{event.fecha} - {event.descripcion}</p>
                  </div>
                  <div className="flex space-x-2">
                    {event.isActive ? (
                      <Button
                      disabled={loading}
                        onClick={() => handleActivarEvento(event)}
                       variant='cancel'
                      >
                        Desactivar
                      </Button>
                    ) : (
                      <Button
                      disabled={loading}
                        onClick={() => handleActivarEvento(event)}
                       variant='blue'
                      >
                        Activar Evento
                      </Button>
                    )}
                  </div>
                </div>
                {event.isActive && (
                  <div className="mt-2 p-2 bg-green-100 text-green-700 rounded text-sm">
                    ✅ Este evento está actualmente activo en la pantalla pública
                  </div>
                )}
              </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
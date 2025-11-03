import { useState, useEffect } from 'react'
import type { Event } from '../../../types'
import Switch from '@/components/atomos/Switch'

// Frontend Photo interface
interface Photo {
  id: string
  imageUrl: string
  username: string
  caption: string
  createdAt: string // Using createdAt from DB
  status: 'pendiente' | 'aprobado' | 'rechazado'
}

// Database photo interface (matches the API response)
interface DbPhoto {
  id: string
  eventoId: string | null
  imageUrl: string
  instagramUrl: string | null
  username: string
  caption: string | null
  status: 'pendiente' | 'aprobado' | 'rechazado'
  printed: number | null
  impresiones: number | null
  createdAt: string | null
  updatedAt: string | null
  printedAt: string | null
}

interface PhotoModerationProps {
  currentEvent: Event | null
}

// Helper to map DB status to frontend status
const mapStatusToFrontend = (status: DbPhoto['status']): Photo['status'] => {
  switch (status) {
    case 'aprobado': return 'aprobado'
    case 'rechazado': return 'rechazado'
    case 'pendiente':
    default: return 'pendiente';
  }
};

export default function Moderacion({ currentEvent }: PhotoModerationProps) {
  const [autoApproval, setAutoApproval] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])

  const fetchPhotos = async () => {
    if (!currentEvent) return; // Don't fetch if there is no active event

    try {
      const response = await fetch(`/api/eventos/${currentEvent.id}/fotos?status=pendiente`);
      if (!response.ok) {
        throw new Error('Error fetching photos');
      }
      const dbPhotos: DbPhoto[] = await response.json();
      
      // Map DB data to frontend data structure
      const mappedPhotos = dbPhotos.map(p => ({
        id: p.id,
        imageUrl: p.imageUrl,
        username: p.username,
        caption: p.caption || '',
        createdAt: p.createdAt || new Date().toISOString(),
        status: mapStatusToFrontend(p.status),
      }));
      setPhotos(mappedPhotos);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
      // Here you could set an error state to show in the UI
    }
  };

  useEffect(() => {
    fetchPhotos();
    // Optional: Poll for new photos every few seconds
    const interval = setInterval(fetchPhotos, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, [currentEvent]);

  const updatePhotoStatus = async (photoId: string, newStatus: 'aprobado' | 'rechazado') => {
    const dbStatus = newStatus === 'aprobado' ? 'aprobado' : 'rechazado';
    try {
      const response = await fetch(`/api/fotos/${photoId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: dbStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update photo status');
      }

      // Update local state for instant feedback by removing the photo from the list
      setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));

    } catch (error) {
      console.error(`Failed to ${newStatus} photo:`, error);
    }
  };

  const handleApprove = (photoId: string) => {
    updatePhotoStatus(photoId, 'aprobado');
  };

  const handleReject = (photoId: string) => {
    updatePhotoStatus(photoId, 'rechazado');
  };

  const pendingPhotos = photos.filter(photo => photo.status === 'pendiente')
  // Note: The original component showed counters for approved/rejected photos.
  // This version removes photos from the state after moderation, so these lists are empty.
  // To show them, you'd need to fetch them from another API endpoint or manage a more complex state.
  const approvedPhotos: Photo[] = []
  const rejectedPhotos: Photo[] = []

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Moderación de Fotos</h2>
          <div className="flex items-center space-x-2">
           <Switch label="Aprobación Automática" checked={autoApproval} onChange={(e) => setAutoApproval(!autoApproval)} />
          </div>
        </div>

        {autoApproval && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
            <p>✅ La aprobación automática está activada. Todas las nuevas fotos serán aprobadas automáticamente.</p>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-700">{pendingPhotos.length}</div>
            <div className="text-sm text-blue-600">Pendientes</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-700">{approvedPhotos.length}</div>
            <div className="text-sm text-green-600">Aprobadas</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-700">{rejectedPhotos.length}</div>
            <div className="text-sm text-red-600">Rechazadas</div>
          </div>
        </div>

        {/* Pending Photos */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Fotos Pendientes de Moderación ({pendingPhotos.length})
          </h3>
          {pendingPhotos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay fotos pendientes de moderación
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingPhotos.map((photo) => (
                <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.caption}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-700">@{photo.username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(photo.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{photo.caption}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(photo.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-semibold transition-colors duration-200"
                      >
                        ✓ Aprobar
                      </button>
                      <button
                        onClick={() => handleReject(photo.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-semibold transition-colors duration-200"
                      >
                        ✗ Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* The sections for approved and rejected photos are now empty because we remove them from the state. */}

      </div>
    </div>
  )
}
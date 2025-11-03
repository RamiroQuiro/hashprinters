
import { useState, useEffect } from 'react'
import type { Event } from '@/types'

interface MetricasProps {
  currentEvent: Event | null
}

export default function Metricas({ currentEvent }: MetricasProps) {
  const [metrics, setMetrics] = useState({
    totalPhotos: 0,
    printedPhotos: 0,
    queuedPhotos: 0,
    approvedPhotos: 0,
    rejectedPhotos: 0
  })

  /**
   * Simulate real-time metrics updates
   */
  useEffect(() => {
    // Mock initial data
    setMetrics({
      totalPhotos: 45,
      printedPhotos: 28,
      queuedPhotos: 3,
      approvedPhotos: 40,
      rejectedPhotos: 5
    })

    // Simulate periodic updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalPhotos: prev.totalPhotos + Math.floor(Math.random() * 2),
        printedPhotos: prev.printedPhotos + Math.floor(Math.random() * 1),
        queuedPhotos: Math.max(0, prev.queuedPhotos + Math.floor(Math.random() * 2) - 1),
        approvedPhotos: prev.approvedPhotos + Math.floor(Math.random() * 1),
        rejectedPhotos: prev.rejectedPhotos + Math.floor(Math.random() * 1)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Event Status */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Estado del Evento</h2>
        {currentEvent ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">{currentEvent.name}</h3>
                <p className="text-gray-600">#{currentEvent.hashtag}</p>
                <p className="text-sm text-gray-500">{currentEvent.date}</p>
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                ✅ Activo
              </div>
            </div>
            <p className="text-gray-600">{currentEvent.description}</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📷</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay evento activo</h3>
            <p className="text-gray-500">Activa un evento desde la pestaña "Gestión de Eventos"</p>
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">📸</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fotos Totales</p>
              <p className="text-2xl font-bold text-gray-800">{metrics.totalPhotos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">🖨️</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fotos Impresas</p>
              <p className="text-2xl font-bold text-gray-800">{metrics.printedPhotos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">En Cola</p>
              <p className="text-2xl font-bold text-gray-800">{metrics.queuedPhotos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-gray-800">{metrics.approvedPhotos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">❌</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rechazadas</p>
              <p className="text-2xl font-bold text-gray-800">{metrics.rejectedPhotos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tasa de Aprobación</p>
              <p className="text-2xl font-bold text-gray-800">
                {metrics.totalPhotos > 0 
                  ? Math.round((metrics.approvedPhotos / metrics.totalPhotos) * 100) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Public Interface Preview */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Vista Previa - Pantalla Pública</h3>
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-900 min-h-[200px] flex items-center justify-center">
          {currentEvent ? (
            <div className="text-center text-white">
              <div className="text-4xl mb-4">📸</div>
              <h4 className="text-xl font-bold mb-2">{currentEvent.name}</h4>
              <p className="text-blue-400">#{currentEvent.hashtag}</p>
              <p className="text-gray-400 mt-4">Las fotos aprobadas aparecerán aquí en tiempo real</p>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-4">⏸️</div>
              <p>No hay evento activo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
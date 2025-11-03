import React from 'react'
import { useStore } from '@nanostores/react'
import { pestanaActiva } from '@/context/dashboard.store'
import type { Event } from '@/types'
import { CheckCheck, EvCharger, LayoutDashboardIcon } from 'lucide-react'

interface HeaderDashProps {
  onBack:boolean
  currentEvent: Event | null
}

export default function HeaderDash({ 
  currentEvent,
  onBack
}: HeaderDashProps) {
    const activeTab = useStore(pestanaActiva)
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
    { id: 'eventos', label: 'Eventos', icon: EvCharger },
    { id: 'moderacion', label: 'Moderar Fotos', icon: CheckCheck },
  ]

  return (
    <header className="bg-primary-100 text-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={()=>window.location.href = '/'}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                ← Inicio
              </button>
            )}
            <h1 className="text-2xl font-bold">PhotoPrint Admin</h1>
            {currentEvent ? (
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Evento Activo: {currentEvent.name}
              </div>
            ) : (
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                No hay evento activo
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Administrador</span>
            <button
              onClick={()=>{window.location.href = '/'}}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        
        <nav className="flex space-x-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            
            return(
            <button
              key={tab.id}
              onClick={() => pestanaActiva.set(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 cursor-pointer rounded-t-lg transition-colors duration-200 ${
                activeTab === tab.id 
                  ? ' text-[#2C3E50]' 
                  : ' hover:bg-white/50 hover:text-[#2C3E50]'
              }`}
            >
              <span>{<Icon />}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          )})}
        </nav>
      </div>
    </header>
  )
}

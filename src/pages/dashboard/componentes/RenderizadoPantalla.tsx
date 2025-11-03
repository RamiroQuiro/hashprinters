/**
 * Admin dashboard component
 */
import { useState } from 'react'
import HeaderDash from './HeaderDash'
import EventoActual from './Eventos'

import type { Event } from '../../../types'
import Moderacion from './Moderacion'
import Metricas from './Metricas'
import { Card } from '@/components/moleculas/Card'
import { pestanaActiva } from '@/context/dashboard.store'
import { useStore } from '@nanostores/react'

interface RenderizadoPantallaProps {
    currentEvent: Event | null
}
type RenderizadoPantallaTab = 'dashboard' | 'eventos' | 'moderacion'

export default function RenderizadoPantalla({ 
  currentEvent, 
}: RenderizadoPantallaProps) {
    const activeTab = useStore(pestanaActiva) as RenderizadoPantallaTab
console.log('pestaña activa',activeTab)
  const renderizado = () => {
    switch (activeTab) {
      case 'eventos':
        return (
          <EventoActual 
            currentEvent={currentEvent}
          />
        )
      case 'moderacion':
        return (
          <Moderacion currentEvent={currentEvent} />
        )
      case 'dashboard':
      default:
        return (
          <Metricas currentEvent={currentEvent} />
        )
    }
  }

  return (
    <Card className='p-10 border-none shadow-none'>

      
        {renderizado()}
      
    </Card>
  )
}
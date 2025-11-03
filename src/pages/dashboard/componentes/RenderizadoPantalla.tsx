/**
 * Admin dashboard component
 */
import EventoActual from './Eventos'

import type { Event } from '../../../types'
import Moderacion from './Moderacion'
import Metricas from './Metricas'
import { Card } from '@/components/moleculas/Card'
import { pestanaActiva } from '@/context/dashboard.store'
import { useStore } from '@nanostores/react'
type RenderizadoPantallaTab = 'dashboard' | 'eventos' | 'moderacion'

export default function RenderizadoPantalla() {
    const activeTab = useStore(pestanaActiva) as RenderizadoPantallaTab
console.log('pestaña activa',activeTab)
  const renderizado = () => {
    switch (activeTab) {
      case 'eventos':
        return (
          <EventoActual />
        )
      case 'moderacion':
        return (
          <Moderacion currentEvent={null} />
        )
      case 'dashboard':
      default:
        return (
          <Metricas currentEvent={null} />
        )
    }
  }

  return (
    <Card className='p-10 border-none shadow-none'>
        {renderizado()}
    </Card>
  )
}

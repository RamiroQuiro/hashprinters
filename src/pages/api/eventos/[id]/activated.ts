import type { APIRoute } from 'astro';
import { events } from '@/db/schema';
import { eq, ne } from 'drizzle-orm';
import db from '@/db';
import { createResponse } from '@/utils/responseAPI';

export const POST: APIRoute = async ({ params,request }) => {
  const eventId = params.id;
  const body = await request.json();
console.log('enpoitn de activacion, ',body)

  if (!eventId) {
    return createResponse(400,'ID de evento inválido.');
  }

  try {
    const activacionEventos=await db.transaction(async(tx)=>{
        const [event] = await tx.update(events).set({ isActive: !body.isActive }).where(eq(events.id, eventId)).returning();
        const desactivarOtros=await tx.update(events).set({ isActive: false }).where(ne(events.id, eventId)).returning();
        return event;
    })
    
    return createResponse(200,'evento activado',activacionEventos);
  } catch (error) {
    console.error('Error al obtener el evento:', error);
    return createResponse(500,'Error al activar el evento.');
  }
};

import type { APIRoute } from 'astro';
import { events } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db';

export const GET: APIRoute = async ({ params }) => {
  const eventId = params.id;

  if (!eventId) {
    return new Response(JSON.stringify({ message: 'ID de evento inválido.' }), { status: 400 });
  }

  try {
    const event = await db.select().from(events).where(eq(events.id, eventId)).get();

    if (!event) {
      return new Response(JSON.stringify({ message: 'Evento no encontrado.' }), { status: 404 });
    }

    return new Response(JSON.stringify(event), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor.' }), { status: 500 });
  }
};

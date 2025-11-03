
import type { APIRoute } from 'astro';
import { fotos } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db';

export const GET: APIRoute = async ({ params, url }) => {
  const eventId = params.id;
  const status = url.searchParams.get('status') as 'pendiente' | 'aprobada' | 'rechazada' | null;
console.log('eventId',eventId);
  if (!eventId) {
    return new Response(JSON.stringify({ message: 'ID de evento inválido.' }), { status: 400 });
  }

  try {
    // Base query
    let query = db.select().from(fotos).where(eq(fotos.eventoId, eventId));

    // Dynamically add status filter if provided
    if (status) {
      const allowedStatuses = ['pendiente', 'aprobada', 'rechazada'];
      if (allowedStatuses.includes(status)) {
        query = query.where(eq(fotos.status, status));
      } else {
        return new Response(JSON.stringify({ message: `El estado '${status}' es inválido.` }), { status: 400 });
      }
    }

    const result = await query.all();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching photos for event:', error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor.' }), { status: 500 });
  }
};


import type { APIRoute } from 'astro';
import { events } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { nombre, hashtag, descripcion, fecha } = body;
console.log('body',body);
    // Basic validation
    if (!nombre || !hashtag || !fecha) {
      return new Response(JSON.stringify({ message: 'Los campos nombre, hashtag y fecha son obligatorios.' }), { status: 400 });
    }

    // Generate a unique ID for the new event
    const newId = crypto.randomUUID();

    // Insert the new event into the database
    const newEvent = await db.insert(events).values({
      id: newId,
      nombre,
      hashtag,
      descripcion,
      fecha,
      isActive: false, // New events are inactive by default
      createdAt: new Date(),
    }).returning().get();

    return new Response(JSON.stringify(newEvent), { 
      status: 201, // 201 Created
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Error creating event:', error);
    if (error instanceof SyntaxError) { // Catches JSON parsing errors
        return new Response(JSON.stringify({ message: 'Cuerpo de la solicitud mal formado.' }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: 'Error interno del servidor.' }), { status: 500 });
  }
};

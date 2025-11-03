
import type { APIRoute } from 'astro';
import { db } from '../../../../db';
import { fotos } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export const PATCH: APIRoute = async ({ params, request }) => {
  const photoId = params.id;

  if (!photoId) {
    return new Response(JSON.stringify({ message: 'ID de foto inválido.' }), { status: 400 });
  }

  try {
    const body = await request.json();
    const newStatus = body.status;

    // Validate the new status
    const allowedStatus = ['aprobada', 'rechazada'];
    if (!newStatus || !allowedStatus.includes(newStatus)) {
      return new Response(JSON.stringify({ message: `El estado proporcionado es inválido. Use uno de: ${allowedStatus.join(', ')}` }), { status: 400 });
    }

    // Update the photo status in the database
    const result = await db.update(fotos).set({ status: newStatus }).where(eq(fotos.id, photoId)).run();

    // Drizzle/libsql doesn't give a clear 'not found' on update, so we just check if anything was changed.
    // For a more robust check, a SELECT could be done first.
    if (result.changes === 0) {
        return new Response(JSON.stringify({ message: 'Foto no encontrada o el estado ya era el mismo.' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: `La foto ${photoId} ha sido actualizada a ${newStatus}.` }), { status: 200 });

  } catch (error) {
    console.error('Error updating photo status:', error);
    if (error instanceof SyntaxError) { // Catches JSON parsing errors
        return new Response(JSON.stringify({ message: 'Cuerpo de la solicitud mal formado.' }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: 'Error interno del servidor.' }), { status: 500 });
  }
};

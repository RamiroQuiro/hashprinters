import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { events, fotos } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

// --- CONFIGURACIÓN DE LA API DE INSTAGRAM ---
const INSTAGRAM_API_URL = 'https://graph.instagram.com';
// Lee el token de acceso desde las variables de entorno (archivo .env)
const ACCESS_TOKEN = import.meta.env.INSTAGRAM_ACCESS_TOKEN;

console.log('accessToken',ACCESS_TOKEN);
export const POST: APIRoute = async () => {
  // Validar que el token de acceso exista
  if (!ACCESS_TOKEN) {
    console.error('Error: La variable de entorno INSTAGRAM_ACCESS_TOKEN no está definida.');
    return new Response(JSON.stringify({ message: 'El servidor no está configurado para acceder a Instagram.' }), { status: 500 });
  }

  try {
    // 1. Buscar el evento activo en nuestra base de datos
    const activeEvent = await db.select().from(events).where(eq(events.isActive, true)).get();
    if (!activeEvent) {
      return new Response(JSON.stringify({ message: 'No hay un evento activo configurado.' }), { status: 404 });
    }

    const hashtag = activeEvent.hashtag;

    // --- LLAMADA REAL A LA API DE INSTAGRAM ---

    // 2. Buscar el ID del Hashtag
    // La API de Instagram requiere que primero obtengas un ID para el hashtag que quieres buscar.
    const hashtagIdResponse = await fetch(`${INSTAGRAM_API_URL}/ig_hashtag_search?user_id=me&q=${hashtag}&access_token=${ACCESS_TOKEN}`);
    if (!hashtagIdResponse.ok) throw new Error('Error al buscar el ID del hashtag en Instagram');
    const hashtagIdData = await hashtagIdResponse.json();
    const hashtagId = hashtagIdData.data[0]?.id;

    if (!hashtagId) {
      return new Response(JSON.stringify({ message: `No se pudo encontrar el hashtag #${hashtag} en Instagram.` }), { status: 404 });
    }

    // 3. Obtener las fotos (media) recientes para ese Hashtag ID
    // Aquí pedimos los campos que nos interesan: id, caption, media_type, media_url, permalink, username.
    const fields = 'id,caption,media_type,media_url,permalink,username';
    const mediaResponse = await fetch(`${INSTAGRAM_API_URL}/${hashtagId}/recent_media?user_id=me&fields=${fields}&access_token=${ACCESS_TOKEN}`);
    if (!mediaResponse.ok) throw new Error('Error al obtener las fotos del hashtag en Instagram');
    const mediaData = await mediaResponse.json();
    const photosFromApi = mediaData.data;

    let newPhotosCount = 0;

    // 4. Procesar y guardar cada foto en nuestra base de datos
    for (const photo of photosFromApi) {
      // Solo procesamos imágenes, ignoramos videos.
      if (photo.media_type !== 'IMAGE') continue;

      // Revisar si la foto ya existe en nuestra DB para este evento
      const existingPhoto = await db.select().from(fotos).where(and(
        eq(fotos.id, photo.id),
        eq(fotos.eventoId, activeEvent.id)
      )).get();

      // Si no existe, la insertamos
      if (!existingPhoto) {
        await db.insert(fotos).values({
          id: photo.id, // Usamos el ID que nos da Instagram
          eventoId: activeEvent.id,
          imageUrl: photo.media_url,
          instagramUrl: photo.permalink,
          username: photo.username,
          caption: photo.caption,
          status: 'pendiente', // Todas las fotos nuevas entran como pendientes
        });
        newPhotosCount++;
      }
    }

    return new Response(JSON.stringify({ 
      message: `Proceso completado. Se encontraron ${photosFromApi.length} fotos, ${newPhotosCount} nuevas fueron añadidas.`,
    }), { status: 200 });

  } catch (error) {
    console.error('Error en el servicio de fetch de Instagram:', error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor al procesar las fotos.' }), { status: 500 });
  }
};

import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { events } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ redirect }) => {
  try {
    const activeEvent = await db.select().from(events).where(eq(events.isActive, true)).get();

    if (activeEvent) {
      return redirect(`/eventoactivo/${activeEvent.id}`, 302);
    } else {
      // No active event found, redirect to homepage or a specific 'no event' page
      return redirect('/', 302);
    }
  } catch (error) {
    console.error('Error fetching active event:', error);
    // Redirect to an error page or homepage on error
    return redirect('/500', 500); // Assuming a 500 error page exists
  }
};

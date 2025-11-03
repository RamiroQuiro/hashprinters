import { atom } from "nanostores";
import type { Event } from "@/types";


interface EventosState {
  loading: boolean;
  data: Event[] | null;
  error: string | null;
}

export const eventosStore = atom<EventosState>({
  loading: true,
  data: null,
  error: null,
});
export const fetchEventos = async () => {
  const response = await fetch("/api/eventos");
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message);
  }
  eventosStore.set({
    loading: false,
    data: data.data,
    error: null,
  });
  return data;
};

export const activateEvent = async (event: Event) => {
  try {
    const response = await fetch(`/api/eventos/${event.id}/activated`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    
    // Actualizar el store con los nuevos datos
    const currentEvents = eventosStore.get().data;
    const updatedEvents = currentEvents.map((e: Event) => 
      e.id === event.id ? { ...e, ...data.data } : {...e,isActive:false}
    );
    
    eventosStore.set({
      loading: false,
      data: updatedEvents,
      error: null,
    });
    return data.data;
  } catch (error) {
    console.error("Error al activar el evento:", error);
    eventosStore.set({
      loading: false,
      data: null,
      error: error.message,
    });
    throw error;
  }
};

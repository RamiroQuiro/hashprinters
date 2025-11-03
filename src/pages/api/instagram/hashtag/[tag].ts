
import type { APIRoute } from 'astro';

// This is a MOCK API endpoint. It simulates fetching data from Instagram.
// It returns a static list of fake photo data.

export const GET: APIRoute = async ({ params }) => {
  const tag = params.tag;

  // In a real scenario, you would use the Instagram API to search for the `tag`.
  // Here, we just return a mock response.

  const mockPhotos = [
    {
      id: `mock_1_${Date.now()}`,
      imageUrl: `https://picsum.photos/seed/${tag}_1/1080/1080`,
      instagramUrl: 'https://www.instagram.com/p/C0x0zZ1J5c0/', // Example URL
      username: 'ramiro.quiroga',
      caption: `This is a great photo with #${tag}`,
    },
    {
      id: `mock_2_${Date.now()}`,
      imageUrl: `https://picsum.photos/seed/${tag}_2/1080/1350`,
      instagramUrl: 'https://www.instagram.com/p/C0x0zZ1J5c0/',
      username: 'usuario_dos',
      caption: `Loving this event! #${tag}`,
    },
    {
      id: `mock_3_${Date.now()}`,
      imageUrl: `https://picsum.photos/seed/${tag}_3/1080/1080`,
      instagramUrl: 'https://www.instagram.com/p/C0x0zZ1J5c0/',
      username: 'otro_usuario',
      caption: `PrinterHash is awesome! #${tag}`,
    },
    {
      id: `mock_4_${Date.now()}`,
      imageUrl: `https://picsum.photos/seed/${tag}_4/1080/1350`,
      instagramUrl: 'https://www.instagram.com/p/C0x0zZ1J5c0/',
      username: 'test_user_4',
      caption: `Photo booth fun! #${tag}`,
    },
  ];

  return new Response(JSON.stringify(mockPhotos), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

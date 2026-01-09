import { supabase } from '@/lib/supabaseClient'

export async function deleteRoomImages(imageUrls: string[]) {
  if (!imageUrls || imageUrls.length === 0) return

  const paths = imageUrls.map((url) => {
    const parts = url.split('/room-images/')
    return parts[1]
  })

  const { error } = await supabase.storage
    .from('room-images')
    .remove(paths)

  if (error) {
    throw error
  }
}

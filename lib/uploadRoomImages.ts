import { supabase } from '@/lib/supabaseClient'

export async function uploadRoomImages(
  files: File[],
  ownerId: string
): Promise<string[]> {
  const uploadedUrls: string[] = []

  for (const file of files) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${ownerId}/${Date.now()}-${Math.random()}.${fileExt}`

    const { error } = await supabase.storage
      .from('room-images')
      .upload(fileName, file)

    if (error) {
      throw error
    }

    const { data } = supabase.storage
      .from('room-images')
      .getPublicUrl(fileName)

    uploadedUrls.push(data.publicUrl)
  }

  return uploadedUrls
}

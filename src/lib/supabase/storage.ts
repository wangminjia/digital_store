import { createServiceClient } from './client'

export async function uploadBookAsset(
  file: File,
  bookId: string,
  folder: 'covers' | 'pdfs' | 'epubs'
) {
  const supabase = createServiceClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${bookId}/${folder}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('book-assets')
    .upload(fileName, file, {
      metadata: { book_id: bookId },
    })

  if (error) {
    throw error
  }

  const { data: { publicUrl } } = supabase.storage
    .from('book-assets')
    .getPublicUrl(fileName)

  return { path: data.path, url: publicUrl }
}

export async function getSignedAssetUrl(
  path: string,
  expiresIn: number = 3600
) {
  const supabase = createServiceClient()
  
  const { data, error } = await supabase.storage
    .from('book-assets')
    .createSignedUrl(path, expiresIn)

  if (error) {
    throw error
  }

  return data.signedUrl
}

export async function deleteBookAsset(path: string) {
  const supabase = createServiceClient()
  
  const { error } = await supabase.storage
    .from('book-assets')
    .remove([path])

  if (error) {
    throw error
  }
}

// app/(pages)/board/requestImagesActions.ts
'use server'
import { uploadRequestImages } from '@/lib/airtable'

export async function uploadRequestImagesAction(
  recordId: string,
  images: { base64Content: string; filename: string; contentType: string }[]
) {
  if (images.length === 0) return { success: true }
  const success = await uploadRequestImages(recordId, images)
  return { success }
}
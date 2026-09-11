// app/(pages)/board/assetActions.ts
'use server'
import { getAllAssets, updateAssetStatus } from '@/lib/airtable'
import { revalidatePath } from 'next/cache'

export async function getAssetsAction() {
  return await getAllAssets()
}

export async function updateAssetStatusAction(
  assetId: string,
  status: 'Open' | 'Closed' | 'Under Maintenance',
  updatedBy: string,
  statusNote?: string
) {
  const success = await updateAssetStatus(assetId, status, updatedBy, statusNote)
  revalidatePath('/board/assets')
  revalidatePath('/management/assets')
  revalidatePath('/amenities')
  return { success }
}
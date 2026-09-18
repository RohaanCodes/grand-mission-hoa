// A reusable multi-image picker for any submission form (resident, board,
// management). Collects files client-side and hands the parent form plain
// base64 payloads it can send to a server action — the parent decides when
// to actually upload (after the request record itself has been created,
// since Airtable's upload endpoint needs an existing record to attach to).
'use client'
import { useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

export interface PickedImage {
  base64Content: string
  filename: string
  contentType: string
  previewUrl: string
}

const MAX_IMAGES = 6
const MAX_FILE_SIZE_MB = 8

export default function RequestImagePicker({
  images,
  onChange,
}: {
  images: PickedImage[]
  onChange: (images: PickedImage[]) => void
}) {
  const [error, setError] = useState('')

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return
    setError('')

    const remainingSlots = MAX_IMAGES - images.length
    if (remainingSlots <= 0) {
      setError(`You can attach up to ${MAX_IMAGES} images.`)
      return
    }

    const files = Array.from(fileList).slice(0, remainingSlots)
    const newImages: PickedImage[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`"${file.name}" is over ${MAX_FILE_SIZE_MB}MB and was skipped.`)
        continue
      }
      const base64 = await fileToBase64(file)
      newImages.push({
        base64Content: base64,
        filename: file.name,
        contentType: file.type,
        previewUrl: URL.createObjectURL(file),
      })
    }

    onChange([...images, ...newImages])
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Strip the "data:image/png;base64," prefix — Airtable wants raw base64
        resolve(result.split(',')[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  function removeImage(index: number) {
    const next = [...images]
    URL.revokeObjectURL(next[index].previewUrl)
    next.splice(index, 1)
    onChange(next)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Photos <span className="text-slate-400 font-normal">(optional, up to {MAX_IMAGES})</span>
      </label>

      <div className="flex flex-wrap gap-2">
        {images.map((img, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 group">
            <img src={img.previewUrl} alt={img.filename} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <label className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer transition-colors flex-shrink-0">
            <ImagePlus className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
            <span className="text-[10px] text-slate-400 mt-1">Add</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  )
}
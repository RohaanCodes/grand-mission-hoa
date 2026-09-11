// app/(pages)/board/ProfileForm.tsx
'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, LogOut, Check } from 'lucide-react'
import { uploadProfilePhotoAction, updateEmailAction, logoutAction } from './profileActions'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1]) // strip the data: prefix, API wants raw base64
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ProfileForm({
  role,
  recordId,
  name,
  email: initialEmail,
  photoUrl,
}: {
  role: 'board' | 'management'
  recordId: string
  name: string
  email: string
  photoUrl?: string
}) {
  const router = useRouter()
  const table = role === 'board' ? 'Board Members' : 'Management Companies'

  const [email, setEmail] = useState(initialEmail)
  const [savingEmail, setSavingEmail] = useState(false)
  const [emailSaved, setEmailSaved] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(photoUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploadingPhoto(true)
    setPhotoError(false)
    const base64 = await fileToBase64(file)
    const result = await uploadProfilePhotoAction(table, recordId, base64, file.name, file.type)
    setUploadingPhoto(false)
    if (!result.success) {
      setPhotoError(true)
      setPreview(photoUrl) // revert to whatever was actually saved before
      return
    }
    router.refresh()
  }

  async function handleSaveEmail() {
    if (email === initialEmail || savingEmail) return
    setSavingEmail(true)
    setEmailSaved(false)
    await updateEmailAction(table, recordId, email)
    setSavingEmail(false)
    setEmailSaved(true)
    router.refresh()
  }

  async function handleLogout() {
    await logoutAction(role)
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 max-w-xl">
      <div className="flex items-center gap-5 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-semibold overflow-hidden flex-shrink-0">
            {preview ? (
              <img src={preview} alt={name} className="w-full h-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-sm transition-colors disabled:opacity-60"
            title="Change profile photo"
          >
            <Camera className="w-4 h-4" strokeWidth={2} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{name}</h2>
          <p className="text-sm text-slate-500">{role === 'board' ? 'Board Member' : 'Management Company'}</p>
          {uploadingPhoto && <p className="text-xs text-blue-600 mt-1">Uploading photo…</p>}
          {photoError && <p className="text-xs text-red-600 mt-1">Upload failed, please try again.</p>}
        </div>
      </div>

      <label className="block mb-6">
        <span className="block text-sm font-medium text-slate-700 mb-2">Email</span>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailSaved(false)
            }}
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
          <button
            onClick={handleSaveEmail}
            disabled={savingEmail || email === initialEmail}
            className="px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {emailSaved ? <Check className="w-4 h-4" strokeWidth={2.5} /> : savingEmail ? 'Saving…' : 'Save'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          This is the email you sign in with, and where notifications are sent.
        </p>
      </label>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" strokeWidth={2} />
        Log Out
      </button>
    </div>
  )
}
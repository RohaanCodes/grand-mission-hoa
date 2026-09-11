// app/(pages)/board/StarButton.tsx
'use client'
import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { getStarredIdsAction, toggleStarAction } from './starActions'

export default function StarButton({
  requestRecordId,
  currentEmail,
  currentName,
}: {
  requestRecordId: string
  currentEmail: string
  currentName: string
}) {
  const [starred, setStarred] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getStarredIdsAction(currentEmail).then((ids) => {
      setStarred(ids.includes(requestRecordId))
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestRecordId, currentEmail])

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setStarred((v) => !v) // optimistic
    await toggleStarAction(requestRecordId, currentEmail, currentName)
    setSubmitting(false)
  }

  if (loading) return <div className="w-7 h-7" />

  return (
    <button
      onClick={handleClick}
      title={starred ? 'Remove from your starred items' : 'Star this for yourself'}
      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-amber-50 transition-colors flex-shrink-0"
    >
      <Star
        className={`w-4 h-4 transition-colors ${starred ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
        strokeWidth={2}
      />
    </button>
  )
}
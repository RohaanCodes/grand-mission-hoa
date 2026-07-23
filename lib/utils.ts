export function formatDate(date: string | Date): string {
  if (!date) return ''

  // Safe handling for YYYY-MM-DD (no timezone shift)
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    const [year, month, day] = date.slice(0, 10).split('-').map(Number)
    const localDate = new Date(year, month - 1, day) // local timezone, no UTC shift
    return localDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
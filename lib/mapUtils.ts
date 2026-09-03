// Security note: we only ever treat a submitted link as a real map
// link if, after resolving any redirect, it lands on a genuine Google
// Maps domain. This is a deterministic allowlist check, not an AI
// judgment call, since AI cannot reliably detect a malicious link.
// A link that fails this check is rejected entirely: not stored, not
// shown as clickable, not passed to coordinate extraction.

const ALLOWED_MAPS_DOMAINS = [
  'google.com',
  'maps.google.com',
  'goo.gl',
  'maps.app.goo.gl',
]

function isAllowedMapsDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    return ALLOWED_MAPS_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith('.' + domain)
    )
  } catch {
    return false
  }
}

export async function verifyAndResolveMapsLink(
  url: string
): Promise<{ verified: boolean; resolvedUrl: string | null }> {
  if (!url) return { verified: false, resolvedUrl: null }

  // Reject immediately if the submitted URL itself isn't even on an
  // allowed domain before attempting anything else.
  if (!isAllowedMapsDomain(url)) {
    return { verified: false, resolvedUrl: null }
  }

  let resolvedUrl = url
  if (url.includes('goo.gl')) {
    try {
      const res = await fetch(url, { redirect: 'follow' })
      resolvedUrl = res.url
    } catch {
      return { verified: false, resolvedUrl: null }
    }
    // Re-check the domain after following the redirect, since a
    // shortened link could in principle redirect somewhere else.
    if (!isAllowedMapsDomain(resolvedUrl)) {
      return { verified: false, resolvedUrl: null }
    }
  }

  return { verified: true, resolvedUrl }
}

export async function extractCoordsFromMapsLink(
  url: string
): Promise<{ lat: number; lng: number } | null> {
  const { verified, resolvedUrl } = await verifyAndResolveMapsLink(url)
  if (!verified || !resolvedUrl) return null

  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
  ]
  for (const p of patterns) {
    const m = resolvedUrl.match(p)
    if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }
  }
  return null
}
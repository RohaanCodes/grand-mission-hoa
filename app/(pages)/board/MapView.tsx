// app/(pages)/board/MapView.tsx
'use client'
import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { ServiceRequest } from '@/lib/types'

const CLOSED_STATUSES = ['Resolved', 'Closed', 'Closed (AI)']

const TILE_LAYERS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
}

function pinIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid white;box-shadow:0 1px 5px rgba(0,0,0,0.5);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -18],
  })
}

const OPEN_ICON = pinIcon('#2563eb')
const CLOSED_ICON = pinIcon('#16a34a')

function FitToMarkers({ points }: { points: [number, number][] }) {
  const map = useMap()
  useMemo(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 19)
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [50, 50], maxZoom: 18 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points.length])
  return null
}

export default function MapView({ requests }: { requests: ServiceRequest[] }) {
  const [showClosed, setShowClosed] = useState(false)
  const [layer, setLayer] = useState<'satellite' | 'street'>('satellite')

  const located = useMemo(
    () => requests.filter((r) => typeof r.latitude === 'number' && typeof r.longitude === 'number'),
    [requests]
  )

  const visible = useMemo(
    () => located.filter((r) => showClosed || !CLOSED_STATUSES.includes(r.status || '')),
    [located, showClosed]
  )

  const points: [number, number][] = visible.map((r) => [r.latitude as number, r.longitude as number])
  const center: [number, number] = points.length > 0 ? points[0] : [29.7604, -95.3698]

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-sm text-slate-500">
          {visible.length} of {located.length} located requests shown
          {requests.length !== located.length && (
            <span className="text-slate-400"> &middot; {requests.length - located.length} have no location on file</span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setLayer('satellite')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                layer === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setLayer('street')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                layer === 'street' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              Street
            </button>
          </div>
          <button
            onClick={() => setShowClosed((v) => !v)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              showClosed
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showClosed ? 'Showing all' : 'Showing open only'}
          </button>
        </div>
      </div>

      {located.length === 0 ? (
        <div className="bg-slate-50 rounded-lg p-12 text-center">
          <p className="text-slate-400 text-sm">No requests have a location on file yet.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-slate-100" style={{ height: 560 }}>
          <MapContainer center={center} zoom={18} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution={TILE_LAYERS[layer].attribution} url={TILE_LAYERS[layer].url} />
            <FitToMarkers points={points} />
            {visible.map((r) => {
              const isClosed = CLOSED_STATUSES.includes(r.status || '')
              return (
                <Marker
                  key={r.id}
                  position={[r.latitude as number, r.longitude as number]}
                  icon={isClosed ? CLOSED_ICON : OPEN_ICON}
                  eventHandlers={{
                    mouseover: (e) => e.target.openPopup(),
                    mouseout: (e) => e.target.closePopup(),
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: 180 }}>
                      <p style={{ fontWeight: 'bold', marginBottom: 4 }}>
                        {r.final_category || r.category_resident_selected || 'Other'}
                      </p>
                      <p style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
                        {r.requester_name}{r.unit_address ? ` · ${r.unit_address}` : ''}
                      </p>
                      <p style={{ fontSize: 12, marginBottom: 6 }}>{r.description}</p>
                      <p style={{ fontSize: 11, fontWeight: 'bold', color: isClosed ? '#16a34a' : '#2563eb' }}>
                        {r.status || 'New'}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      )}

      <div className="flex items-center gap-5 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2563eb' }} />
          <span className="text-xs text-slate-500">Open</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#16a34a' }} />
          <span className="text-xs text-slate-500">Closed</span>
        </div>
      </div>
    </div>
  )
}
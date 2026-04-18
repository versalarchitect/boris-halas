import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function PayloadTestPage() {
  const payload = await getPayload({ config })
  const { docs, totalDocs } = await payload.find({
    collection: 'photos',
    depth: 1,
    sort: 'order',
    limit: 100,
  })

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Payload-backed photos</h1>
      <p>totalDocs: {totalDocs}</p>
      <ul style={{ display: 'grid', gap: 16, listStyle: 'none', padding: 0 }}>
        {docs.map((p: any) => (
          <li key={p.id} style={{ border: '1px solid #ddd', padding: 12 }}>
            <strong>#{p.order} · {p.title}</strong>
            <div>category: {p.category}</div>
            <div>id: {p.id}</div>
            {p.image && typeof p.image === 'object' && (
              <>
                <div>url: {p.image.url}</div>
                <img
                  src={p.image.url}
                  alt={p.image.alt ?? ''}
                  style={{ maxWidth: 320, marginTop: 8 }}
                />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

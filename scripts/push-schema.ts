import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })
console.log('payload initialized')
console.log('collections:', Object.keys(payload.collections))

const photos = await payload.find({ collection: 'photos', limit: 1 })
console.log('photos query ok, totalDocs =', photos.totalDocs)
process.exit(0)

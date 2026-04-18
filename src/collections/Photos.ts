import type { CollectionConfig } from 'payload'

export const Photos: CollectionConfig = {
  slug: 'photos',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['order', 'title', 'category', 'image', 'updatedAt'],
    listSearchableFields: ['title'],
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Editorial', value: 'editorial' },
        { label: 'Fashion', value: 'fashion' },
        { label: 'Music', value: 'music' },
        { label: 'Somewhere', value: 'somewhere' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      index: true,
      admin: {
        description: 'Lower numbers appear first. Filter by category, sort by this column, then edit a row to move it.',
        step: 1,
      },
    },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && (data?.order === undefined || data.order === null || data.order === 0)) {
          const last = await req.payload.find({
            collection: 'photos',
            where: data?.category
              ? { category: { equals: data.category } }
              : { id: { exists: true } },
            sort: '-order',
            limit: 1,
            depth: 0,
          })
          const lastOrder = last.docs[0] && typeof last.docs[0].order === 'number' ? last.docs[0].order : 0
          data.order = lastOrder + 10
        }
        return data
      },
    ],
  },
}

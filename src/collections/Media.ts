import type { CollectionConfig } from 'payload'
import { isAuthenticated, isAdmin } from '@/access/helpers'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // Public can view media
    create: isAuthenticated, // Authenticated users can upload
    update: isAuthenticated,
    delete: isAdmin, // Only admins can delete media
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // These are not supported on Workers yet due to lack of sharp
    crop: false,
    focalPoint: false,
  },
}

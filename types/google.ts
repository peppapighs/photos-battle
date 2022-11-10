import { z } from 'zod'

export const AlbumList = z.object({
  albums: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      productUrl: z.string(),
      coverPhotoBaseUrl: z.string(),
      mediaItemsCount: z.string(),
    })
  ),
  nextPageToken: z.string().optional(),
})

export type AlbumList = z.infer<typeof AlbumList>

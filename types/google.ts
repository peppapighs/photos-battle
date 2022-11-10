import { z } from 'zod'

export const Album = z.object({
  id: z.string(),
  title: z.string(),
  productUrl: z.string(),
  coverPhotoBaseUrl: z.string(),
  mediaItemsCount: z.string(),
})

export type Album = z.infer<typeof Album>

export const AlbumList = z.object({
  albums: z.array(Album),
  nextPageToken: z.string().optional(),
})

export type AlbumList = z.infer<typeof AlbumList>

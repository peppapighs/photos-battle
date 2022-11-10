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

export const Media = z.object({
  id: z.string(),
  baseUrl: z.string(),
  productUrl: z.string(),
  mimeType: z.string(),
  filename: z.string(),
  mediaMetadata: z.record(z.any()),
})

export type Media = z.infer<typeof Media>

export const MediaList = z
  .object({
    mediaItemResults: z.array(z.object({ mediaItem: Media })),
    nextPageToken: z.string().optional(),
  })
  .transform(data => ({
    mediaItems: data.mediaItemResults.map(item => item.mediaItem),
    nextPageToken: data.nextPageToken,
  }))

export type MediaList = z.infer<typeof MediaList>

export const AlbumContents = z.object({
  mediaItems: z.array(Media),
  nextPageToken: z.string().optional(),
})

export type AlbumContents = z.infer<typeof AlbumContents>

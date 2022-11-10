import { NextApiRequest, NextApiResponse } from 'next'

import { unstable_getServerSession } from 'next-auth'
import { z } from 'zod'

import prisma from 'lib/prismadb'
import { AlbumContents, AlbumList, MediaList } from 'types/google'
import getGoogleAccessToken from 'utils/getGoogleAccessToken'

import { nextAuthOptions } from '../../auth/[...nextauth]'

const PHOTOS_PER_PAGE = 25

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req
  const session = await unstable_getServerSession(req, res, nextAuthOptions)

  const parsedQuery = z
    .object({ id: z.string(), pageToken: z.string().optional() })
    .safeParse(query)
  if (!parsedQuery.success) {
    res.status(400).end('Bad Request')
    return
  }
  const { id: albumId, pageToken } = parsedQuery.data

  if (!session?.user) {
    res.status(401).end('Unauthorized')
    return
  }

  const album = await prisma.album.findUnique({ where: { id: albumId } })
  if (!album || album.userId !== session.user.id) {
    res.status(404).end('Not Found')
    return
  }

  const accessToken = await getGoogleAccessToken(session.user.id)
  if (!accessToken) {
    res.status(404).end('Access token not found')
    return
  }

  if (method === 'GET') {
    const photos = await prisma.photo.findMany({
      take: PHOTOS_PER_PAGE,
      ...(pageToken &&
        pageToken !== '' && { skip: 1, cursor: { id: pageToken } }),
      where: { albumId },
      orderBy: [{ rating: 'desc' }, { id: 'asc' }],
    })

    if (photos.length === 0) {
      res.status(200).json({ mediaItems: [] })
      return
    }

    const url =
      'https://photoslibrary.googleapis.com/v1/mediaItems:batchGet?' +
      new URLSearchParams(photos.map(photo => ['mediaItemIds', photo.photoId]))

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      res.status(500).end('Unable to fetch photos in album')
      return
    }

    const data = await response.json()
    const nextPageToken = photos[photos.length - 1].id
    res.status(200).json(MediaList.parse({ ...data, nextPageToken }))
  } else if (method === 'POST') {
    const parsedBody = z
      .object({ pageToken: z.string().optional() })
      .safeParse(body)
    if (!parsedBody.success) {
      res.status(400).end('Bad Request')
      return
    }
    const { pageToken } = parsedBody.data

    const url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        pageSize: PHOTOS_PER_PAGE,
        albumId,
        ...(pageToken && { pageToken }),
      }),
    })

    if (!response.ok) {
      res.status(500).end('Unable to fetch album contents')
      return
    }

    const data = AlbumContents.parse(await response.json())
    await prisma.photo.createMany({
      data: data.mediaItems.map(photo => ({
        photoId: photo.id,
        albumId,
        userId: session.user.id,
      })),
      skipDuplicates: true,
    })

    res.status(200).json(data)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

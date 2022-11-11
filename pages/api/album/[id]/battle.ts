import { randomInt } from 'crypto'

import { NextApiRequest, NextApiResponse } from 'next'

import { unstable_getServerSession } from 'next-auth'
import { z } from 'zod'

import prisma from 'lib/prismadb'
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]'
import { MediaList } from 'types/google'
import getGoogleAccessToken from 'utils/getGoogleAccessToken'
import getUpdatedRating from 'utils/getUpdatedRating'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req
  const session = await unstable_getServerSession(req, res, nextAuthOptions)

  const parsedQuery = z.object({ id: z.string() }).safeParse(query)
  if (!parsedQuery.success) {
    res.status(400).end('Bad Request')
    return
  }
  const { id: albumId } = parsedQuery.data

  if (!session?.user) {
    res.status(401).end('Unauthorized')
    return
  }

  const album = await prisma.album.findUnique({
    where: { id: albumId },
    include: { _count: { select: { photos: true } } },
  })
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
    const photoCount = album._count.photos
    if (photoCount < 2) {
      res.status(404).end('Not enough photos')
      return
    }

    const rowIndex = Math.floor(Math.random() * (photoCount - 1))

    const photos = await prisma.photo.findMany({
      take: 2,
      skip: rowIndex,
      where: { albumId },
      orderBy: { rating: randomInt(2) === 0 ? 'asc' : 'desc' },
    })

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
      res.status(500).end('Unable to fetch paired photos')
      return
    }

    res.status(200).json(MediaList.parse(await response.json()))
  } else if (method === 'PATCH') {
    const parsedBody = z
      .object({ winner: z.string(), loser: z.string() })
      .safeParse(body)
    if (!parsedBody.success) {
      res.status(400).end('Bad Request')
      return
    }
    const { winner, loser } = parsedBody.data

    const winnerPhoto = await prisma.photo.findUnique({
      where: { photoId_albumId: { photoId: winner, albumId } },
    })
    const loserPhoto = await prisma.photo.findUnique({
      where: { photoId_albumId: { photoId: loser, albumId } },
    })
    if (
      !winnerPhoto ||
      !loserPhoto ||
      winnerPhoto.userId !== session.user.id ||
      loserPhoto.userId !== session.user.id
    ) {
      res.status(404).end('Photos not Found')
      return
    }

    const { winnerUpdatedRating, loserUpdatedRating } = getUpdatedRating(
      winnerPhoto.rating,
      loserPhoto.rating
    )
    await prisma.photo.update({
      where: { id: winnerPhoto.id },
      data: { rating: winnerUpdatedRating },
    })
    await prisma.photo.update({
      where: { id: loserPhoto.id },
      data: { rating: loserUpdatedRating },
    })

    res.status(200).end('OK')
  } else {
    res.setHeader('Allow', ['GET', 'PATCH'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

import { NextApiRequest, NextApiResponse } from 'next'

import { unstable_getServerSession } from 'next-auth'
import { z } from 'zod'

import prisma from 'lib/prismadb'
import { AlbumList } from 'types/google'
import getGoogleAccessToken from 'utils/getGoogleAccessToken'

import { nextAuthOptions } from '../auth/[...nextauth]'

const ALBUMS_PER_PAGE = 25

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req
  const session = await unstable_getServerSession(req, res, nextAuthOptions)

  if (!session?.user) {
    res.status(401).end('Unauthorized')
    return
  }

  const accessToken = await getGoogleAccessToken(session.user.id)
  if (!accessToken) {
    res.status(404).end('Access token not found')
    return
  }

  if (method === 'POST') {
    const parsedBody = z
      .object({ pageToken: z.string().optional() })
      .safeParse(body)
    if (!parsedBody.success) {
      res.status(400).end('Bad Request')
      return
    }
    const { pageToken } = parsedBody.data

    const url =
      'https://photoslibrary.googleapis.com/v1/albums?' +
      new URLSearchParams({
        pageSize: ALBUMS_PER_PAGE.toString(),
        ...(pageToken && { pageToken }),
      })

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!response.ok) {
      res.status(500).end('Unable to fetch album list')
      return
    }

    const data = AlbumList.parse(await response.json())
    await prisma.album.createMany({
      data: data.albums.map(album => ({
        id: album.id,
        userId: session.user.id,
      })),
      skipDuplicates: true,
    })

    res.status(200).json(data)
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

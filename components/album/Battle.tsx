import { ExclamationCircleIcon, FolderIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { AlbumContents } from 'types/google'

import PhotoCard, { SkeletonPhotoCard } from './PhotoCard'

function SkeletonBattle() {
  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      <div className="flex flex-col">
        <SkeletonPhotoCard />
        <div className="mt-4 inline-flex w-full animate-pulse items-center justify-center rounded-md border border-transparent bg-gray-200 py-3 px-6 shadow-sm dark:bg-gray-600">
          <div className="h-6 w-full"></div>
        </div>
      </div>
      <div className="flex flex-col">
        <SkeletonPhotoCard />
        <div className="mt-4 inline-flex w-full animate-pulse items-center justify-center rounded-md border border-transparent bg-gray-200 py-3 px-6 shadow-sm dark:bg-gray-600">
          <div className="h-6 w-full"></div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  albumId: string
}

export default function Battle({ albumId }: Props) {
  const queryClient = useQueryClient()

  const fetchPairedPhotos = async () => {
    const res = await fetch(`/api/album/${albumId}/battle`)
    return AlbumContents.parse(await res.json())
  }

  const updateRating = async (params: { winner: string; loser: string }) => {
    return fetch(`/api/album/${albumId}/battle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
  }

  const { status, data } = useQuery(
    ['album', albumId, 'play'],
    fetchPairedPhotos,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  const submitVote = useMutation(['album', albumId, 'play'], updateRating, {
    onSuccess() {
      return queryClient.invalidateQueries(['album', albumId, 'leaderboard'])
    },
    onSettled() {
      return queryClient.invalidateQueries(['album', albumId, 'play'])
    },
  })

  if (status === 'loading' || submitVote.status === 'loading') {
    return <SkeletonBattle />
  }

  if (status === 'error') {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-200 p-4 text-center dark:border-gray-700">
        <ExclamationCircleIcon className="h-24 w-auto text-red-400 dark:text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
          Error while loading photos.
        </h3>
        <p className="mt-1 text-base text-gray-600 dark:text-gray-300">
          Please refresh the page or try again later.
        </p>
      </div>
    )
  }

  if (data.mediaItems.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-200 p-4 text-center dark:border-gray-700">
        <FolderIcon className="h-24 w-auto text-gray-400 dark:text-gray-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
          Not enough photos to play.
        </h3>
        <p className="mt-1 text-base text-gray-600 dark:text-gray-300">
          Get started by loading some photos into your album.
        </p>
      </div>
    )
  }

  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      <div className="flex flex-col">
        <PhotoCard media={data.mediaItems[0]} sizes="50vw" />
        <button
          type="button"
          className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          onClick={() =>
            submitVote.mutate({
              winner: data.mediaItems[0].id,
              loser: data.mediaItems[1].id,
            })
          }
        >
          Pick
        </button>
      </div>
      <div className="flex flex-col">
        <PhotoCard media={data.mediaItems[1]} sizes="50vw" />
        <button
          type="button"
          className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          onClick={() =>
            submitVote.mutate({
              winner: data.mediaItems[1].id,
              loser: data.mediaItems[0].id,
            })
          }
        >
          Pick
        </button>
      </div>
    </div>
  )
}

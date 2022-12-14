import Image from 'next/image'

import { ListBulletIcon, PlayIcon } from '@heroicons/react/24/outline'
import { useWindowSize } from 'usehooks-ts'

import { Album } from 'types/google'

export function SkeletonAlbumCard({ ...props }) {
  return (
    <div
      className="col-span-1 flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg dark:divide-gray-600 dark:bg-gray-800"
      {...props}
    >
      <div>
        <div className="aspect-square animate-pulse bg-gray-200 dark:bg-gray-600"></div>
        <div className="px-4 py-2">
          <div className="h-5 w-3/4 animate-pulse rounded-full bg-gray-200 dark:bg-gray-600"></div>
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded-full bg-gray-200 dark:bg-gray-600"></div>
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200 dark:divide-gray-600">
          <div className="flex w-0 flex-1">
            <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4">
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-600"></div>
            </div>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4">
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  album: Album
  priority?: boolean
}

export default function AlbumCard({ album, priority, ...props }: Props) {
  const { width } = useWindowSize()

  const getCoverPhotoWidth = () => {
    if (width <= 640) {
      return width
    } else if (width <= 768) {
      return Math.ceil(width / 2)
    } else if (width <= 1024) {
      return Math.ceil(width / 3)
    }
    return 256
  }

  return (
    <div
      className="col-span-1 flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg dark:divide-gray-600 dark:bg-gray-800"
      {...props}
    >
      <div>
        <div className="relative aspect-square">
          <Image
            src={`${album.coverPhotoBaseUrl}=w${getCoverPhotoWidth()}`}
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            fill
            alt=""
          />
        </div>
        <div className="px-4 py-2">
          <p className="truncate text-base font-medium text-gray-900 dark:text-gray-100">
            {album.title}
          </p>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {album.mediaItemsCount} items
          </p>
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200 dark:divide-gray-600">
          <div className="flex w-0 flex-1">
            <a
              href={`/album/${album.id}/play`}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 transition hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400"
            >
              <PlayIcon
                className="h-5 w-5 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              />
              <span className="ml-3">Play</span>
            </a>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <a
              href={`/album/${album.id}`}
              className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 transition hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400"
            >
              <ListBulletIcon
                className="h-5 w-5 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              />
              <span className="ml-3">View</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

import Image from 'next/image'

import { ListBulletIcon, PlayIcon } from '@heroicons/react/24/outline'

import { Album } from 'types/google'

export function SkeletonAlbumCard({ ...props }) {
  return (
    <div
      className="col-span-1 flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
      {...props}
    >
      <div>
        <div className="aspect-square animate-pulse bg-gray-200"></div>
        <div className="px-4 py-2">
          <div className="h-5 w-3/4 animate-pulse rounded-full bg-gray-200"></div>
          <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-gray-200"></div>
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4">
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200"></div>
            </div>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4">
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  album: Album
}

export default function AlbumCard({ album, ...props }: Props) {
  return (
    <div
      className="col-span-1 flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
      {...props}
    >
      <div>
        <div className="relative aspect-square">
          <Image
            src={`${album.coverPhotoBaseUrl}=d`}
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority
            fill
            alt=""
          />
        </div>
        <div className="px-4 py-2">
          <p className="truncate text-base font-medium text-gray-900">
            {album.title}
          </p>
          <p className="text-sm font-medium text-gray-500">
            {album.mediaItemsCount} items
          </p>
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <a
              href={`/album/${album.id}/play`}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 transition hover:text-gray-500"
            >
              <PlayIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span className="ml-3">Play</span>
            </a>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <a
              href={`/album/${album.id}`}
              className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 transition hover:text-gray-500"
            >
              <ListBulletIcon
                className="h-5 w-5 text-gray-400"
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

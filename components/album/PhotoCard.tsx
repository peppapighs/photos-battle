import Image from 'next/image'

import { Media } from 'types/google'

export function SkeletonPhotoCard({ ...props }) {
  return (
    <li
      className="col-span-1 overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
      {...props}
    >
      <div className="aspect-square animate-pulse bg-gray-200"></div>
      <div className="px-4 py-2">
        <div className="h-6 w-3/4 animate-pulse rounded-full bg-gray-200"></div>
      </div>
    </li>
  )
}

interface Props {
  media: Media
}

export default function PhotoCard({ media, ...props }: Props) {
  return (
    <li
      className="col-span-1 overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
      {...props}
    >
      <div className="relative aspect-square">
        <Image
          src={`${media.baseUrl}=d`}
          className="object-cover object-top"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          fill
          alt=""
        />
      </div>
      <div className="px-4 py-2">
        <p className="truncate text-base font-medium text-gray-900">
          {media.filename}
        </p>
      </div>
    </li>
  )
}

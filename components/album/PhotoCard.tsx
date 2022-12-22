import { Fragment, useState } from 'react'

import Image from 'next/image'

import { Dialog, Transition } from '@headlessui/react'
import { useWindowSize } from 'usehooks-ts'

import { Media } from 'types/google'

export function SkeletonPhotoCard({ ...props }) {
  return (
    <div
      className="col-span-1 overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg dark:bg-gray-800"
      {...props}
    >
      <div className="aspect-square animate-pulse bg-gray-200 dark:bg-gray-600"></div>
      <div className="px-4 py-2">
        <div className="h-6 w-3/4 animate-pulse rounded-full bg-gray-200 dark:bg-gray-600"></div>
      </div>
    </div>
  )
}

interface Props {
  media: Media
  priority?: boolean
  sizes?: string
}

export default function PhotoCard({ media, priority, sizes, ...props }: Props) {
  const { width } = useWindowSize()

  const [open, setOpen] = useState(false)

  const getCoverPhotoWidth = () => {
    if (width <= 640) {
      return Math.ceil(width / 2)
    } else if (width <= 768) {
      return Math.ceil(width / 3)
    }
    return 256
  }

  return (
    <>
      <div
        className="group col-span-1 overflow-hidden rounded-lg bg-white shadow transition hover:cursor-pointer hover:bg-gray-100 hover:shadow-lg dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={() => setOpen(true)}
        {...props}
      >
        <div className="relative aspect-square">
          <Image
            src={`${media.baseUrl}=w${getCoverPhotoWidth()}`}
            className="object-cover object-top transition group-hover:brightness-90 dark:group-hover:brightness-110"
            sizes={
              sizes || '(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw'
            }
            priority={priority}
            fill
            alt=""
          />
        </div>
        <div className="px-4 py-2">
          <p className="truncate text-base font-medium text-gray-900 dark:text-gray-100">
            {media.filename}
          </p>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:max-w-xl sm:p-6 lg:max-w-2xl">
                  <div className="text-center">
                    <Dialog.Title className="truncate text-base font-medium text-gray-900 dark:text-gray-100">
                      {media.filename}
                    </Dialog.Title>
                  </div>
                  <div className="mt-4">
                    {'video' in media.mediaMetadata ? (
                      <video
                        controls
                        autoPlay
                        className="h-auto w-full rounded-md"
                      >
                        <source src={`${media.baseUrl}=dv`} />
                      </video>
                    ) : (
                      <Image
                        src={`${media.baseUrl}=d`}
                        className="h-auto w-full rounded-md"
                        width={0}
                        height={0}
                        sizes="100vw"
                        priority
                        alt=""
                      />
                    )}
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

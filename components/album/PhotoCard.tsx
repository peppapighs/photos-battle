import { Fragment, useState } from 'react'

import Image from 'next/image'

import { Dialog, Transition } from '@headlessui/react'

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
  const [open, setOpen] = useState(false)

  return (
    <>
      <li
        className="group col-span-1 overflow-hidden rounded-lg bg-white shadow transition hover:cursor-pointer hover:bg-gray-100 hover:shadow-lg"
        onClick={() => setOpen(true)}
        {...props}
      >
        <div className="relative aspect-square">
          <Image
            src={`${media.baseUrl}=d`}
            className="object-cover object-top transition group-hover:brightness-90"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority
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
                <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:max-w-xl sm:p-6 lg:max-w-2xl">
                  <div className="flex aspect-square flex-col items-center justify-center">
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
                      className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

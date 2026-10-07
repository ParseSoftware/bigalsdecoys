'use client';

import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useState } from 'react';

import { Modal } from '@/vibes/soul/primitives/modal';
import { Image } from '~/components/image';

interface Props {
  image?: { src: string; alt: string };
  images: Array<{ src: string; alt: string }>;
  title: string;
}

export function ByosProductImage({ image, images, title }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 50, y: 50 });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imageArray = image ? [image] : [];
  const galleryImages = images.length > 0 ? images : imageArray;
  const selectedImage = galleryImages[selectedImageIndex] ?? galleryImages[0];

  if (!selectedImage) {
    return <div className="row-span-2 aspect-square bg-contrast-100" />;
  }

  const updateLensPosition = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse') {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();

    setLensPosition({
      x: Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100)),
      y: Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100)),
    });
  };

  return (
    <>
      <div className="group/image relative row-span-2 aspect-square overflow-hidden bg-contrast-100">
        <button
          aria-label={`Open enlarged image of ${title}`}
          className="block h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
          onClick={() => setIsOpen(true)}
          onPointerMove={updateLensPosition}
          title="Zoom image"
          type="button"
        >
          <Image
            alt={selectedImage.alt}
            className="h-full w-full scale-150 object-cover transition duration-500 group-hover/image:scale-[1.6]"
            height={144}
            src={selectedImage.src}
            width={144}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/90 shadow-lg md:group-hover/image:block"
            style={{
              backgroundImage: `url(${selectedImage.src})`,
              backgroundPosition: `${lensPosition.x}% ${lensPosition.y}%`,
              backgroundSize: '350%',
            }}
          />
        </button>
        <button
          aria-label={`Zoom image of ${title}`}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
          onClick={() => setIsOpen(true)}
          title="Zoom image"
          type="button"
        >
          <ZoomIn aria-hidden="true" size={18} />
        </button>
      </div>

      <Modal
        className="w-[calc(100vw-2rem)] max-w-5xl bg-white"
        isOpen={isOpen}
        setOpen={setIsOpen}
        title={title}
      >
        <div className="flex max-h-[calc(90vh-5rem)] flex-col bg-contrast-100">
          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            <Image
              alt={selectedImage.alt}
              className="max-h-[calc(90vh-5rem)] w-auto max-w-full object-contain"
              height={1200}
              sizes="(min-width: 1024px) 80vw, calc(100vw - 2rem)"
              src={selectedImage.src}
              width={1200}
            />
            {galleryImages.length > 1 ? (
              <>
                <button
                  aria-label="Previous image"
                  className="absolute left-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-foreground shadow-sm disabled:opacity-40"
                  disabled={selectedImageIndex === 0}
                  onClick={() => setSelectedImageIndex((index) => index - 1)}
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" size={20} />
                </button>
                <button
                  aria-label="Next image"
                  className="absolute right-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-foreground shadow-sm disabled:opacity-40"
                  disabled={selectedImageIndex === galleryImages.length - 1}
                  onClick={() => setSelectedImageIndex((index) => index + 1)}
                  type="button"
                >
                  <ChevronRight aria-hidden="true" size={20} />
                </button>
              </>
            ) : null}
          </div>
          {galleryImages.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto border-t border-contrast-200 bg-white p-3">
              {galleryImages.map((galleryImage, index) => (
                <button
                  aria-label={`View image ${index + 1} of ${galleryImages.length}`}
                  aria-pressed={index === selectedImageIndex}
                  className="relative h-14 w-14 shrink-0 overflow-hidden border-2 border-transparent aria-pressed:border-primary"
                  key={galleryImage.src}
                  onClick={() => setSelectedImageIndex(index)}
                  type="button"
                >
                  <Image
                    alt=""
                    className="h-full w-full object-cover"
                    height={56}
                    src={galleryImage.src}
                    width={56}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
}

import React, {
  Children,
  cloneElement,
  CSSProperties,
  ReactElement,
  ReactNode
} from 'react'
import clsx from 'clsx'
import useCarousel from './useCarousel'

export default function useInfiniteSlides({
  children,
  slideStyles
}: {
  children: ReactNode
  slideStyles: CSSProperties
}) {
  const { currentSlide, options } = useCarousel()
  const slides = Children.toArray(children) as ReactElement[]

  const infiniteBefore = options.infinite
    ? new Array(options.visibleSlides + 1)
        .fill(null)
        .map((_, index) => (
          <div
            key={`infinite-before-${index}`}
            className={clsx(
              'carousel__slide',
              (currentSlide === slides.length - 1 - index ||
                currentSlide === (index + 1) * -1) &&
                'carousel__slide--active'
            )}
            style={slideStyles}
          >
            {cloneElement(
              slides[Math.abs((slides.length - 1 - index) % slides.length)]
            )}
          </div>
        ))
        .reverse()
    : null

  const infiniteAfter = options.infinite
    ? new Array(options.visibleSlides + 1).fill(null).map((_, index) => (
        <div
          key={`infinite-after-${index}`}
          className={clsx(
            'carousel__slide',
            currentSlide === index && 'carousel__slide--active'
          )}
          style={slideStyles}
        >
          {cloneElement(slides[Math.abs(index) % slides.length])}
        </div>
      ))
    : null

  return { infiniteAfter, infiniteBefore, slides }
}

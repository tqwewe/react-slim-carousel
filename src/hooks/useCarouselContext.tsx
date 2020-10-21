import { useCallback, useState } from 'react'
import { CarouselOptions } from '../options'
import { CarouselContext } from '../context'

export default function useCarouselContext(
  opts: CarouselOptions
): CarouselContext {
  // Options
  const [options, setOptions] = useState<CarouselOptions>(opts)

  // State
  const [currentSlide, setCurrentSlide] = useState<number>(opts.initialSlide)
  const [totalSlides, setTotalSlides] = useState<number>(0)
  const [isSliding, setIsSliding] = useState<boolean>(false)
  const [disableAnimation, setDisableAnimation] = useState<boolean>(true)

  // Calculated state
  const firstSlide = 0
  const lastSlide = totalSlides - options.visibleSlides
  const minSlide = options.infinite ? -Infinity : firstSlide
  const maxSlide = options.infinite ? Infinity : lastSlide
  const nextDisabled = currentSlide >= maxSlide
  const previousDisabled = currentSlide <= minSlide

  // Methods
  const checkInfinitePosition = () => {
    if (options.infinite) {
      if (currentSlide >= totalSlides) {
        setDisableAnimation(true)
        setCurrentSlide(firstSlide)
        setTimeout(() => {
          setDisableAnimation(false)
        })
      } else if (currentSlide <= options.visibleSlides * -1) {
        setDisableAnimation(true)
        setCurrentSlide(lastSlide)
        setTimeout(() => {
          setDisableAnimation(false)
        })
      }
    }
  }

  const goTo = useCallback(
    (slide: number) => {
      if (isSliding) {
        return currentSlide
      }

      const nextSlide = Math.min(maxSlide, Math.max(minSlide, slide))

      setIsSliding(true)
      setCurrentSlide(nextSlide)
      checkInfinitePosition()

      setTimeout(() => {
        setIsSliding(false)
      }, options.slideSpeed)

      return nextSlide
    },
    [
      currentSlide,
      isSliding,
      minSlide,
      maxSlide,
      checkInfinitePosition,
      options.slideSpeed
    ]
  )
  const next = useCallback(() => goTo(currentSlide + options.slidesToScroll), [
    goTo,
    currentSlide,
    options
  ])
  const previous = useCallback(
    () => goTo(currentSlide - options.slidesToScroll),
    [goTo, currentSlide, options]
  )
  const first = useCallback(() => goTo(firstSlide), [goTo, firstSlide])
  const last = useCallback(() => goTo(lastSlide), [goTo, lastSlide])

  return {
    // Options
    options,
    setOptions,

    // State
    currentSlide,
    totalSlides,
    disableAnimation,
    isSliding,
    setTotalSlides,
    setDisableAnimation,
    setIsSliding,

    // Calculated state
    nextDisabled,
    previousDisabled,

    // Methods
    goTo,
    next,
    previous,
    first,
    last,
    checkInfinitePosition
  }
}

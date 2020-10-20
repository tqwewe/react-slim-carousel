import { useState } from 'react'
import { CarouselOptions } from './options'
import { CarouselContext } from './context'

export default function useCarouselContext(
  opts: CarouselOptions
): CarouselContext {
  // Options
  const [options, setOptions] = useState<CarouselOptions>(opts)

  // State
  const [currentSlide, setCurrentSlide] = useState<number>(opts.initialSlide)
  const [offset, setOffset] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [totalSlides, setTotalSlides] = useState<number>(0)

  // Calculated state
  const traySize = (totalSlides / options.visibeSlides) * 100
  const translation = (100 / totalSlides) * currentSlide * -1

  const trayStyles = {
    width: options.orientation === 'horizontal' ? `${traySize}%` : undefined,
    height: options.orientation === 'vertical' ? `${traySize}%` : undefined,
    transform: `translate${
      options.orientation === 'vertical' ? 'Y' : 'X'
    }(calc(${translation}% + ${offset}px))`,
    transition: isDragging ? 'none' : undefined
  }

  const firstSlide = 0
  const lastSlide = totalSlides - options.visibeSlides
  const minSlide = options.infinite ? -Infinity : firstSlide
  const maxSlide = options.infinite ? Infinity : lastSlide

  const nextDisabled = currentSlide >= maxSlide
  const previousDisabled = currentSlide <= minSlide

  // Methods
  const goTo = (slide: number) =>
    setCurrentSlide(Math.min(maxSlide, Math.max(minSlide, slide)))

  const next = () => goTo(currentSlide + options.slidesToScroll)
  const previous = () => goTo(currentSlide - options.slidesToScroll)
  const first = () => goTo(firstSlide)
  const last = () => goTo(lastSlide)

  return {
    options,
    setOptions,

    currentSlide,
    offset,
    setOffset,
    isDragging,
    setIsDragging,
    totalSlides,
    setTotalSlides,

    traySize,
    translation,
    trayStyles,
    nextDisabled,
    previousDisabled,

    goTo,
    next,
    previous,
    first,
    last
  }
}

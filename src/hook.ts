import { useEffect, useRef, useState } from 'react'
import { CarouselOptions } from './options'
import { CarouselContext } from './context'

export default function useCarouselContext(
  opts: CarouselOptions
): CarouselContext {
  // Options
  const [options, setOptions] = useState<CarouselOptions>(opts)

  // State
  const trayRef = useRef<HTMLDivElement>(null)
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

  const slideStyles = {
    width:
      options.orientation === 'horizontal'
        ? `${100 / options.visibeSlides}%`
        : undefined,
    height:
      options.orientation === 'vertical' ? `${100 / totalSlides}%` : undefined
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

  // Event handlers
  const handleMouseDown = () => setIsDragging(true)
  const handleTouchStart = () => setIsDragging(true)
  const handleBlur = () => setIsDragging(false)

  // Effects
  useEffect(() => {
    const handleDragEnd = () => {
      const slideSizePx = trayRef.current
        ? (options.orientation === 'vertical'
            ? trayRef.current.offsetHeight
            : trayRef.current.offsetWidth) / totalSlides
        : 0

      if (offset > slideSizePx * options.threshold) {
        previous()
      } else if (offset < slideSizePx * options.threshold * -1) {
        next()
      }

      setIsDragging(false)
      setOffset(0)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        setIsDragging(false)
        setOffset(0)
      }
    }

    const handleMouseMove = (ev: MouseEvent) => {
      if (isDragging) {
        setOffset(
          offset +
            (options.orientation === 'vertical' ? ev.movementY : ev.movementX)
        )
      }
    }

    document.addEventListener('mouseup', handleDragEnd)
    document.addEventListener('touchcancel', handleDragEnd)
    document.addEventListener('touchend', handleDragEnd)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchcancel', handleDragEnd)
      document.removeEventListener('touchend', handleDragEnd)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isDragging, offset, options])

  return {
    // Options
    options,
    setOptions,

    // State
    trayRef,
    currentSlide,
    offset,
    setOffset,
    isDragging,
    setIsDragging,
    totalSlides,
    setTotalSlides,

    // Calculated state
    traySize,
    translation,
    trayStyles,
    slideStyles,
    nextDisabled,
    previousDisabled,

    // Methods
    goTo,
    next,
    previous,
    first,
    last,

    // Event handlers
    handleMouseDown,
    handleTouchStart,
    handleBlur
  }
}

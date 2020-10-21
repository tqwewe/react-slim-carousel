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
  const [disableAnimation, setDisableAnimation] = useState<boolean>(true)
  const [isSliding, setIsSliding] = useState<boolean>(false)

  // Calculated state
  const totalSlidesWithInfinite = options.infinite
    ? totalSlides + options.visibeSlides * 2 + 2
    : totalSlides
  const traySize = (totalSlidesWithInfinite / options.visibeSlides) * 100
  const translation =
    (100 / totalSlidesWithInfinite) *
    (currentSlide + (options.infinite ? options.visibeSlides + 1 : 0)) *
    -1
  const axis = options.orientation === 'vertical' ? 'Y' : 'X'

  console.log(totalSlidesWithInfinite)

  const trayStyles = {
    // margin: options.infinite
    //   ? undefined
    //   : `${options.orientation === 'vertical' ? options.gap * 2 * -1 : 0}px ${
    //       options.orientation === 'horizontal' ? options.gap * 4 * -1 : 0
    //     }px`,
    width:
      options.orientation === 'horizontal'
        ? `calc(${traySize}% + ${
            (options.gap * totalSlidesWithInfinite) / 2
          }px)`
        : undefined,
    height:
      options.orientation === 'vertical'
        ? `calc(${traySize}% + ${options.gap * totalSlides}px)`
        : undefined,
    transform: `translate${axis}(calc(${translation}% + ${
      offset - options.gap / 2
    }px + ${
      options.centerMode
        ? (100 / totalSlidesWithInfinite / 2) * (options.visibeSlides - 1)
        : 0
    }% + ${
      options.orientation === 'vertical' && options.centerMode
        ? (options.gap / totalSlidesWithInfinite) * 2
        : 0
    }px))`,
    transition:
      isDragging || totalSlides === 0 || disableAnimation ? 'none' : undefined
  }

  const slideStyles = {
    margin: `${
      options.orientation === 'vertical' ? `${options.gap / 2}px` : '0'
    } ${options.orientation === 'horizontal' ? `${options.gap / 2}px` : '0'}`,
    width:
      options.orientation === 'horizontal'
        ? `calc(${100 / options.visibeSlides}% + ${options.gap * 2}px)`
        : undefined,
    height:
      options.orientation === 'vertical'
        ? `calc(${100 / totalSlidesWithInfinite}% - ${
            (options.gap * totalSlidesWithInfinite) / totalSlidesWithInfinite
          }px)`
        : undefined
  }

  const firstSlide = 0
  const lastSlide =
    totalSlides - options.visibeSlides + (options.centerMode ? 1 : 0)
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
      } else if (currentSlide <= options.visibeSlides * -1) {
        setDisableAnimation(true)
        setCurrentSlide(lastSlide)
        setTimeout(() => {
          setDisableAnimation(false)
        })
      }
    }
  }

  const goTo = (slide: number) => {
    if (isSliding) {
      return
    }

    setIsSliding(true)
    setCurrentSlide(Math.min(maxSlide, Math.max(minSlide, slide)))
    checkInfinitePosition()
  }

  const next = () => goTo(currentSlide + options.slidesToScroll)
  const previous = () => goTo(currentSlide - options.slidesToScroll)
  const first = () => goTo(firstSlide)
  const last = () => goTo(lastSlide)

  // Event handlers
  const handleDragStart = () => {
    setIsDragging(true)
    checkInfinitePosition()
  }
  const handleBlur = () => setIsDragging(false)
  const handleTransitionEnd = () => {
    checkInfinitePosition()
    setIsSliding(false)
  }

  // Effects
  useEffect(() => {
    const handleDragEnd = () => {
      const slideSizePx = trayRef.current
        ? (options.orientation === 'vertical'
            ? trayRef.current.offsetHeight
            : trayRef.current.offsetWidth) / totalSlidesWithInfinite
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
    disableAnimation,
    setDisableAnimation,

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
    handleDragStart,
    handleBlur,
    handleTransitionEnd
  }
}

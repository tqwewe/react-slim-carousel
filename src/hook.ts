import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'lodash/fp/debounce'
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
  const [containerWidth, setContainerWidth] = useState<number | undefined>()
  const [containerHeight, setContainerHeight] = useState<number | undefined>()

  // Calculated state
  const totalSlidesWithInfinite = options.infinite
    ? totalSlides + options.visibleSlides * 2 + 2
    : totalSlides
  const traySize = (totalSlidesWithInfinite / options.visibleSlides) * 100
  const translation =
    (100 / totalSlidesWithInfinite) *
    (currentSlide + (options.infinite ? options.visibleSlides + 1 : 0)) *
    -1
  const axis = options.orientation === 'vertical' ? 'Y' : 'X'

  const trayStyles = {
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
        ? (100 / totalSlidesWithInfinite / 2) * (options.visibleSlides - 1)
        : 0
    }% + ${
      options.orientation === 'vertical' && options.centerMode
        ? (options.gap / totalSlidesWithInfinite) * 2
        : 0
    }px))`,
    transitionProperty:
      isDragging || totalSlides === 0 || disableAnimation ? 'none' : undefined,
    transitionDuration: `${options.slideSpeed}ms`,
    transitionTimingFunction: options.easing
  }

  const slideStyles = {
    margin: `${
      options.orientation === 'vertical' ? `${options.gap / 2}px` : '0'
    } ${options.orientation === 'horizontal' ? `${options.gap / 2}px` : '0'}`,
    width:
      options.orientation === 'horizontal'
        ? `calc(${100 / options.visibleSlides}% + ${options.gap * 2}px)`
        : undefined,
    height:
      options.orientation === 'vertical'
        ? `calc(${100 / totalSlidesWithInfinite}% - ${
            (options.gap * totalSlidesWithInfinite) / totalSlidesWithInfinite
          }px)`
        : undefined
  }

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
        return
      }

      setIsSliding(true)
      setCurrentSlide(Math.min(maxSlide, Math.max(minSlide, slide)))
      checkInfinitePosition()
    },
    [isSliding, minSlide, maxSlide, checkInfinitePosition]
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

  // Event handlers
  const handleDragStart = () => {
    if (!options.draggable) {
      return
    }

    setIsDragging(true)
    checkInfinitePosition()
  }
  const handleBlur = () => setIsDragging(false)
  const handleTransitionEnd = () => {
    checkInfinitePosition()
    setIsSliding(false)
  }

  // Effects
  // Autoplay
  useEffect(() => {
    if (isDragging || !options.autoPlay) {
      return
    }

    const interval =
      options.playDirection === 'reverse'
        ? setInterval(previous, options.interval)
        : setInterval(next, options.interval)
    return () => clearInterval(interval)
  }, [
    options.autoPlay,
    options.playDirection,
    options.interval,
    isDragging,
    next,
    previous
  ])

  useEffect(() => {
    function adjustHeight() {
      setTimeout(() => {
        let scrollWidth: number | undefined
        let scrollHeight: number | undefined
        if (
          options.autoSize &&
          trayRef &&
          trayRef.current &&
          trayRef.current.parentElement
        ) {
          if (options.orientation === 'horizontal') {
            const oldHeight = trayRef.current.parentElement.style.height
            trayRef.current.parentElement.style.height = ''
            scrollHeight = trayRef.current.parentElement.scrollHeight
            trayRef.current.parentElement.style.height = oldHeight
          } else if (options.orientation === 'vertical') {
            const oldWidth = trayRef.current.parentElement.style.width
            trayRef.current.parentElement.style.width = ''
            scrollWidth = trayRef.current.parentElement.scrollWidth
            trayRef.current.parentElement.style.width = oldWidth
          }
        }
        if (options.autoSize && trayRef && trayRef.current) {
          if (options.orientation === 'horizontal') {
            setContainerWidth(undefined)
            setContainerHeight(scrollHeight)
          } else {
            setContainerWidth(scrollWidth)
            setContainerHeight(undefined)
          }
        }
      })
    }

    adjustHeight()
    const debounced = debounce(100, adjustHeight)

    window.addEventListener('resize', debounced)
    return () => window.removeEventListener('resize', debounced)
  }, [options.autoSize, trayRef])

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.userSelect = ''
    }
  }, [isDragging])

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
    containerWidth,
    containerHeight,

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

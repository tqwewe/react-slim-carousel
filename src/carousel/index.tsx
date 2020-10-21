import React, { HTMLAttributes, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import hash from 'object-hash'
import matches from 'lodash/fp/matches'
import debounce from 'lodash/fp/debounce'
import { useMediaQueries } from '@react-hook/media-query'
import { getOptions, CarouselOptions } from '../options'
import useCarousel from '../use-carousel'

type CarouselProps = {
  autoPlay?: CarouselOptions['autoPlay']
  autoSize?: CarouselOptions['autoSize']
  centerMode?: CarouselOptions['centerMode']
  draggable?: CarouselOptions['draggable']
  easing?: CarouselOptions['easing']
  gap?: CarouselOptions['gap']
  infinite?: CarouselOptions['infinite']
  initialSlide?: CarouselOptions['initialSlide']
  interval?: CarouselOptions['interval']
  orientation?: CarouselOptions['orientation']
  playDirection?: CarouselOptions['playDirection']
  slidesToScroll?: CarouselOptions['slidesToScroll']
  slideSpeed?: CarouselOptions['slideSpeed']
  threshold?: CarouselOptions['threshold']
  visibleSlides?: CarouselOptions['visibleSlides']
}

type Props = {
  responsive?: Record<string | number, CarouselProps>
  className?: string
  children: React.ReactNode
} & CarouselProps &
  HTMLAttributes<HTMLDivElement>

const Inner = React.memo(
  ({
    slides,
    currentSlide,
    infiniteBefore,
    infiniteAfter,
    slideStyles
  }: {
    slides: React.ReactElement[]
    currentSlide: number
    slideStyles: React.CSSProperties
    infiniteBefore: JSX.Element[] | null
    infiniteAfter: JSX.Element[] | null
  }) => (
    <React.Fragment>
      {infiniteBefore}
      {slides.map((child: any, index: any) => (
        <div
          key={(typeof child === 'object' && (child as any).key) || index}
          className={clsx(
            'carousel__slide',
            currentSlide === index && 'carousel__slide--active'
          )}
          style={slideStyles}
        >
          {child}
        </div>
      ))}
      {infiniteAfter}
    </React.Fragment>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.currentSlide === nextProps.currentSlide &&
      prevProps.slides.length === nextProps.slides.length &&
      matches(prevProps.slideStyles, nextProps.slideStyles)
    )
  }
)

export default function Carousel({
  autoPlay,
  autoSize,
  centerMode,
  draggable,
  easing,
  gap,
  infinite,
  initialSlide,
  interval,
  orientation,
  playDirection,
  slidesToScroll,
  slideSpeed,
  threshold,
  visibleSlides,
  responsive,
  className,
  children,
  style,
  ...props
}: Props) {
  const {
    options,
    currentSlide,
    totalSlides,
    disableAnimation,
    setOptions,
    setTotalSlides,
    setDisableAnimation,
    setIsSliding,
    next,
    previous,
    checkInfinitePosition
  } = useCarousel()
  const { matches } = useMediaQueries(
    Object.keys(responsive || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: `(min-width: ${key.indexOf('px') === -1 ? `${key}px` : key})`
      }),
      {}
    )
  )

  // State
  const trayRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
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

  useEffect(() => {
    const options = Object.entries(responsive || {})
      .filter(([screen]) => matches[screen])
      .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
      .reduce(
        (acc, [, opts]) => ({ ...acc, ...opts }),
        getOptions({
          autoPlay,
          autoSize,
          centerMode,
          draggable,
          easing,
          gap,
          infinite,
          initialSlide,
          interval,
          orientation,
          playDirection,
          slidesToScroll,
          slideSpeed,
          threshold,
          visibleSlides
        })
      )

    setDisableAnimation(true)
    setOptions(options)
    setTimeout(() => {
      setDisableAnimation(false)
    })
  }, [matches, responsive ? hash(responsive) : 0])

  useEffect(() => {
    setTotalSlides(React.Children.count(children))
    setTimeout(() => {
      setDisableAnimation(false)
    })
  }, [children])

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

  const slides = React.Children.toArray(children) as React.ReactElement[]

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
            {React.cloneElement(
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
          {React.cloneElement(slides[Math.abs(index) % slides.length])}
        </div>
      ))
    : null

  return (
    <div
      {...props}
      className={clsx(
        'carousel',
        `carousel--${options.orientation}`,
        options.centerMode && `carousel--center-mode`,
        className
      )}
      style={{
        width: containerWidth,
        height: containerHeight,
        ...(style || {})
      }}
    >
      <div
        ref={trayRef}
        className={clsx('carousel__tray')}
        style={trayStyles}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onBlur={handleBlur}
        onTransitionEnd={handleTransitionEnd}
      >
        <Inner
          infiniteBefore={infiniteBefore}
          slides={slides}
          currentSlide={currentSlide}
          slideStyles={slideStyles}
          infiniteAfter={infiniteAfter}
        />
      </div>
    </div>
  )
}

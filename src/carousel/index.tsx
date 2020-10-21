import React, { HTMLAttributes, useEffect } from 'react'
import clsx from 'clsx'
import hash from 'object-hash'
import matches from 'lodash/fp/matches'
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
    trayRef,
    trayStyles,
    slideStyles,
    containerWidth,
    containerHeight,
    setOptions,
    setTotalSlides,
    setDisableAnimation,
    handleDragStart,
    handleBlur,
    handleTransitionEnd
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

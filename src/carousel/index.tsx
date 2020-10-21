import React, { HTMLAttributes, useEffect } from 'react'
import clsx from 'clsx'
import hash from 'object-hash'
import { useMediaQueries } from '@react-hook/media-query'
import { getOptions, CarouselOptions } from '../options'
import useCarousel from '../use-carousel'

type CarouselProps = {
  autoPlay?: CarouselOptions['autoPlay']
  centerMode?: CarouselOptions['centerMode']
  draggable?: CarouselOptions['draggable']
  easing?: CarouselOptions['easing']
  gap?: CarouselOptions['gap']
  initialSlide?: CarouselOptions['initialSlide']
  infinite?: CarouselOptions['infinite']
  orientation?: CarouselOptions['orientation']
  playDirection?: CarouselOptions['playDirection']
  slidesToScroll?: CarouselOptions['slidesToScroll']
  slideSpeed?: CarouselOptions['slideSpeed']
  threshold?: CarouselOptions['threshold']
  visibeSlides?: CarouselOptions['visibeSlides']
}

type Props = {
  responsive?: Record<number, CarouselProps>
  className?: string
  children: React.ReactNode
} & CarouselProps &
  HTMLAttributes<HTMLDivElement>

export default function Carousel({
  autoPlay,
  centerMode,
  draggable,
  easing,
  gap,
  infinite,
  initialSlide,
  orientation,
  playDirection,
  slidesToScroll,
  slideSpeed,
  threshold,
  visibeSlides,
  responsive,
  className,
  children,
  ...props
}: Props) {
  const {
    options,
    setOptions,
    currentSlide,
    trayRef,
    setTotalSlides,
    trayStyles,
    slideStyles,
    setDisableAnimation,
    handleDragStart,
    handleBlur,
    handleTransitionEnd
  } = useCarousel()
  const { matches } = useMediaQueries(
    Object.keys(responsive || {}).reduce(
      (acc, key) => ({ ...acc, [key]: `(min-width: ${key}px)` }),
      {}
    )
  )

  useEffect(() => {
    const options = Object.entries(responsive || {})
      .filter(([screen]) => matches[screen])
      .sort(([a], [b]) => {
        if (a < b) {
          return -1
        }
        if (a > b) {
          return 1
        }
        return 0
      })
      .reduce(
        (acc, [, opts]) => ({ ...acc, ...opts }),
        getOptions({
          autoPlay,
          centerMode,
          draggable,
          easing,
          gap,
          infinite,
          initialSlide,
          orientation,
          playDirection,
          slidesToScroll,
          slideSpeed,
          threshold,
          visibeSlides
        })
      )

    setDisableAnimation(true)
    setOptions(options)
    setTimeout(() => {
      setDisableAnimation(false)
    })
  }, [matches, hash(responsive)])

  useEffect(() => {
    setTotalSlides(React.Children.count(children))
    setTimeout(() => {
      setDisableAnimation(false)
    })
  }, [children])

  const slides = React.Children.toArray(children) as React.ReactElement[]

  const infiniteBefore = options.infinite
    ? new Array(options.visibeSlides + 1)
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
    ? new Array(options.visibeSlides + 1).fill(null).map((_, index) => (
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
        {infiniteBefore}
        {slides.map((child, index) => (
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
      </div>
    </div>
  )
}

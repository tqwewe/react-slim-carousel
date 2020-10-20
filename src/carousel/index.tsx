import React, { HTMLAttributes, useEffect } from 'react'
import clsx from 'clsx'
import { getOptions } from '../options'
import useCarousel from '../use-carousel'
import styles from './styles.module.css'

type Props = {
  centerMode?: boolean
  gap?: number
  initialSlide?: number
  infinite?: boolean
  orientation?: 'horizontal' | 'vertical'
  slidesToScroll?: number
  threshold?: number
  visibeSlides?: number
  className?: string
  children: React.ReactNode
} & HTMLAttributes<HTMLDivElement>

export default function Carousel({
  centerMode,
  gap,
  infinite,
  initialSlide,
  orientation,
  slidesToScroll,
  threshold,
  visibeSlides,
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

  useEffect(() => {
    setOptions(
      getOptions({
        centerMode,
        gap,
        infinite,
        initialSlide,
        orientation,
        slidesToScroll,
        threshold,
        visibeSlides
      })
    )
  }, [])

  useEffect(() => {
    setTotalSlides(React.Children.count(children))
    setTimeout(() => {
      setDisableAnimation(false)
    })
  }, [children])

  const slides = React.Children.toArray(children) as React.ReactElement[]

  const infiniteBefore = options.infinite
    ? new Array(options.visibeSlides)
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
            {React.cloneElement(slides[slides.length - 1 - index])}
          </div>
        ))
        .reverse()
    : null

  const infiniteAfter = options.infinite
    ? new Array(options.visibeSlides).fill(null).map((_, index) => (
        <div
          key={`infinite-after-${index}`}
          className={clsx(
            'carousel__slide',
            currentSlide === index && 'carousel__slide--active'
          )}
          style={slideStyles}
        >
          {React.cloneElement(slides[index])}
        </div>
      ))
    : null

  return (
    <div {...props} className={clsx('carousel', styles.container, className)}>
      <div
        ref={trayRef}
        className={clsx(
          'carousel__tray',
          styles.tray,
          styles[`tray--orientation-${options.orientation}`]
        )}
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

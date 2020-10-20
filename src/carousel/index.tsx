import React, { HTMLAttributes, useEffect } from 'react'
import clsx from 'clsx'
import { getOptions } from '../options'
import useCarousel from '../use-carousel'
import styles from './styles.module.css'

type Props = {
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
    trayRef,
    setTotalSlides,
    trayStyles,
    slideStyles,
    handleMouseDown,
    handleTouchStart,
    handleBlur
  } = useCarousel()

  useEffect(() => {
    setOptions(
      getOptions({
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
  }, [children])

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
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onBlur={handleBlur}
      >
        {React.Children.toArray(children).map((child, index) => (
          <div
            key={(typeof child === 'object' && (child as any).key) || index}
            className='carousel__slide'
            style={slideStyles}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

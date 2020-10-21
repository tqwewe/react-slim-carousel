import React, { Children, HTMLAttributes, useRef, useState } from 'react'
import clsx from 'clsx'
import { CarouselOptions } from '../../options'
import useCarousel from '../../hooks/useCarousel'
import useAutoplayEffect from '../../hooks/effects/useAutoplayEffect'
import useAutosizeEffect from '../../hooks/effects/useAutosizeEffect'
import useDragHandlersEffect from '../../hooks/effects/useDragHandlersEffect'
import useOptionsEffect from '../../hooks/effects/useOptionsEffect'
import useTotalSlidesEffect from '../../hooks/effects/useTotalSlidesEffect'
import useUserSelectEffect from '../../hooks/effects/useUserSelectEffect'
import useCalculatedState from '../../hooks/useCalculatedState'
import useEventHandlers from '../../hooks/useEventHandlers'
import useInfiniteSlides from '../../hooks/useInfiniteSlides'
import useResponsiveOptions from '../../hooks/useResponsiveOptions'

export type CarouselProps = {
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
  // State
  const trayRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [containerWidth, setContainerWidth] = useState<number | undefined>()
  const [containerHeight, setContainerHeight] = useState<number | undefined>()

  // Hooks
  const { options, currentSlide } = useCarousel()
  const { matches } = useResponsiveOptions({ responsive })
  const {
    handleBlur,
    handleDragStart,
    handleTransitionEnd
  } = useEventHandlers({ setIsDragging })
  const {
    slideStyles,
    totalSlidesWithInfinite,
    trayStyles
  } = useCalculatedState({ isDragging, offset })
  const { infiniteAfter, infiniteBefore, slides } = useInfiniteSlides({
    children,
    slideStyles
  })

  // Effects
  useOptionsEffect({
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
    slideSpeed,
    slidesToScroll,
    threshold,
    visibleSlides,
    matches,
    responsive
  })
  useTotalSlidesEffect({ childCount: Children.count(children) })
  useAutoplayEffect({ isDragging })
  useAutosizeEffect({ trayRef, setContainerWidth, setContainerHeight })
  useUserSelectEffect({ isDragging })
  useDragHandlersEffect({
    isDragging,
    offset,
    totalSlidesWithInfinite,
    trayRef,
    setIsDragging,
    setOffset
  })

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
      </div>
    </div>
  )
}

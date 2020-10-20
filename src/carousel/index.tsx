import React, { useEffect } from 'react'
import clsx from 'clsx'
import { CarouselOptions, getOptions } from '../options'
import useCarousel from '../use-carousel'
import styles from './styles.module.css'

type Props = {
  children: React.ReactNode
} & Partial<CarouselOptions>

export default function Carousel({ children, ...props }: Props) {
  const {
    options,
    setOptions,
    offset,
    setOffset,
    isDragging,
    setIsDragging,
    setTotalSlides,
    trayStyles
  } = useCarousel()

  const handleMouseDown = () => setIsDragging(true)
  const handleTouchStart = () => setIsDragging(true)
  const handleBlur = () => setIsDragging(false)
  const handleTouchMove = (_ev: React.TouchEvent<HTMLDivElement>) => {}

  useEffect(() => {
    setOptions(getOptions(props))
  }, [])

  useEffect(() => {
    setTotalSlides(React.Children.count(children))
  }, [children])

  useEffect(() => {
    const handleDragEnd = () => {
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
        setOffset(offset + ev.movementX)
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
  }, [isDragging, offset])

  return (
    <div className={styles.container}>
      <div
        className={clsx(
          styles.tray,
          styles[`tray--visible-slides-${options.visibeSlides}`]
        )}
        style={trayStyles}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onBlur={handleBlur}
      >
        {children}
      </div>
    </div>
  )
}

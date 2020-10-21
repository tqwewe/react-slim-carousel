import { Dispatch, RefObject, SetStateAction, useEffect } from 'react'
import useCarousel from '../useCarousel'

export default function useDragHandlersEffect({
  isDragging,
  offset,
  totalSlidesWithInfinite,
  trayRef,
  setIsDragging,
  setOffset
}: {
  isDragging: boolean
  offset: number
  totalSlidesWithInfinite: number
  trayRef: RefObject<HTMLDivElement>
  setIsDragging: Dispatch<SetStateAction<boolean>>
  setOffset: Dispatch<SetStateAction<number>>
}) {
  const { options, next, previous } = useCarousel()

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

    document.addEventListener('mouseup', handleDragEnd, true)
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
  }, [trayRef, isDragging, offset, options.orientation, options.threshold])
}

import { Dispatch, SetStateAction } from 'react'
import useCarousel from './useCarousel'

export default function useEventHandlers({
  setIsDragging
}: {
  setIsDragging: Dispatch<SetStateAction<boolean>>
}) {
  const { options, checkInfinitePosition, setIsSliding } = useCarousel()

  const handleBlur = () => setIsDragging(false)
  const handleDragStart = () => {
    if (!options.draggable) {
      return
    }

    setIsDragging(true)
    checkInfinitePosition()
  }
  const handleTransitionEnd = () => {
    checkInfinitePosition()
    setIsSliding(false)
  }

  return {
    handleBlur,
    handleDragStart,
    handleTransitionEnd
  }
}

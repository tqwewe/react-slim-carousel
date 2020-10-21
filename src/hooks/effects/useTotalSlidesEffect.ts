import { useEffect } from 'react'
import useCarousel from '../useCarousel'

export default function useTotalSlidesEffect({
  childCount
}: {
  childCount: number
}) {
  const { setDisableAnimation, setTotalSlides } = useCarousel()

  useEffect(() => {
    setTotalSlides(childCount)
    setTimeout(() => {
      setDisableAnimation(false)
    })
  }, [childCount])
}

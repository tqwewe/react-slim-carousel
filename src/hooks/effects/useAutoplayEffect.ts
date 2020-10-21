import { useEffect } from 'react'
import useCarousel from '../useCarousel'

export default function useAutoplayEffect({
  isDragging
}: {
  isDragging: boolean
}) {
  const { options, next, previous } = useCarousel()

  useEffect(() => {
    if (isDragging || !options.autoPlay) {
      return
    }

    const intervalHandler =
      options.playDirection === 'reverse'
        ? setInterval(previous, options.interval)
        : setInterval(next, options.interval)
    return () => clearInterval(intervalHandler)
  }, [
    options.autoPlay,
    options.interval,
    options.playDirection,
    isDragging,
    next,
    previous
  ])
}

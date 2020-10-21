import { useEffect } from 'react'
import { Matches } from '@react-hook/media-query'
import hash from 'object-hash'
import { CarouselProps } from '../../components/carousel/Carousel'
import { getOptions } from '../../options'
import useCarousel from '../useCarousel'

export default function useOptionsEffect({
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
}: {
  matches: Matches<unknown>
  responsive: Record<string | number, CarouselProps> | undefined
} & CarouselProps) {
  const { setDisableAnimation, setOptions } = useCarousel()

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
          slideSpeed,
          slidesToScroll,
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
}

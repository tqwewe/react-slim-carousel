import { useEffect } from 'react'
import { Matches } from '@react-hook/media-query'
import { CarouselProps } from '../../components/carousel/Carousel'
import { getOptions } from '../../options'
import useCarousel from '../useCarousel'

function responsiveToStr(
  responsive: Record<string | number, CarouselProps> | undefined
) {
  if (!responsive) {
    return ''
  }

  // Sort
  const sorted = Object.entries(responsive).sort(
    ([a], [b]) => parseInt(a, 10) - parseInt(b, 10)
  )

  return sorted.reduce((str, [screen, optGroup]) => {
    const sortedOptions = Object.entries(optGroup).sort(([a], [b]) => {
      if (a < b) {
        return -1
      }
      if (a > b) {
        return 1
      }
      return 0
    })
    const optStr = `${screen}::${sortedOptions.reduce(
      (str, [k, v]) => `${str}~${k}${v}`,
      ''
    )}`
    return `${str}|${optStr}`
  }, '')
}

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
    console.log('rerender')
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
  }, [matches, responsiveToStr(responsive)])
}

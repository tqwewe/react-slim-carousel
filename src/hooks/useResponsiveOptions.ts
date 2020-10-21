import { useMediaQueries } from '@react-hook/media-query'
import { CarouselProps } from '../components/carousel/Carousel'

export default function useResponsiveOptions({
  responsive
}: {
  responsive: Record<string | number, CarouselProps> | undefined
}) {
  const { matches } = useMediaQueries(
    Object.keys(responsive || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: `(min-width: ${key.indexOf('px') === -1 ? `${key}px` : key})`
      }),
      {}
    )
  )

  return { matches }
}

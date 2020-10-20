import defaults from 'lodash/fp/defaults'

export interface CarouselOptions {
  centerMode: boolean
  gap: number
  infinite: boolean
  initialSlide: number
  orientation: 'horizontal' | 'vertical'
  slidesToScroll: number
  threshold: number
  visibeSlides: number
}

export const getOptions = (
  opts: Partial<CarouselOptions> = {}
): CarouselOptions =>
  defaults(
    {
      centerMode: false,
      gap: 0,
      infinite: false,
      initialSlide: 0,
      orientation: 'horizontal',
      slidesToScroll: 1,
      threshold: 0.2,
      visibeSlides: 1
    },
    opts
  )

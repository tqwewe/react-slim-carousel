import defaults from 'lodash/fp/defaults'

export interface CarouselOptions {
  initialSlide: number
  infinite: boolean
  orientation: 'horizontal' | 'vertical'
  slidesToScroll: number
  visibeSlides: number
}

export const getOptions = (
  opts: Partial<CarouselOptions> = {}
): CarouselOptions =>
  defaults(
    {
      initialSlide: 0,
      infinite: false,
      orientation: 'horizontal',
      slidesToScroll: 1,
      visibeSlides: 1
    },
    opts
  )

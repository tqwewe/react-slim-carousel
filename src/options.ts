import defaults from 'lodash/fp/defaults'

export interface CarouselOptions {
  // Autoplay through slides
  autoPlay: boolean
  // Show active slide in the center
  centerMode: boolean
  // Enable/disable drag to slide
  draggable: boolean
  // CSS easing
  easing: string
  // Gap in pixels between each slide
  gap: number
  // Intinite loop sliding
  infinite: boolean
  // Initial slide to display
  initialSlide: number
  // Time in ms between autoplay sliding
  interval: number
  // Slider orientation
  orientation: 'horizontal' | 'vertical'
  // Autoplay direction
  playDirection: 'normal' | 'reverse'
  // Number of slides to scroll
  slidesToScroll: number
  // Transition speed in ms
  slideSpeed: number
  // Drag threshold for scrolling to next slide
  threshold: number
  // Number of slides visible
  visibeSlides: number
}

export const getOptions = (
  opts: Partial<CarouselOptions> = {}
): CarouselOptions =>
  defaults(
    {
      autoPlay: false,
      centerMode: false,
      draggable: true,
      easing: 'ease-in-out',
      gap: 0,
      infinite: false,
      initialSlide: 0,
      interval: 3000,
      orientation: 'horizontal',
      playDirection: 'normal',
      slidesToScroll: 1,
      slideSpeed: 400,
      threshold: 0.2,
      visibeSlides: 1
    },
    opts
  )

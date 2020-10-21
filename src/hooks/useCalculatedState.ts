import useCarousel from './useCarousel'

export default function useCalculatedState({
  isDragging,
  offset
}: {
  isDragging: boolean
  offset: number
}) {
  const { options, totalSlides, currentSlide, disableAnimation } = useCarousel()

  const totalSlidesWithInfinite = options.infinite
    ? totalSlides + options.visibleSlides * 2 + 2
    : totalSlides
  const traySize = (totalSlidesWithInfinite / options.visibleSlides) * 100
  const translation =
    (100 / totalSlidesWithInfinite) *
    (currentSlide + (options.infinite ? options.visibleSlides + 1 : 0)) *
    -1
  const axis = options.orientation === 'vertical' ? 'Y' : 'X'

  const trayStyles = {
    width:
      options.orientation === 'horizontal'
        ? `calc(${traySize}% + ${
            (options.gap * totalSlidesWithInfinite) / 2
          }px)`
        : undefined,
    height:
      options.orientation === 'vertical'
        ? `calc(${traySize}% + ${options.gap * totalSlides}px)`
        : undefined,
    transform: `translate${axis}(calc(${translation}% + ${
      offset - options.gap / 2
    }px + ${
      options.centerMode
        ? (100 / totalSlidesWithInfinite / 2) * (options.visibleSlides - 1)
        : 0
    }% + ${
      options.orientation === 'vertical' && options.centerMode
        ? (options.gap / totalSlidesWithInfinite) * 2
        : 0
    }px))`,
    transitionProperty:
      isDragging || totalSlides === 0 || disableAnimation ? 'none' : undefined,
    transitionDuration: `${options.slideSpeed}ms`,
    transitionTimingFunction: options.easing
  }

  const slideStyles = {
    margin: `${
      options.orientation === 'vertical' ? `${options.gap / 2}px` : '0'
    } ${options.orientation === 'horizontal' ? `${options.gap / 2}px` : '0'}`,
    width:
      options.orientation === 'horizontal'
        ? `calc(${100 / options.visibleSlides}% + ${options.gap * 2}px)`
        : undefined,
    height:
      options.orientation === 'vertical'
        ? `calc(${100 / totalSlidesWithInfinite}% - ${
            (options.gap * totalSlidesWithInfinite) / totalSlidesWithInfinite
          }px)`
        : undefined
  }

  return {
    slideStyles,
    totalSlidesWithInfinite,
    trayStyles
  }
}

import React, { HTMLAttributes } from 'react'
import clsx from 'clsx'
import useCarousel from '../../hooks/useCarousel'

type Props = {
  dot: (props: { active: boolean; index: number }) => JSX.Element
  onChange?: (slide: number) => void
} & HTMLAttributes<HTMLDivElement>

export default function PreviousButton({
  dot: Dot,
  className,
  onChange,
  ...props
}: Props) {
  const { options, currentSlide, totalSlides, goTo } = useCarousel()

  const handleClick = (index: number) => {
    const slide = goTo(index)
    if (onChange) {
      onChange(slide)
    }
  }

  const dots = new Array(totalSlides / options.visibleSlides)
    .fill(null)
    .map((_value, index) => (
      <button
        className={clsx(
          'carousel-dot',
          currentSlide === index * options.visibleSlides &&
            'carousel-dot--active'
        )}
        key={index}
        onClick={() => handleClick(index * options.visibleSlides)}
      >
        <Dot
          active={currentSlide === index * options.visibleSlides}
          index={index * options.visibleSlides}
        />
      </button>
    ))

  return (
    <div {...props} className={clsx('carousel-dots', className)}>
      {dots}
    </div>
  )
}

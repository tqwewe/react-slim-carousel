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

  const dots = new Array(Math.ceil(totalSlides / options.slidesToScroll))
    .fill(null)
    .map((_value, index) => {
      let currentSlideNum = currentSlide
      if (currentSlideNum < 0) {
        currentSlideNum = totalSlides + currentSlideNum
      } else if (currentSlideNum >= totalSlides) {
        currentSlideNum = Math.abs(totalSlides - currentSlideNum)
      }

      const isActive =
        index === Math.ceil(currentSlideNum / options.slidesToScroll)

      return (
        <button
          className={clsx('carousel-dot', isActive && 'carousel-dot--active')}
          key={index}
          onClick={() => handleClick(index * options.slidesToScroll)}
        >
          <Dot active={isActive} index={index * options.slidesToScroll} />
        </button>
      )
    })

  return (
    <div {...props} className={clsx('carousel-dots', className)}>
      {dots}
    </div>
  )
}

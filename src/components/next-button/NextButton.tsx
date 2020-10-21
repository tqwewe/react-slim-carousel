import React, { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import useCarousel from '../../hooks/useCarousel'

type Props = {
  onClick?: (slide: number) => void
  children?: ReactNode
} & HTMLAttributes<HTMLButtonElement>

export default function NextButton({
  className,
  onClick,
  children,
  ...props
}: Props) {
  const { next, nextDisabled } = useCarousel()

  const handleClick = () => {
    const slide = next()
    if (onClick) {
      onClick(slide)
    }
  }

  return (
    <button
      {...props}
      className={clsx('carousel-next-btn', className)}
      disabled={nextDisabled}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

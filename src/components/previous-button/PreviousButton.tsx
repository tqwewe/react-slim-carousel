import React, { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import useCarousel from '../../hooks/useCarousel'

type Props = {
  onClick?: (slide: number) => void
  children?: ReactNode
} & HTMLAttributes<HTMLButtonElement>

export default function PreviousButton({
  className,
  onClick,
  children,
  ...props
}: Props) {
  const { previous, previousDisabled } = useCarousel()

  const handleClick = () => {
    const slide = previous()
    if (onClick) {
      onClick(slide)
    }
  }

  return (
    <button
      {...props}
      className={clsx('carousel-previous-btn', className)}
      disabled={previousDisabled}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

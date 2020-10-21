import React, { createContext } from 'react'
import useCarouselContext from './hook'
import { CarouselOptions, getOptions } from './options'

export interface CarouselContext {
  // Options
  options: CarouselOptions
  setOptions: React.Dispatch<React.SetStateAction<CarouselOptions>>

  // State
  currentSlide: number
  totalSlides: number
  disableAnimation: boolean
  isSliding: boolean
  setTotalSlides: React.Dispatch<React.SetStateAction<number>>
  setDisableAnimation: React.Dispatch<React.SetStateAction<boolean>>
  setIsSliding: React.Dispatch<React.SetStateAction<boolean>>

  // Calculated state
  nextDisabled: boolean
  previousDisabled: boolean

  // Methods
  goTo: (slide: number) => void
  next: () => void
  previous: () => void
  first: () => void
  last: () => void
  checkInfinitePosition: () => void
}

export const context = createContext<CarouselContext>({} as CarouselContext)

export const CarouselProvider = context.Provider

export function withCarousel(options: Partial<CarouselOptions> = {}) {
  const optsWithDefaults = getOptions(options)

  return <P extends object>(Component: React.ComponentType<P>) => ({
    children,
    ...props
  }: any) => {
    const value = useCarouselContext(optsWithDefaults)

    return (
      <CarouselProvider value={value}>
        <Component {...props}>{children}</Component>
      </CarouselProvider>
    )
  }
}

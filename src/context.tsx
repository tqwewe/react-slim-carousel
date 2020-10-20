import React, { createContext } from 'react'
import useCarouselContext from './hook'
import { CarouselOptions, getOptions } from './options'

export interface CarouselContext {
  // Options
  options: CarouselOptions
  setOptions: React.Dispatch<React.SetStateAction<CarouselOptions>>

  // State
  currentSlide: number

  offset: number
  setOffset: React.Dispatch<React.SetStateAction<number>>

  isDragging: boolean
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>

  totalSlides: number
  setTotalSlides: React.Dispatch<React.SetStateAction<number>>

  // Calculated state
  traySize: number
  translation: number
  trayStyles: React.CSSProperties
  nextDisabled: boolean
  previousDisabled: boolean

  // Methods
  goTo: (slide: number) => void
  next: () => void
  previous: () => void
  first: () => void
  last: () => void
}

export const context = createContext<CarouselContext>({} as CarouselContext)

export const ContextProvider = context.Provider

export function withCarousel(options: Partial<CarouselOptions> = {}) {
  const optsWithDefaults = getOptions(options)

  return <P extends object>(Component: React.ComponentType<P>) => ({
    children,
    ...props
  }: any) => {
    const value = useCarouselContext(optsWithDefaults)

    return (
      <ContextProvider value={value}>
        <Component {...props}>{children}</Component>
      </ContextProvider>
    )
  }
}

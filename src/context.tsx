import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction
} from 'react'
import useCarouselContext from './hooks/useCarouselContext'
import { CarouselOptions, getOptions } from './options'

export interface CarouselContext {
  // Options
  options: CarouselOptions
  setOptions: Dispatch<SetStateAction<CarouselOptions>>

  // State
  currentSlide: number
  totalSlides: number
  disableAnimation: boolean
  isSliding: boolean
  setTotalSlides: Dispatch<SetStateAction<number>>
  setDisableAnimation: Dispatch<SetStateAction<boolean>>
  setIsSliding: Dispatch<SetStateAction<boolean>>

  // Calculated state
  nextDisabled: boolean
  previousDisabled: boolean

  // Methods
  goTo: (slide: number) => number
  next: () => number
  previous: () => number
  first: () => number
  last: () => number
  checkInfinitePosition: () => void
}

export const context = createContext<CarouselContext>({} as CarouselContext)

export function CarouselProvider({
  options,
  children
}: {
  options?: Partial<CarouselOptions>
  children: ReactNode
}) {
  const optsWithDefaults = getOptions(options || {})
  const value = useCarouselContext(optsWithDefaults)

  return <context.Provider value={value}>{children}</context.Provider>
}

export function withCarousel(options: Partial<CarouselOptions> = {}) {
  return <P extends object>(Component: React.ComponentType<P>) => ({
    children,
    ...props
  }: any) => {
    return (
      <CarouselProvider options={options}>
        <Component {...props}>{children}</Component>
      </CarouselProvider>
    )
  }
}

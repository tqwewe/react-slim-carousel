import { useContext } from 'react'
import { CarouselContext, context } from './context'

export default function useCarousel(): CarouselContext {
  return useContext(context)
}

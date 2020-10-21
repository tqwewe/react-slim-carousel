import { Dispatch, RefObject, SetStateAction, useEffect } from 'react'
import debounce from 'lodash.debounce'
import useCarousel from '../useCarousel'

export default function useAutosizeEffect({
  trayRef,
  setContainerWidth,
  setContainerHeight
}: {
  trayRef: RefObject<HTMLDivElement>
  setContainerWidth: Dispatch<SetStateAction<number | undefined>>
  setContainerHeight: Dispatch<SetStateAction<number | undefined>>
}) {
  const { options } = useCarousel()

  useEffect(() => {
    function adjustHeight() {
      setTimeout(() => {
        let scrollWidth: number | undefined
        let scrollHeight: number | undefined
        if (
          options.autoSize &&
          trayRef &&
          trayRef.current &&
          trayRef.current.parentElement
        ) {
          if (options.orientation === 'horizontal') {
            const oldHeight = trayRef.current.parentElement.style.height
            trayRef.current.parentElement.style.height = ''
            scrollHeight = trayRef.current.parentElement.scrollHeight
            trayRef.current.parentElement.style.height = oldHeight
          } else if (options.orientation === 'vertical') {
            const oldWidth = trayRef.current.parentElement.style.width
            trayRef.current.parentElement.style.width = ''
            scrollWidth = trayRef.current.parentElement.scrollWidth
            trayRef.current.parentElement.style.width = oldWidth
          }
        }
        if (options.autoSize && trayRef && trayRef.current) {
          if (options.orientation === 'horizontal') {
            setContainerWidth(undefined)
            setContainerHeight(scrollHeight)
          } else {
            setContainerWidth(scrollWidth)
            setContainerHeight(undefined)
          }
        }
      })
    }

    adjustHeight()
    const debounced = debounce(adjustHeight, 100)

    window.addEventListener('resize', debounced)
    return () => window.removeEventListener('resize', debounced)
  }, [trayRef, options.autoSize, options.orientation])
}

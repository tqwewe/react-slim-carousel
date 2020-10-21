import { useEffect } from 'react'

export default function useUserselectEffect({
  isDragging
}: {
  isDragging: boolean
}) {
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.userSelect = ''
    }
  }, [isDragging])
}

import { useCallback, useEffect } from 'react'
import { usePhotoboothStore } from '../store/photoboothStore'

export function useTheme() {
  const theme = usePhotoboothStore((s) => s.settings.theme)
  const updateSettings = usePhotoboothStore((s) => s.updateSettings)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    updateSettings({ theme: theme === 'light' ? 'dark' : 'light' })
  }, [theme, updateSettings])

  return { theme, toggleTheme }
}

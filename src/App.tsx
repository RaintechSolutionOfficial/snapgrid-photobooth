import { Toaster } from 'sonner'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import { Studio } from './pages/Studio'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme } = useTheme()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster theme={theme} position="bottom-center" richColors closeButton />
    </BrowserRouter>
  )
}

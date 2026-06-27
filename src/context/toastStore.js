import { createContext, useContext } from 'react'

export const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  // No-op fallback if used outside the provider.
  return ctx || { toast: () => {} }
}

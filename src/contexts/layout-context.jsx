import { createContext, useCallback, useState } from "react"

export const LayoutContext = createContext()

export function LayoutProvider({ children }) {
  const [selectedKeyMenu, setSelectedKeymenu] = useState()
  const [breadcrumb, setBreadcrumb] = useState()

  const updateSelectedKeyMenu = useCallback((newKeySelected) => {
    setSelectedKeymenu(newKeySelected)
  }, [])

  const updateBreadcrumb = useCallback((newBreadcrumb) => {
    setBreadcrumb(newBreadcrumb)
  }, [])

  return (
    <LayoutContext.Provider
      value={{ selectedKeyMenu, updateSelectedKeyMenu, breadcrumb, updateBreadcrumb }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

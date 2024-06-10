import { useContext, useEffect } from "react"
import { LayoutContext } from "../../contexts/layout-context"

export function useLayout(keyMenu) {
  const { updateSelectedKeyMenu, updateBreadcrumb } = useContext(LayoutContext)

  useEffect(() => {
    updateBreadcrumb({
      title: keyMenu,
    })
    updateSelectedKeyMenu(keyMenu)
  }, [updateBreadcrumb, updateSelectedKeyMenu, keyMenu])
}

import { createContext, useCallback, useState } from "react"

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState()

  const updateLoggedUser = useCallback((newUser) => {
    setUser(newUser)
  }, [])

  return <UserContext.Provider value={{ user, updateLoggedUser }}>{children}</UserContext.Provider>
}

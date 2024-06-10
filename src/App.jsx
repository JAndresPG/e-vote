import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { UserProvider } from "./contexts/user-context"
import { LayoutProvider } from "./contexts/layout-context"
import { AppLayout } from "./components/layout"
import { Eventos } from "./pages/eventos"
import { Login } from "./pages/login"
import { ErrorElement } from "./pages/error"
import { Candidatos } from "./pages/candidatos"
import { Voto } from "./pages/voto"
import { Register } from "./pages/register"
import { Resultados } from "./pages/resultados"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorElement />,
      children: [
        {
          path: "/procesos-electorales",
          element: <Eventos />,
        },
        {
          path: "/candidatos",
          element: <Candidatos />,
        },
        {
          path: "/mi-voto",
          element: <Voto />,
        },
        {
          path: "/resultados",
          element: <Resultados />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ])

  return (
    <UserProvider>
      <LayoutProvider>
        <RouterProvider router={router} />
      </LayoutProvider>
    </UserProvider>
  )
}

export default App

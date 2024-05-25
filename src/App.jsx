import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { AppLayout } from "./components/layout"
import { Eventos } from "./pages/eventos"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/eventos",
          element: <Eventos />,
        },
      ],
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

import { Button, Result } from "antd"
import { useNavigate, useRouteError } from "react-router-dom"

export function ErrorElement() {
  const navigate = useNavigate()

  let error = useRouteError()

  return (
    <div style={{ height: "100vh", display: "grid", placeContent: "center" }}>
      <Result
        status={error.status === 404 ? "404" : "error"}
        title={error.status === 404 ? "404" : "Error"}
        subTitle={error.status === 404 ? "No se encontró la página" : "Ocurrió un error inesperado"}
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Regresar a inicio
          </Button>
        }
      />
    </div>
  )
}

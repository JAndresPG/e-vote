import { Button, Col, Form, Image, Input, Row, notification } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { useScreenSize } from "../hooks/others/useScreenSize"
import { url } from "../extra/constants"
import { optionsPostPublic } from "../extra/methods"

export function Login() {
  const navigate = useNavigate()

  const [api, contextHolder] = notification.useNotification()

  const { width } = useScreenSize()

  const handleFinishForm = async (values) => {
    try {
      const result = await fetch(`${url}login`, optionsPostPublic(values))

      if (!result.ok) {
        if (result.status === 400) {
          api["error"]({
            message: "Error",
            description: "Usuario o contraseña incorrectos",
          })
        }
        throw new Error()
      }

      const { token } = await result.json()

      localStorage.setItem("token", token)

      navigate("/")
    } catch (e) {
      api["error"]({
        message: "Error",
        description: "No se pudo iniciar sesión",
      })
    }
  }

  return (
    <>
      {contextHolder}
      <Row>
        {width > 768 && (
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
            style={{ backgroundColor: "#7b99b1", borderRight: "3px solid rgb(108 104 99)" }}
          >
            <div style={{ height: "100vh", display: "grid", placeContent: "center" }}>
              <Image src="logo.webp" preview={false} />
            </div>
          </Col>
        )}

        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          style={{
            backgroundColor: width > 768 ? "rgb(142 112 101)" : "#7b99b1",
            borderLeft: "3px solid rgb(108 104 99)",
          }}
        >
          {width <= 768 && (
            <div
              style={{
                height: "100vh",
                display: "grid",
                placeContent: "center",
                position: "absolute",
              }}
            >
              <Image src="logo.webp" preview={false} />
            </div>
          )}
          <div style={{ height: "100vh", display: "grid", placeContent: "center" }}>
            <Form
              onFinish={handleFinishForm}
              style={{ backgroundColor: "#fff", padding: "3rem", textAlign: "center", zIndex: 100 }}
            >
              <h1>Inicio de sesión</h1>
              <Form.Item name="cedula">
                <Input placeholder="Cédula:" maxLength={10} />
              </Form.Item>
              <Form.Item name="password">
                <Input.Password placeholder="Contraseña:" />
              </Form.Item>
              <Form.Item>
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Button type="primary" htmlType="submit">
                    Iniciar sesión
                  </Button>
                  <Link to="/register">Registrarse</Link>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  )
}

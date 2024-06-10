import { Button, Col, Form, Image, Input, Row, notification } from "antd"
import { useNavigate } from "react-router-dom"
import { useScreenSize } from "../hooks/others/useScreenSize"
import { url } from "../extra/constants"
import { optionsPostPublic } from "../extra/methods"

export function Register() {
  const navigate = useNavigate()

  const [api, contextHolder] = notification.useNotification()

  const { width } = useScreenSize()

  const handleFinishForm = async (values) => {
    try {
      const result = await fetch(`${url}register`, optionsPostPublic(values))
      if (!result.ok) {
        if (result.status === 400) {
          const res = await result.json()
          if (res) {
            api["error"]({
              message: "Error",
              description: res,
            })
            return
          }
        }
        throw new Error()
      }

      api["success"]({
        message: "¡Registrado!",
        description: "Usuario registrado en el sistema",
        duration: 3,
      })

      navigate("/login")
    } catch (e) {
      api["error"]({
        message: "Error",
        description: "No se pudo registrar el usuario",
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
              style={{
                backgroundColor: "#fff",
                padding: "3rem",
                textAlign: "center",
                zIndex: 100,
              }}
            >
              <h1>Registro de usuarios</h1>
              <Form.Item name="cedula" required>
                <Input placeholder="Cédula:" maxLength={10} />
              </Form.Item>
              <Form.Item name="nombres" required>
                <Input placeholder="Nombres:" />
              </Form.Item>
              <Form.Item name="apellidos" required>
                <Input placeholder="Apellidos:" />
              </Form.Item>
              <Form.Item name="correo" required>
                <Input placeholder="Correo:" />
              </Form.Item>
              <Form.Item name="password" required>
                <Input.Password placeholder="Contraseña:" />
              </Form.Item>
              <Form.Item
                name="repassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Confirme su contraseña" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error("Las contraseñas no coinciden"))
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirme contraseña:" />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Registrarse
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  )
}

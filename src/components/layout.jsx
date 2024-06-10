import {
  Layout,
  Menu,
  Breadcrumb,
  theme,
  Image,
  Dropdown,
  Space,
  Button,
  Drawer,
  Result,
} from "antd"

import { UserContext } from "../contexts/user-context"
import { LayoutContext } from "../contexts/layout-context"

import { HomeOutlined, LoadingOutlined, DownOutlined, MenuOutlined } from "@ant-design/icons"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { url } from "../extra/constants"

import { Candidatos, ProcesosElectorales, Resultados, Voto } from "./icons/svg"
import { useScreenSize } from "../hooks/others/useScreenSize"

const { Header, Sider, Content } = Layout

export function AppLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const [showDrawer, setShowDrawer] = useState(false)

  const { width } = useScreenSize()

  const navigate = useNavigate()

  let location = useLocation()

  const { updateLoggedUser, user } = useContext(UserContext)

  const { breadcrumb, selectedKeyMenu } = useContext(LayoutContext)

  const [logged, setLogged] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      setLogged(false)
      navigate("/login")
      return
    }

    ;(async () => {
      try {
        const result = await fetch(`${url}get-user-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!result.ok) {
          setLogged(false)
          navigate("/login")
          return
        }

        const res = await result.json()

        updateLoggedUser(res)
        setLogged(true)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [navigate, updateLoggedUser])

  const itemsMenu = [
    {
      key: "Procesos electorales",
      label: <Link to="/procesos-electorales">Procesos electorales</Link>,
      icon: <ProcesosElectorales width="16px" />,
    },
    {
      key: "Candidatos",
      label: <Link to="/candidatos">Candidatos</Link>,
      icon: <Candidatos width="16px" />,
    },
    {
      key: "Voto",
      label: <Link to="/mi-voto">Voto</Link>,
      icon: <Voto width="16px" />,
    },
    {
      key: "Resultados",
      label: <Link to="/resultados">Resultados</Link>,
      icon: <Resultados width="16px" />,
    },
  ]

  const handleClickCloseSesion = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  useEffect(() => {
    if (!user?.cod_perfil) return
    if (user.cod_perfil === 1) return

    if (location.pathname === "/") {
      navigate("/mi-voto")
      return
    }
  }, [navigate, user, location])

  return logged ? (
    <Layout>
      <Header
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgb(128, 161, 182)",
          justifyContent: "space-between",
        }}
      >
        <Image src="Logo.png" preview={false} style={{ height: "60px" }} />
        {width > 768 ? (
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: (
                    <Button type="text" onClick={handleClickCloseSesion}>
                      Cerrar sesión
                    </Button>
                  ),
                },
              ],
            }}
          >
            <Space style={{ cursor: "pointer" }}>
              {user?.nombres.split(" ")[0] + " " + user?.apellidos.split(" ")[0]}
              <DownOutlined />
            </Space>
          </Dropdown>
        ) : (
          <Button icon={<MenuOutlined />} onClick={() => setShowDrawer(true)} />
        )}
        <Drawer
          title="EasyVote"
          placement="left"
          onClose={() => setShowDrawer(false)}
          open={showDrawer}
          footer={
            <Button type="text" block onClick={handleClickCloseSesion}>
              Cerrar sesión
            </Button>
          }
        >
          {user.cod_perfil === 1 && <Menu items={itemsMenu} />}
        </Drawer>
      </Header>
      <Content
        style={{
          padding: `0 ${width > 768 ? "48" : "10"}px`,
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
          items={[
            {
              title: <HomeOutlined />,
              href: "/",
            },
            breadcrumb ? breadcrumb : { undefined },
          ]}
        />
        <Layout
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {(user?.cod_perfil ?? 2) === 1 && width > 768 && (
            <Sider width={200}>
              <Menu
                mode="inline"
                // defaultSelectedKeys={[selectedKeyMenu]}
                selectedKeys={[selectedKeyMenu]}
                // defaultOpenKeys={["sub1"]}
                style={{
                  height: "100%",
                }}
                items={itemsMenu}
              />
            </Sider>
          )}

          <Content
            style={{
              padding: "0 24px",
              minHeight: "calc(100vh - 170px)",
            }}
          >
            {user.cod_perfil === 1 ? (
              <Outlet />
            ) : location.pathname !== "/mi-voto" ? (
              <Result
                status="403"
                title="403"
                subTitle="No está autorizado para acceder a este recurso"
                extra={
                  <Button type="primary" onClick={() => navigate("/")}>
                    Regresar a inicio
                  </Button>
                }
              />
            ) : (
              <Outlet />
            )}
          </Content>
        </Layout>
      </Content>
    </Layout>
  ) : (
    <div style={{ width: "100wh", height: "100vh", display: "grid", placeContent: "center" }}>
      <LoadingOutlined spin />
    </div>
  )
}

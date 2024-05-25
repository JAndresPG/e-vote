import { Layout, Menu, Breadcrumb, theme } from "antd"

import { HomeOutlined } from "@ant-design/icons"
import { Outlet } from "react-router-dom"
const { Header, Sider, Content } = Layout

// const headerStyle = {
//   textAlign: 'center',
//   color: '#fff',
//   height: 64,
//   paddingInline: 48,
//   lineHeight: '64px',
//   backgroundColor: '#4096ff',
// };
// const contentStyle = {
//   textAlign: 'center',
//   minHeight: 120,
//   lineHeight: '120px',
//   color: '#fff',
//   backgroundColor: '#0958d9',
// };
// const siderStyle = {
//   textAlign: 'center',
//   lineHeight: '120px',
//   // color: '#fff',
//   // backgroundColor: '#1677ff',
// };

export function AppLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={[]}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
        >
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Eventos</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
            }}
            width={200}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
              }}
              items={[]}
            />
          </Sider>
          <Content
            style={{
              padding: "0 24px",
              minHeight: "70vh",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Content>
    </Layout>
  )
}

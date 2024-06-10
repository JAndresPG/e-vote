import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"

import locale from "antd/locale/es_ES.js"
import "dayjs/locale/es"
import { ConfigProvider } from "antd"

import "./App.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
)

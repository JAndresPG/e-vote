import { Form, notification } from "antd"

import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { optionsGet, optionsPost } from "../../extra/methods"
import { url } from "../../extra/constants"
import { useLayout } from "../others/useLayout"

export function useEventos() {
  useLayout("Procesos electorales")
  const [eventos, setEventos] = useState()
  const [openModal, setOpenModal] = useState(false)

  const navigate = useNavigate()

  const [api, contextHolder] = notification.useNotification()

  const [form] = Form.useForm()

  const columns = [
    {
      title: "Proceso electoral",
      dataIndex: "nombre",
      key: "evento",
    },
    {
      title: "Fechas",
      key: "fechas",
      children: [
        {
          title: "Inicio",
          dataIndex: "inicio",
          key: "inicio",
          align: "center",
        },
        {
          title: "Fin",
          dataIndex: "fin",
          key: "fin",
          align: "center",
        },
      ],
    },
  ]

  const obtenerEventos = useCallback(async () => {
    try {
      const response = await fetch(`${url}api/eventos`, optionsGet())

      if (!response.ok) {
        if (response.status === 401) navigate("/login")
        else throw new Error()
      }

      const res = await response.json()

      setEventos(res)
    } catch (e) {
      api["error"]({
        message: "Error",
        description: "No se pudo obtener los procesos electorales",
      })
    }
  }, [navigate, api])

  useEffect(() => {
    obtenerEventos()
  }, [obtenerEventos])

  const handleOkForm = async () => {
    await form.validateFields()
    form.submit()
  }

  const handleFinishForm = async (values) => {
    try {
      const res = await fetch(
        `${url}api/eventos`,
        optionsPost({
          ...values,
          inicio: values.inicio.format("DD/MM/YYYY HH:mm"),
          fin: values.fin.format("DD/MM/YYYY HH:mm"),
        })
      )
      if (!res.ok) {
        if (res.status === 401) navigate("/login")
        else throw new Error()
      }
      api["success"]({
        message: "Guardado",
        description: "Proceso electoral creado con éxito",
      })
      form.resetFields()
      setOpenModal(false)
      obtenerEventos()
    } catch (e) {
      api["error"]({
        message: "Error",
        description: "No se pudo crear el proceso electoral",
      })
    }
  }

  return {
    handleFinishForm,
    eventos,
    openModal,
    setOpenModal,
    handleOkForm,
    contextHolder,
    columns,
    form,
  }
}

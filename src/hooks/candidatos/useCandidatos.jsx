import { Button, Upload, notification } from "antd"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PictureOutlined, DeleteOutlined } from "@ant-design/icons"
import { getToken, optionsGet, optionsPost } from "../../extra/methods"
import { url } from "../../extra/constants"
import { useLayout } from "../others/useLayout"

export function useCandidatos() {
  useLayout("Candidatos")

  const [personas, setPersonas] = useState()
  const [eventos, setEventos] = useState()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedEvent, setSelectedEvent] = useState()

  const navigate = useNavigate()

  const [api, contextHolder] = notification.useNotification()

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
  }

  useEffect(() => {
    setSelectedEvent(eventos?.[0].value)
  }, [eventos])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${url}api/personas`, optionsGet())
        if (!res.ok) {
          if (res.status === 401) navigate("/login")
          else throw new Error()
        }
        const persons = await res.json()

        setPersonas(persons)
      } catch (e) {
        api["error"]({
          message: "Error",
          description: "No se pudo obtener las personas registradas",
        })
      }
    })()
  }, [navigate, api])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${url}api/eventos`, optionsGet())
        if (!res.ok) {
          if (res.status === 401) navigate("/login")
          else throw new Error()
        }
        const procesos = await res.json()

        setEventos(procesos.map(({ nombre, key }) => ({ label: nombre, value: key })))
      } catch (e) {
        api["error"]({
          message: "Error",
          description: "No se pudo obtener los procesos electorales",
        })
      }
    })()
  }, [navigate, api])

  const getCandidates = useCallback(async () => {
    if (!selectedEvent) return
    try {
      const res = await fetch(`${url}api/candidatos/${selectedEvent}`, optionsGet())
      if (!res.ok) {
        if (res.status === 401) navigate("/login")
        else throw new Error()
      }
      const candidatos = await res.json()

      setPersonas((state) =>
        state.map((s) => {
          const c = candidatos.find(({ cod_persona }) => cod_persona === s.key)
          if (c) return { ...s, foto: c.foto }
          else return { ...s, foto: undefined }
        })
      )
      setSelectedRowKeys((state) => [
        ...new Set([...state, ...candidatos.map(({ cod_persona }) => cod_persona)]),
      ])
    } catch (e) {
      api["error"]({
        message: "Error",
        description: "No se pudo obtener los candidatos para el evento escogido",
      })
    }
  }, [selectedEvent, api, navigate])

  useEffect(() => {
    getCandidates()
  }, [getCandidates])

  const handlechangeUpload = (file, value) => {
    if (file.status !== "done") return
    setSelectedRowKeys((state) => [...state, value])
    setPersonas((state) =>
      state.map((s) => {
        if (s.key === value) {
          return { ...s, foto: file.response.llave }
        } else {
          return s
        }
      })
    )
  }

  // eslint-disable-next-line no-unused-vars
  // const handleItemRenderUpload = (_, file, __, { remove }) => {
  //   if (!file.response) return
  //   return <Button icon={<DeleteOutlined />} danger onClick={remove} />
  // }

  const handleRemoveUpload = async (value) => {
    try {
      const { foto: llave } = personas.find((p) => p.key === value)
      const res = await fetch(`${url}api/removePhoto`, optionsPost({ llave }))
      if (!res.ok) {
        if (res.status === 401) navigate("/login")
        else throw new Error()
      }
      setPersonas((state) =>
        state.map((s) => {
          if (s.key === value) return { ...s, foto: undefined }
          return s
        })
      )
      setSelectedRowKeys((state) => state.filter((s) => s !== value))
      return true
    } catch (e) {
      api["error"]({
        message: "Error",
        description: "No se pudo eliminar la foto",
      })
      return false
    }
  }

  const columns = [
    {
      title: "Cédula",
      dataIndex: "cedula",
      key: "cedula",
    },
    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
    },
    {
      title: "Foto",
      dataIndex: "key",
      key: "foto",
      align: "center",
      render: (value) =>
        !personas.find((p) => p.key === value)?.foto ? (
          <Upload
            accept=".jpeg, .png, .jpg, .webp"
            action={`${url}api/uploadPhoto`}
            headers={{ authorization: `Bearer ${getToken()}` }}
            maxCount={1}
            method="POST"
            name="file"
            onChange={({ file }) => handlechangeUpload(file, value)}
            // itemRender={handleItemRenderUpload}
            // onRemove={(file) => handleRemoveUpload(value, file)}
          >
            <Button icon={<PictureOutlined />} />
          </Upload>
        ) : (
          <Button icon={<DeleteOutlined />} danger onClick={() => handleRemoveUpload(value)} />
        ),
    },
  ]

  const handleClickSave = async () => {
    try {
      const candidatos = personas
        .filter((p) => Boolean(p.foto))
        .map((p) => ({ cod_persona: p.key, foto: p.foto }))
      const res = await fetch(
        `${url}api/candidatos`,
        optionsPost({ candidatos, evento: selectedEvent })
      )

      if (!res.ok) {
        if (res.status === 401) navigate("/login")
        else throw new Error()
      }

      api["success"]({
        message: "Guardado",
        description: "Proceso electoral creado con éxito",
      })
    } catch (e) {
      api["error"]({
        message: "Error",
        description: "No se pudo guardar los candidatos",
      })
    }
  }

  return {
    contextHolder,
    rowSelection,
    handleClickSave,
    columns,
    eventos,
    selectedEvent,
    setSelectedEvent,
    personas,
  }
}

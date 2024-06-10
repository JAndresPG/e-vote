import { notification } from "antd"
import { useContext, useEffect, useState } from "react"
import { optionsGet, optionsPost } from "../../extra/methods"
import { url } from "../../extra/constants"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../others/useLayout"

import { useScreenSize } from "../others/useScreenSize"
import { UserContext } from "../../contexts/user-context"

export function useVoto() {
  useLayout("Voto")

  const { user } = useContext(UserContext)

  const [candidatos, setCandidatos] = useState()
  const [eventos, setEventos] = useState()
  const [selectedEvent, setSelectedEvent] = useState()

  const { width } = useScreenSize()

  const [api, contextHolder] = notification.useNotification()

  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${url}api/get-current-events`, optionsGet())
        if (!res.ok) {
          if (res.status === 401) navigate("/login")
          else throw new Error()
        }
        const events = await res.json()
        setEventos(events)
        setSelectedEvent(0)
      } catch (e) {
        api["error"]({
          message: "Error",
          description: "No se pudo obtener los procesos electorales actuales",
        })
      }
    })()
  }, [api, navigate])

  useEffect(() => {
    if (selectedEvent === undefined) return
    if (selectedEvent < 0) return
    ;(async () => {
      try {
        const res = await fetch(
          `${url}api/candidatos/${eventos[selectedEvent].cod_evento}`,
          optionsGet()
        )
        if (!res.ok) {
          if (res.status === 401) navigate("/login")
          else throw new Error()
        }
        const candidates = await res.json()

        setCandidatos(candidates)
      } catch (e) {
        api["error"]({
          message: "Error",
          description: "No se pudo obtener los candidatos para el evento escogido",
        })
      }
    })()
  }, [api, navigate, selectedEvent, eventos])

  const handleClickCard = (cod_persona) => {
    setCandidatos((state) =>
      state.map((s) => (s.cod_persona === cod_persona ? { ...s, checked: !s?.checked } : { ...s }))
    )
  }

  const handleClickSave = async () => {
    try {
      const res = await fetch(
        `${url}api/votos`,
        optionsPost({
          evento: eventos[selectedEvent].cod_evento,
          candidatos: candidatos.filter((c) => c.checked).map((c) => c.cod_persona),
        })
      )
      if (!res.ok) {
        if (res.status === 401) navigate("/login")
        else throw new Error()
      }
      api["success"]({
        message: "Guardado",
        description: "Voto almacenado con éxito",
      })
      navigate("/")
    } catch (e) {
      api["error"]({
        message: "Error",
        description: "No se pudo guardar el voto",
      })
    }
  }

  const handleClickCloseSesion = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return {
    handleClickCloseSesion,
    user,
    width,
    contextHolder,
    handleClickSave,
    handleClickCard,
    eventos,
    selectedEvent,
    setSelectedEvent,
    candidatos,
  }
}

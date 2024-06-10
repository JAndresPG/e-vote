import { Col, Row, Select, notification } from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { url } from "../extra/constants"
import { optionsGet } from "../extra/methods"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  // Pie,
  // PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useLayout } from "../hooks/others/useLayout"

export function Resultados() {
  useLayout("Resultados")

  const [api, contextHolder] = notification.useNotification()

  const [eventos, setEventos] = useState([])
  const [selectedEvent, setSelectedEvent] = useState()
  const [candidatos, setCandidatos] = useState()
  const [votosPorCandidato, setVotosPorCandidato] = useState()

  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        const response = await fetch(`${url}api/eventos`, optionsGet())

        if (!response.ok) {
          if (response.status === 401) navigate("/login")
          else throw new Error()
        }

        const res = await response.json()

        setEventos(res)
        res.length > 0 ? setSelectedEvent(res[0].key) : setSelectedEvent(undefined)
      } catch (e) {
        api["error"]({
          message: "Error",
          description: "No se pudo obtener los procesos electorales",
        })
      }
    })()
  }, [api, navigate])

  useEffect(() => {
    ;(async () => {
      if (!selectedEvent) return
      try {
        const res = await fetch(`${url}api/votos/${selectedEvent}`, optionsGet())
        if (!res.ok) {
          if (res.status === 401) navigate("/login")
          else throw new Error()
        }
        const votosCandidato = await res.json()
        // console.log(votosCandidato)
        setVotosPorCandidato(votosCandidato)
      } catch (e) {
        api["error"]({
          message: "Error",
          description: "No se pudo obtener los candidatos para el evento escogido",
        })
      }
    })()
  }, [api, navigate, selectedEvent])

  useEffect(() => {
    ;(async () => {
      if (!selectedEvent) return
      try {
        const res = await fetch(`${url}api/candidatos/${selectedEvent}`, optionsGet())
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
  }, [api, navigate, selectedEvent])

  return (
    <>
      {contextHolder}
      <Row gutter={[16, 50]}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Select
            style={{ width: "100%" }}
            options={eventos.map((e) => ({ label: e.nombre, value: e.key }))}
            value={selectedEvent}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <BarChart
            layout="horizontal"
            width={730}
            height={250}
            data={[
              ...(candidatos?.map((c) => ({
                name: c.nombres.split(" ")[0] + " " + c.apellidos.split(" ")[0],
                Votos: Number(
                  votosPorCandidato?.candidatosVotos.find((vc) => vc.candidato == c.cod_persona)
                    ?.votos ?? 0
                ),
              })) ?? []),
              {
                name: "En blanco",
                Votos: Number(votosPorCandidato?.votosEnBlanco ?? 0),
              },

              {
                name: "Nulos",
                Votos: Number(votosPorCandidato?.votosNulos ?? 0),
              },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Votos" fill="#8884d8" />
          </BarChart>
        </Col>
      </Row>
    </>
  )
}

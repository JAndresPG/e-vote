import { Col, Row, Select, notification } from "antd"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { url } from "../extra/constants"
import { optionsGet } from "../extra/methods"

import { useScreenSize } from "../hooks/others/useScreenSize"
import {
  // Bar,
  // BarChart,
  // CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  // Tooltip,
  // XAxis,
  // YAxis,
} from "recharts"
import { useLayout } from "../hooks/others/useLayout"

const COLORS = [
  "#FF5733", // Ana López
  "#33FF57", // Carlos Rodríguez
  "#3357FF", // Elena Díaz
  "#FF33A8", // José Hernández
  "#33FFF5", // José Párraga
  "#FF8C33", // Juan Pérez
  "#8C33FF", // Laura Gómez
  "#FFBB28", // Luis Martínez
  "#FF3333", // María González
  "#33A8FF", // Miguel Fernández
  "#B8B8B8", // Votos nulos
  "#E0E0E0", // Votos en blanco
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function Resultados() {
  useLayout("Resultados")

  const [api, contextHolder] = notification.useNotification()

  const [eventos, setEventos] = useState([])
  const [selectedEvent, setSelectedEvent] = useState()
  const [candidatos, setCandidatos] = useState([])
  const [votosPorCandidato, setVotosPorCandidato] = useState()

  const { width } = useScreenSize()

  const data = useMemo(
    () =>
      candidatos.length > 0
        ? [
            ...candidatos.map((c) => ({
              name: c.nombres.split(" ")[0] + " " + c.apellidos.split(" ")[0],
              value: Number(
                votosPorCandidato?.candidatosVotos?.find((cv) => cv.candidato == c.cod_persona)
                  ?.votos ?? 0
              ),
            })),
            {
              name: "Votos nulos",
              value: Number(votosPorCandidato?.votosNulos ?? 0),
            },
            {
              name: "Votos en blanco",
              value: Number(votosPorCandidato?.votosEnBlanco ?? 0),
            },
          ]
        : [],
    [candidatos, votosPorCandidato]
  )

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
          <ResponsiveContainer width="100%" aspect={width < 768 ? 1 : 2}>
            <PieChart width={1000} height={1000}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={95}
                fill="#8884d8"
                dataKey="value"
                // nameKey="name"
                // onClick={handleClick}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              {/* <Tooltip content={<CustomTooltip />} /> */}
              <Legend height={1} iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
          {/* <BarChart
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
          </BarChart> */}
        </Col>
      </Row>
    </>
  )
}

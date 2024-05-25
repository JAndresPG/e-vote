import { Button, Table } from "antd"

import { PlusCircleOutlined } from "@ant-design/icons"

export function Eventos() {
  const columns = [
    {
      title: "Evento",
      dataIndex: "evento",
      key: "evento",
    },
    {
      title: "Fechas",
      key: "fechas",
      children: [
        {
          title: "Inicio",
          dataIndex: "fecha_inicio",
          key: "inicio",
          align: "center",
        },
        {
          title: "Fin",
          dataIndex: "fecha_fin",
          key: "fin",
          align: "center",
        },
      ],
    },
  ]

  return (
    <>
      <Button type="primary" icon={<PlusCircleOutlined />} iconPosition="end" style={{ float: "right" }}>
        Crear
      </Button>
      <Table columns={columns} size="small"></Table>
    </>
  )
}

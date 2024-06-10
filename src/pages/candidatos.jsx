import { Button, Col, Row, Select, Table } from "antd"
import { SaveOutlined } from "@ant-design/icons"
import { useCandidatos } from "../hooks/candidatos/useCandidatos"

export function Candidatos() {
  const {
    contextHolder,
    rowSelection,
    handleClickSave,
    columns,
    eventos,
    selectedEvent,
    setSelectedEvent,
    personas,
  } = useCandidatos()

  return (
    <>
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Select
            style={{ width: "100%" }}
            options={eventos}
            value={selectedEvent}
            onChange={(value) => setSelectedEvent(value)}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Button block type="primary" icon={<SaveOutlined />} onClick={handleClickSave}>
            Guardar
          </Button>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={personas}
            size="small"
            pagination={{ size: "default" }}
            scroll={{ x: true }}
          />
        </Col>
      </Row>
    </>
  )
}

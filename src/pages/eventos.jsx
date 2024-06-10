import { Button, DatePicker, Form, Input, Modal, Space, Table } from "antd"

import { PlusCircleOutlined } from "@ant-design/icons"
import { useEventos } from "../hooks/eventos/useEventos"

export function Eventos() {
  const {
    contextHolder,
    columns,
    handleFinishForm,
    handleOkForm,
    openModal,
    setOpenModal,
    eventos,
    form,
  } = useEventos()

  return (
    <>
      {contextHolder}
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          style={{ float: "right" }}
          onClick={() => setOpenModal(true)}
        >
          Crear
        </Button>
        <Table
          columns={columns}
          dataSource={eventos}
          size="small"
          pagination={{ size: "default" }}
        />
      </Space>
      <Modal
        open={openModal}
        title="Eventos"
        onCancel={() => setOpenModal(false)}
        onOk={handleOkForm}
      >
        <Form form={form} requiredMark="optional" onFinish={handleFinishForm}>
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: "Nombre requerido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="inicio" label="Fecha de inicio" required>
            <DatePicker showTime format="DD/MM/YYYY HH:mm" />
          </Form.Item>
          <Form.Item name="fin" label="Fecha de fin" required>
            <DatePicker showTime format="DD/MM/YYYY HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

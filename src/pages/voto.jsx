import { Col, Row, Card, Select, Typography, Button, Result } from "antd"
import { url } from "../extra/constants"

// import style from "./voto.module.css"
import { Square } from "../components/icons/svg"
import { SaveOutlined } from "@ant-design/icons"
import { useVoto } from "../hooks/votos/useVoto"

export function Voto() {
  const {
    eventos,
    contextHolder,
    selectedEvent,
    setSelectedEvent,
    handleClickCard,
    handleClickCloseSesion,
    candidatos,
    width,
    user,
    handleClickSave,
  } = useVoto()

  return (eventos?.length ?? 0) > 0 ? (
    <>
      {contextHolder}
      {eventos?.length > 1 && (
        <Select
          options={eventos.map((e) => ({ label: e.nombre, value: e.cod_evento }))}
          value={selectedEvent}
          onChange={(value) => setSelectedEvent(value)}
        />
      )}
      <Typography.Title style={{ marginTop: 0, textAlign: "center" }}>
        {eventos?.[selectedEvent]?.nombre}
      </Typography.Title>
      <Row gutter={[16, 16]}>
        {candidatos?.map(({ cod_persona, nombres, apellidos, foto }) => (
          <Col key={cod_persona} xs={12} sm={8} md={8} lg={8} xl={6}>
            <Card
              cover={<img style={{ aspectRatio: 1 }} src={`${url}api/get-photo/${foto}`} />}
              style={{ cursor: "pointer", fontSize: "1.3rem" }}
              actions={[
                <Square
                  width="70%"
                  checked={candidatos.find(({ cod_persona: cp }) => cod_persona === cp)?.checked}
                  key={`${
                    candidatos.find(({ cod_persona: cp }) => cod_persona === cp)?.checked
                      ? "checked"
                      : "unchecked"
                  } ${cod_persona}`}
                />,
              ]}
              onClick={() => handleClickCard(cod_persona)}
            >
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {nombres.split(" ")[0]} {apellidos.split(" ")[0]}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <br />
      {width > 768 && (
        <>
          <br />
          <br />
        </>
      )}
      <div
        style={{
          width:
            width > 768
              ? user.cod_perfil === 2
                ? "calc(100% - 144px)"
                : "calc(100% - 345px)"
              : "calc(100% - 68px)",
          position: "fixed",
          top: "93%",
          backgroundColor: "#fff",
          padding: "10px",
        }}
      >
        <Button icon={<SaveOutlined />} block type="primary" onClick={handleClickSave}>
          Guardar
        </Button>
      </div>
    </>
  ) : (
    <Result
      status="success"
      title="No hay procesos electorales pendientes"
      subTitle="Usted ya ha ejercido su derecho al voto y no tiene procesos electorales pendientes por realizar."
      extra={
        <Button type="primary" onClick={handleClickCloseSesion}>
          Cerrar sesión
        </Button>
      }
    />
  )
}

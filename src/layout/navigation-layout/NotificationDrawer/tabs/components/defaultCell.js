export default function Cell(props) {
  const { cellContent } = props
  return (
    <Col>
      <Card style={{ width: '100%' }}>
        <Row type="flex">
          <Col style={{textAlign: 'left'}}>{cellContent.station}</Col>
          <Col style={{textAlign: 'right'}}>{cellContent.exceededTime}</Col>
        </Row>
        <Row>
          <span style={{color: 'red'}}>{i18n.parameters}:</span>
          &nbsp;
          {_.join(cellContent.exceededParams, ', ')}
        </Row>
        <Row>
          <span style={{color: 'orange'}}>{i18n.parameters}:</span>
          &nbsp;
          {_.join(cellContent.exceededPreparingParams, ', ')}
        </Row>
        <Row gutter={16}>
          <Button>{i18n.gotoRealtimeMonitoringPage}</Button>
          <Button>{i18n.viewDataAroundThisTime}</Button>
        </Row>
      </Card>
    </Col>
  )
}
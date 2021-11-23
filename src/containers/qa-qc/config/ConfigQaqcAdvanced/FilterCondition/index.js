import { Col, Icon, Row, Switch } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import { Clearfix } from 'components/layouts/styles'
import { ModalConfirmDelete } from 'containers/qa-qc/config/ConfigQaqcAdvanced/components'
import React from 'react'
import styled from 'styled-components'
import ModalConditionFilter from './ModalConditionFilter'
import TableConditionFilter from './TableConditionFilter'

const ColSwitch = styled(Col)`
  .ant-form-item .ant-switch {
    margin: 20px 0 4px;
  }
`
export const FIELDS = {
  FILTER_NAME: 'filterName',
  STATION_TYPE: 'stationType',
  STATION: 'stationKeys',
  CONDITIONS: 'conditions',
}

class FilterConditionContainer extends React.Component {
  state = {
    stationKey: '',
    isShowModalConditionFilter: false,
    isShowModalConfirmDelete: false,
  }

  showModalConditionFilter = () => {
    this.setState({
      isShowModalConditionFilter: true,
    })
  }

  showModalConfirmDelete = () => {
    this.setState({
      isShowModalConfirmDelete: true,
    })
  }

  onCancelModalConfirmDelete = () => {
    this.setState({
      isShowModalConfirmDelete: false,
    })
  }

  onCancelModalConditionFilter = () => {
    this.setState({
      isShowModalConditionFilter: false,
    })
  }

  handleChangeStationAuto = stationKey => {
    this.setState({
      stationKey,
    })
  }

  render() {
    const {
      stationKey,
      isShowModalConditionFilter,
      isShowModalConfirmDelete,
    } = this.state
    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <Col span={6}>
            <SelectStationAuto
              onChange={this.handleChangeStationAuto}
              placeholder="Trạm quan trắc"
              value={stationKey}
            />
          </Col>
          <Col span={6}>
            <Row type="flex" justify="end" align="middle">
              <ColSwitch>
                <div style={{ marginRight: '10px' }}>
                  <Switch defaultChecked />
                </div>
              </ColSwitch>
              <Col>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  Bộ lọc điều kiện giá trị
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Clearfix height={12} />
        <TableConditionFilter
          editRecord={this.showModalConditionFilter}
          footer={() => (
            <div onClick={this.showModalConditionFilter}>
              <Row type="flex">
                <div style={{ marginRight: '10px' }}>
                  <Icon type="plus" style={{ color: '#1890FF' }} />
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#1890FF',
                  }}
                >
                  Thêm điều kiện lọc
                </div>
              </Row>
            </div>
          )}
        />
        <ModalConditionFilter
          visible={isShowModalConditionFilter}
          onCancel={this.onCancelModalConditionFilter}
          showConfirmDelete={this.showModalConfirmDelete}
        />
        <ModalConfirmDelete
          visible={isShowModalConfirmDelete}
          closable={false}
          footer={false}
          onCancelDelete={this.onCancelModalConfirmDelete}
        />
      </React.Fragment>
    )
  }
}

export default FilterConditionContainer

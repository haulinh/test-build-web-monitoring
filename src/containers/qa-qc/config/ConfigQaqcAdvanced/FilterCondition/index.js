import { Col, Form, Icon, Row, Switch, Button } from 'antd'
import CalculateApi from 'api/CalculateApi'
import SelectStationAuto from 'components/elements/select-station-auto'
import { Clearfix } from 'components/layouts/styles'
import { ModalConfirmDelete } from 'containers/qa-qc/config/ConfigQaqcAdvanced/components'
import React from 'react'
import { connect } from 'react-redux'
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
  STATION_KEYS: 'stationKeys',
  STATION_TYPE: 'stationType',
  STATION: 'stationKeys',
  STATION_ID: 'stationId',
  CONDITIONS: 'conditions',
}

const operators = {
  eq: '=',
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<=',
}

const Item = props => (
  <Form.Item
    className="noMarginBot"
    {...props}
    colon={false}
    style={{
      color: 'rgba(0,0,0,0.8)',
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 0,
    }}
  />
)

@Form.create()
@connect(state => ({
  stationAutos: state.stationAuto.list,
}))
class FilterConditionContainer extends React.Component {
  state = {
    stationAutos: [],
    stationKey: '',
    isShowModalConditionFilter: false,
    isShowModalConfirmDelete: false,
    conditionItem: '',
    dataConditionFromApi: [],
    loading: false,
    conditionFilterDataTable: [],
  }

  async componentDidMount() {
    await this.getData()
    let count = 0
    const conditionDataList = this.state.dataConditionFromApi.map(condition => {
      count += 1
      return {
        key: `${count}`,
        conditionName: condition.name,
        stationName: condition.station.name,
        conditionMeasure: condition.conditions.map(item => {
          return {
            conditionMeasureItem: `${item.measure} ${
              operators[item.operator]
            } ${item.value}`,
            excludeMeasure: item.excludeMeasures.join(', '),
          }
        }),
      }
    })
    this.setState({
      conditionFilterDataTable: conditionDataList,
    })
  }

  getData = async () => {
    try {
      this.setState({ loading: true })
      const data = await CalculateApi.getQaqcConfigs({
        limit: 999999,
        offset: 0,
      })
      const conditionFilterData = data.results.filter(
        item => item.type === 'value'
      )
      this.setState({
        dataConditionFromApi: conditionFilterData,
        loading: false,
      })
      console.log(this.state.dataConditionFromApi)
    } catch (error) {
      this.setState({ loading: false })
    }
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

  setConditionFilter = conditionItem => {
    this.setState({
      isShowModalConfirmDelete: true,
      conditionItem,
    })
  }

  deleteConditionFilterItem = () => {
    let { conditionFilterDataTable } = this.state
    const { conditionItem } = this.state
    const newConditionFilterList = conditionFilterDataTable.filter(
      item => item.key !== conditionItem
    )
    this.setState({
      conditionFilterDataTable: newConditionFilterList,
      isShowModalConfirmDelete: false,
    })
  }

  fetchStationAutoSuccess = stationAutos => {
    const { form } = this.props
    this.setState({ stationAutos })
    const stationAutoKeys = stationAutos.map(stationAuto => stationAuto.key)
    form.setFieldsValue({
      [FIELDS.STATION_KEYS]: stationAutoKeys,
    })
  }

  render() {
    const {
      stationKey,
      isShowModalConditionFilter,
      isShowModalConfirmDelete,
      conditionFilterDataTable,
    } = this.state
    const { form } = this.props
    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <Col span={10}>
            <Item label="">
              {form.getFieldDecorator(
                FIELDS.STATION_KEYS,
                {}
              )(
                <SelectStationAuto
                  onChange={this.handleChangeStationAuto}
                  mode="multiple"
                  style={{ width: '100%' }}
                  onFetchSuccess={this.fetchStationAutoSuccess}
                />
              )}
            </Item>
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
          dataSource={conditionFilterDataTable}
          setConditionFilter={this.setConditionFilter}
          footer={() => (
            <div
              style={{ cursor: 'pointer' }}
              onClick={this.showModalConditionFilter}
            >
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
          onConfirmDelete={this.deleteConditionFilterItem}
          onCancelDelete={this.onCancelModalConfirmDelete}
        />
      </React.Fragment>
    )
  }
}

export default FilterConditionContainer

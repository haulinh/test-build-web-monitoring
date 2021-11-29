import { Col, Form, Icon, Row, Switch } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { toggleQaqcConfig } from 'api/CategoryApi'
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
  STATION_TYPE: 'stationType',
  STATION: 'stationKeys',
  STATION_ID: 'stationId',
  CONDITIONS: 'conditions',
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
    data: [],
    loading: false,
    isApplyConditionFilter: true,
  }

  async componentDidMount() {
    await this.getData()
  }

  getData = async () => {
    try {
      this.setState({ loading: true })
      const dataFromApi = await CalculateApi.getQaqcConfigs({
        limit: 999999,
        offset: 0,
      })
      const conditionFilterData = dataFromApi.results.filter(
        item => item.type === 'value'
      )
      this.setState({
        data: conditionFilterData,
        loading: false,
      })
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
    let { data } = this.state
    const { conditionItem } = this.state
    const newConditionFilterList = data.filter(
      item => item.key !== conditionItem
    )
    this.setState({
      data: newConditionFilterList,
      isShowModalConfirmDelete: false,
    })
  }

  fetchStationAutoSuccess = stationAutos => {
    const { form } = this.props
    this.setState({ stationAutos })
    const stationAutoKeys = stationAutos.map(stationAuto => stationAuto.key)
    form.setFieldsValue({
      [FIELDS.STATION]: stationAutoKeys,
    })
  }

  onChangeSwitchFilter = async value => {
    const param = {
      excludeParametersByValue: value,
    }
    await toggleQaqcConfig(param)
    this.setState({
      isApplyConditionFilter: value,
    })
  }

  render() {
    const {
      isShowModalConditionFilter,
      isShowModalConfirmDelete,
      data,
      isApplyConditionFilter,
    } = this.state
    const { form } = this.props
    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <Col span={10}>
            <Item label="">
              {form.getFieldDecorator(
                FIELDS.STATION,
                {}
              )(
                <SelectStationAuto
                  mode="multiple"
                  style={{ width: '100%' }}
                  maxTagCount={3}
                  fieldValue
                  placeholder="Chọn trạm quan trắc"
                />
              )}
            </Item>
          </Col>
          <Col span={6}>
            <Row type="flex" justify="end" align="middle">
              <ColSwitch>
                <div style={{ marginRight: '10px' }}>
                  <Switch defaultChecked onClick={this.onChangeSwitchFilter} />
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
          dataSource={data}
          setConditionFilter={this.setConditionFilter}
          isDisabled={isApplyConditionFilter}
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
          dataWithConditionFilter={data}
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

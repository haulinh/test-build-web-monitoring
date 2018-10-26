import React from 'react'
import { autobind } from 'core-decorators'
import { Button, Modal, Checkbox } from 'antd'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'
import * as _ from 'lodash'
import BoxShadow from 'components/elements/box-shadow'
import TabTableDataList from './tab-table-data-list'
// import TabChart from './tab-chart/index'
// import ROLE from 'constants/role'
// import protectRole from 'hoc/protect-role'

const TabeListWrapper = BoxShadow.extend`
  padding: 0px 16px 16px 16px;
  display: flex;
  flex-direction: column;
`

const ButtonAbsolute = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`

const Row = styled.div`
  margin-bottom: 8px;
`

@autobind
export default class TabeList extends React.PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool,
    measuringList: PropTypes.array,
    measuringData: PropTypes.array,
    dataStationAuto: PropTypes.array,
    dataFilterBy: PropTypes.array,
    pagination: PropTypes.object,
    onChangePage: PropTypes.func,
    onApprovedData: PropTypes.func,
    nameChart: PropTypes.string,
    isExporting: PropTypes.bool,
    onChangeData: PropTypes.func,
    onUnApprovedData: PropTypes.func,
    onItemChecked: PropTypes.func,
    valueField: PropTypes.string
  }

  //dataSelected

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      options: [],
      checkedAll: _.get(props, 'dataSelected.checked', false),
      data: _.get(props, 'dataSelected.list', [])
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this.setState({
        checkedAll: _.get(nextProps, 'dataSelected.checked', false),
        data: _.get(nextProps, 'dataSelected.list', [])
      })
    }
  }

  onManualApprove = e => {
    this.setState({ visible: true })
  }

  onManualApproveChecked = options => {
    this.setState({ options })
  }

  renderButtonApprove () {
    if (this.state.checkedAll || (!this.state.checkedAll && _.size(this.state.data) > 0)) {
      return (
        <Button
            type="primary"
            icon="schedule"
            style={{ float: 'right', margin: '5px' }}
            onClick={this.props.onApprovedData}
            loading={this.props.isExporting}
          >
            {translate('qaqc.approve')}
          </Button>
      )
    }
    return ` `
  }

  renderButton = () => {
    if (this.props.valueField === 'value') {
      return (
        <ButtonAbsolute>
          <Button
            type="primary"
            icon="schedule"
            style={{ float: 'right', margin: '5px' }}
            onClick={this.onManualApprove}
            loading={this.props.isExporting}
          >
            {translate('qaqc.manualApprove')}
          </Button>
          {
            this.renderButtonApprove()
          }
        </ButtonAbsolute>
      )
    }

    return (
      <ButtonAbsolute>
        <Button
          type="danger"
          icon="schedule"
          style={{ float: 'right', margin: '5px' }}
          onClick={this.props.onUnApprovedData}
          loading={this.props.isExporting}
        >
          {translate('qaqc.unApprove')}
        </Button>
      </ButtonAbsolute>
    )
  }

  handleManualCancel = e => {
    this.setState({ options: [], visible: false })
  }

  handleManualOk = e => {
    this.setState({ visible: false })
    this.props.onApprovedData(e, this.state.options)
  }

  handleItemChecked = (type, checked) => {
    let data = _.get(this.state, 'data', [])
    if (_.isEqual(type, 'ALL')) {
      data = []
      this.setState({ checkedAll: checked, data })
    } else {
      if (this.state.checkedAll) {
        if (checked) {
          data = _.filter(data, it => !_.isEqual(it, type))
        } else {
          data = _.union(data, [type])
        }
      } else {
        if (checked) {
          data = _.union(data, [type])
        } else {
          data = _.filter(data, it => !_.isEqual(it, type))
        }
      }

      this.setState({ data })
    }

    this.props.onItemChecked(this.state.checkedAll, data)
  }

  render() {
    return (
      <TabeListWrapper>
        {this.props.valueField !== 'original' && this.renderButton()}
        <TabTableDataList
          loading={this.props.isLoading}
          measuringList={this.props.measuringList}
          measuringData={this.props.measuringData}
          dataSource={this.props.dataStationAuto}
          pagination={this.props.pagination}
          onChange={this.props.onChangePage}
          dataFilterBy={this.props.dataFilterBy}
          handleSave={this.props.onChangeData}
          valueField={this.props.valueField}
          checkedAll={this.state.checkedAll}
          listChecked={this.state.data}
          onItemChecked={this.handleItemChecked}
        />
        <Modal
          title={translate('qaqc.manualApprove')}
          cancelText={translate('qaqc.cancel')}
          okText={translate('qaqc.ok')}
          visible={this.state.visible}
          onOk={this.handleManualOk}
          onCancel={this.handleManualCancel}
        >
          <Checkbox.Group
            style={{ width: '100%' }}
            onChange={this.onManualApproveChecked}
          >
            <Row>
              <h5>{translate('qaqc.removeDataBy')}</h5>
            </Row>
            <Row>
              <Checkbox value="ZERO">
                {translate('qaqc.dataFilter.isZero')}
              </Checkbox>
            </Row>
            <Row>
              <Checkbox value="NEGATIVE">
                {translate('qaqc.dataFilter.negative')}
              </Checkbox>
            </Row>
            <Row>
              <Checkbox value="OUT_RANGE">
                {translate('qaqc.dataFilter.outOfRange')}
              </Checkbox>
            </Row>
            <Row>
              <Checkbox value="DEVICE_STATUS">
                {translate('qaqc.dataFilter.deviceStatus')}
              </Checkbox>
            </Row>
          </Checkbox.Group>
        </Modal>
      </TabeListWrapper>
    )
  }
}

import React from 'react'
import { autobind } from 'core-decorators'
import { Button, Modal, Checkbox } from 'antd'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'
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
    valueField: PropTypes.string
  }

  state = {
    visible: false
  }

  handleOk = e => {
    this.setState({ visible: false })
  }

  handleCancel = e => {
    this.setState({ visible: false })
  }

  handleCancelApprove = e => {
    this.setState({ visible: true })
  }

  onCancelApproveChecked = e => {
    console.log('onCancelApproveChecked', e)
  }

  renderButton = () => {
    if (this.props.valueField === 'value') {
      return (
        <ButtonAbsolute>
          <Button
            type="primary"
            icon="schedule"
            style={{ float: 'right', margin: '5px' }}
            onClick={this.handleCancelApprove}
            loading={this.props.isExporting}
          >
            {translate('qaqc.manualApprove')}
          </Button>
          <Button
            type="primary"
            icon="schedule"
            style={{ float: 'right', margin: '5px' }}
            onClick={this.props.onApprovedData}
            loading={this.props.isExporting}
          >
            {translate('qaqc.approve')}
          </Button>
          <Button
            type="primary"
            icon="schedule"
            style={{ float: 'right', margin: '5px' }}
            onClick={this.props.onApprovedData}
            loading={this.props.isExporting}
          >
            {translate('qaqc.approveAll')}
          </Button>
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
          {translate('qaqc.cancel')}
        </Button>
        <Button
          type="danger"
          icon="schedule"
          style={{ float: 'right', margin: '5px' }}
          onClick={this.props.onUnApprovedData}
          loading={this.props.isExporting}
        >
          {translate('qaqc.allCancel')}
        </Button>
      </ButtonAbsolute>
    )
  }

  render() {
    return (
      <TabeListWrapper>
        {this.renderButton()}
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
        />
        <Modal
          title={translate('qaqc.manualApprove')}
          cancelText={translate('qaqc.cancel')}
          okText={translate('qaqc.ok')}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Checkbox.Group
            style={{ width: '100%' }}
            onChange={this.onCancelApproveChecked}
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

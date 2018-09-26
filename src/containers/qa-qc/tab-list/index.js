import React from 'react'
import { autobind } from 'core-decorators'
import { Button } from 'antd'
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

const ButtonAbsolute = styled.div``

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

  renderButton = () => {
    if (this.props.valueField === 'value') {
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

    return (
      <Button
        type="danger"
        icon="schedule"
        style={{ float: 'right', margin: '5px' }}
        onClick={this.props.onUnApprovedData}
        loading={this.props.isExporting}
      >
        {translate('qaqc.unApprove')}
      </Button>
    )
  }

  render() {
    return (
      <TabeListWrapper>
        <ButtonAbsolute>
          {
            this.renderButton()
          }
        </ButtonAbsolute>
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
      </TabeListWrapper>
    )
  }
}

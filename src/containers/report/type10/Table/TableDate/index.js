import { Col, Row, Tabs } from 'antd'
import DataInsight from 'api/DataInsight'
import { Clearfix } from 'components/layouts/styles'
import { DD_MM_YYYY } from 'constants/format-date'
import { translate } from 'hoc/create-lang'
import _, { get } from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import { REPORT_TYPE } from '../../constants'
import { FIELDS, i18n } from '../../constants'

import TableDateMonitoring from './TableDateMonitoring'
import TableDateObtained from './TableDateObtained'

const { TabPane } = Tabs

export default class TableDate extends Component {
  state = {
    dataSource: [],
    loading: false,
    activeKey: this.props.stationKeys[0],
  }

  fetchData = async () => {
    const { activeKey } = this.state
    const { dataSearch, reportType } = this.props

    const params = {
      stationKeys: activeKey,
      from: dataSearch.from,
      to: dataSearch.to,
      type: reportType,
      [FIELDS.TIME_TYPE]: dataSearch[FIELDS.TIME_TYPE],
    }

    this.setState({ loading: true })
    try {
      const result = await DataInsight.getDataRatio(
        dataSearch[FIELDS.TIME_TYPE],
        params
      )
      this.setState({
        dataSource: result,
        loading: false,
      })
      console.log({ result })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  onSearch = () => {
    const { stationKeys } = this.props
    this.setState({ activeKey: stationKeys[0] }, () => {
      this.fetchData(stationKeys[0])
    })
  }

  handleOnChange = activeKey => {
    this.setState({ activeKey }, () => {
      this.fetchData()
    })
  }

  render() {
    const { stationKeys, hidden, stationAutos, reportType } = this.props
    const { activeKey, loading, dataSource } = this.state

    const stationAutoByKey = _.keyBy(stationAutos, 'key')
    const dataFrequency = get(dataSource, ['0', 'station', 'dataFrequency'])

    const TableData = {
      [REPORT_TYPE.OBTAINED]: (
        <TableDateObtained
          loading={loading}
          dataSource={get(dataSource, ['0', 'data'])}
          dataFrequency={dataFrequency}
        />
      ),
      [REPORT_TYPE.MONITORING]: (
        <TableDateMonitoring
          dataFrequency={dataFrequency}
          loading={loading}
          dataSource={dataSource}
        />
      ),
    }

    return (
      <div style={{ display: hidden && 'none' }}>
        <Tabs
          activeKey={activeKey}
          defaultActiveKey={activeKey}
          onChange={this.handleOnChange}
        >
          {stationKeys.map(stationKey => {
            const isHaveActivatedAt = _.get(dataSource, [
              '0',
              'station',
              'activatedAt',
            ])
            return (
              <TabPane tab={stationAutoByKey[stationKey].name} key={stationKey}>
                <Row type="flex" justify="end">
                  <Col>
                    <div style={{ fontWeight: 500 }}>
                      {i18n().header6}:{' '}
                      {isHaveActivatedAt
                        ? moment(dataSource[0].station.activatedAt).format(
                            DD_MM_YYYY
                          )
                        : translate('report.typeRatio.notUpdate')}
                    </div>
                  </Col>
                </Row>
                <Clearfix height={8} />

                {TableData[reportType]}
              </TabPane>
            )
          })}
        </Tabs>
      </div>
    )
  }
}

import React from 'react'
import {
  Checkbox,
  Form,
  Button,
  Tabs,
  Card,
  Skeleton,
  Row,
  message,
  // Modal
} from 'antd'
import PropTypes from 'prop-types'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import { translate } from 'hoc/create-lang'
import { getStationTypes } from 'api/CategoryApi'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import TableConfig from './table'
import { getConfigQAQC, postConfigQAQC, putConfigQAQC } from 'api/CategoryApi'
import Disconnection from 'components/elements/disconnection'

const { TabPane } = Tabs

const i18n = {
  beyondMeasuringRange: translate('qaqcConfig.beyondMeasuringRange'),
  deviceError: translate('qaqcConfig.deviceError'),
  deviceCalibration: translate('qaqcConfig.deviceCalibration'),

  btnEdit: translate('addon.save'),
  btnSave: translate('addon.create'),
  disconnectionMessage: translate('network.qaqc.lostConnection'),

  updateSuccess: translate('addon.onSave.update.success'),
}

@connect(state => ({
  isInitLoaded: state.stationAuto.isInitLoaded,
  stationList: state.stationAuto.list,
}))
@Form.create()
export default class QAQC_Config extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isInitLoaded: false,
      activeTabkey: 'tab1',
      tabList: [],
      isDisconnection: false,
      isLoading: false,
      configId: null,
      stationTypes: [],
      configQAQC: {},
    }
    this.getData = this.getData.bind(this)
  }

  static propTypes = {
    onCompleted: PropTypes.func,
    isDrawer: PropTypes.bool,
    stationType: PropTypes.string,
  }

  dataTable = []

  _renderDisconnection = () => (
    <Row type="flex" justify="center" align="middle">
      <Disconnection messages={i18n.disconnectionMessage} />
    </Row>
  )

  handleSubmit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values)
      }
      let measureConfig = await this.getData()
      // console.log('measureConfig', measureConfig)

      let response = null
      // console.log(this.state.configId, '(this.state.configId')
      if (this.state.configId) {
        response = await putConfigQAQC(this.state.configId, {
          measureConfig: {
            ...measureConfig,
          },
          ...values,
        })
      } else {
        response = await postConfigQAQC({
          measureConfig: {
            ...measureConfig,
          },
          ...values,
        })
      }

      if (response.success) {
        message.success(i18n.updateSuccess)
        if (!this.state.configId) {
          this.setState({
            configId: _.get(response, 'data._id', null),
          })
        }
      } else message.error(response.message)

      this.setState({ isLoading: false }, this.props.onCompleted)
    })
  }

  async getData() {
    let result = {}
    for (var i = 0; i < this.dataTable.length; i++) {
      let item = this.dataTable[i]
      let data = await item.getTableData()
      result = _.merge(result, data)
    }
    return result
  }

  onTabChange = (key, type) => {
    // console.log(key, type)
    this.setState({ activeTabkey: key })
  }

  async componentDidMount() {
    try {
      let stationTypes = await getStationTypes({}, { isAuto: true })
      if (stationTypes.success) {
        const { stationType } = this.props
        let tabList = stationTypes.data
          .filter(({ key }) => !stationType || key === stationType)
          .map(item => {
            return {
              key: item.key,
              tab: item.name,
              name: item.name,
            }
          })
        this.setState({
          stationTypes: stationTypes.data,
          tabList,
          activeTabkey: _.result(stationTypes.data, '[0].key', ''),
        })
      } else {
        this.setState({ isDisconnection: true })
      }
      let dataForm = {}
      let response = await getConfigQAQC()
      // console.log("response,", response)
      if (response.success) {
        const data = _.get(response, 'data.value', null)
        if (data) {
          dataForm = {
            beyondMeasuringRange: data.beyondMeasuringRange,
            deviceError: data.deviceError,
            deviceCalibration: data.deviceCalibration,
            ...(this.props.stationType
              ? {
                  [this.props.stationType]:
                    data.measureConfig[this.props.stationType],
                }
              : data.measureConfig),
          }
          this.setState({
            configQAQC: data,
            configId: _.get(response, 'data._id', null),
            isHaveConfig: true,
          })
        }
      } else {
        this.setState({ isDisconnection: true })
      }

      this.setState({ isInitLoaded: true }, () => {
        const { setFieldsValue } = this.props.form
        setFieldsValue(dataForm)
      })
    } catch (e) {
      // console.log('qaqc service error', e.message)
      this.setState({ isDisconnection: true })
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.stationType !== this.props.stationType) {
      const { stationType } = nextProps
      let tabList = this.state.stationTypes
        .filter(({ key }) => !stationType || key === stationType)
        .map(item => {
          return {
            key: item.key,
            tab: item.name,
            name: item.name,
          }
        })
      this.setState({
        tabList,
        activeTabkey: _.result(tabList, '[0].key', ''),
      })
      let dataForm = {}
      const data = this.state.configQAQC
      if (data) {
        dataForm = {
          beyondMeasuringRange: data.beyondMeasuringRange,
          deviceError: data.deviceError,
          deviceCalibration: data.deviceCalibration,
          ...(nextProps.stationType
            ? {
                [nextProps.stationType]:
                  data.measureConfig[nextProps.stationType],
              }
            : data.measureConfig),
        }
      }
      this.setState({ isInitLoaded: true }, () => {
        const { setFieldsValue } = this.props.form
        setFieldsValue(dataForm)
      })
    }
  }

  getMeasuring() {
    let result = []
    let stations = this.props.stationList.filter(
      item => _.result(item, 'stationType.key') === this.state.activeTabkey
    )
    stations.map(station => {
      let measures = station.measuringList.map(mea => mea.key)
      result = _.union(result, measures)

      return null
    })

    return result
  }

  getMeasuringByType(type) {
    let result = []
    let stations = this.props.stationList.filter(
      item => _.result(item, 'stationType.key') === type
    )
    stations.map(station => {
      let measures = station.measuringList.map(mea => mea.key)
      result = _.union(result, measures)

      return null
    })

    return result
  }

  handleOnChangeTabKey = activeTabkey => {
    this.setState({ activeTabkey })
  }

  renderContent() {
    const { getFieldDecorator } = this.props.form
    return (
      <React.Fragment>
        {this.state.isDisconnection ? (
          this._renderDisconnection()
        ) : (
          <Form style={{ padding: 24 }}>
            {!this.state.isInitLoaded && (
              <Skeleton
                title={false}
                paragraph={{ rows: 3, width: [200, 200, 200] }}
              />
            )}

            {this.state.isInitLoaded && (
              <div>
                <Form.Item style={{ marginBottom: 8 }}>
                  {getFieldDecorator('beyondMeasuringRange', {
                    valuePropName: 'checked',
                  })(<Checkbox>{i18n.beyondMeasuringRange}</Checkbox>)}
                </Form.Item>
                <Form.Item style={{ marginBottom: 8 }}>
                  {getFieldDecorator('deviceError', {
                    valuePropName: 'checked',
                  })(<Checkbox>{i18n.deviceError}</Checkbox>)}
                </Form.Item>
                <Form.Item style={{ marginBottom: 8 }}>
                  {getFieldDecorator('deviceCalibration', {
                    valuePropName: 'checked',
                  })(<Checkbox>{i18n.deviceCalibration}</Checkbox>)}
                </Form.Item>
              </div>
            )}

            <Card
              loading={!this.state.isInitLoaded || !this.props.isInitLoaded}
              style={{ width: '100%' }}
            >
              <Tabs
                defaultActiveKey={this.state.activeTabkey}
                activeKey={this.state.activeTabkey}
                onChange={this.handleOnChangeTabKey}
              >
                {this.state.tabList.map(tab => {
                  let measures = this.getMeasuringByType(tab.key)

                  let dataTableMeasures = measures.map(item => {
                    return {
                      key: item,
                      zero: false,
                      negative: false,
                    }
                  })
                  return (
                    <TabPane forceRender={true} tab={tab.name} key={tab.key}>
                      <TableConfig
                        form={this.props.form}
                        getRef={ref => this.dataTable.push(ref)}
                        dataTableMeasures={dataTableMeasures}
                        type={tab.key}
                      />
                    </TabPane>
                  )
                })}
              </Tabs>
            </Card>

            <br />
            {this.state.isInitLoaded && (
              <Button
                loading={this.state.isLoading}
                block
                type="primary"
                onClick={() => {
                  this.setState({ isLoading: true }, this.handleSubmit)
                }}
              >
                {this.state.configId && i18n.btnEdit}
                {!this.state.configId && i18n.btnSave}
              </Button>
            )}
          </Form>
        )}
      </React.Fragment>
    )
  }

  render() {
    if (this.props.isDrawer) {
      return this.renderContent()
    }
    return (
      <div>
        <PageContainer
          {...this.props.wrapperProps}
          backgroundColor={'#fafbfb'}
        />
        <Breadcrumb items={['configNew']} />
        {this.renderContent()}
      </div>
    )
  }
}

import React from 'react'
import {
  Checkbox,
  Form,
  Button,
  Tabs,
  Skeleton,
  Row,
  message,
  Collapse,
  Col,
  // Modal
} from 'antd'
import { translate } from 'hoc/create-lang'
import { getStationTypes } from 'api/CategoryApi'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import TableConfig from './TableConfig.js'
import { getConfigQAQC, postConfigQAQC, putConfigQAQC } from 'api/CategoryApi'
import Disconnection from 'components/elements/disconnection'
import { Clearfix } from 'components/layouts/styles'
import styled from 'styled-components'

const { TabPane } = Tabs
const { Panel } = Collapse

const PanelStyled = styled(Panel)`
  .ant-collapse-header {
    padding: 0px 16px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`

function i18n() {
  return {
    title: translate('qaqcConfig.basic.title'),
    repeat: translate('qaqcConfig.basic.repeat'),
    useBasicConfig: translate('qaqcConfig.basic.useBasicConfig'),
    removeValues: translate('qaqcConfig.basic.removeValues'),
    beyondMeasuringRange: translate('qaqcConfig.beyondMeasuringRange'),
    deviceError: translate('qaqcConfig.deviceError'),
    deviceCalibration: translate('qaqcConfig.deviceCalibration'),
    btnEdit: translate('addon.save'),
    btnSave: translate('addon.create'),
    btnUpdate: translate('addon.update'),
    disconnectionMessage: translate('network.qaqc.lostConnection'),
    updateSuccess: translate('addon.onSave.update.success'),
    errorRepeat: translate('qaqcConfig.basic.error.repeat'),
  }
}

@connect(state => ({
  isInitLoaded: state.stationAuto.isInitLoaded,
  stationList: state.stationAuto.list,
}))
@Form.create()
export default class ConfigQaqcBasic extends React.Component {
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

  dataTable = []

  _renderDisconnection = () => (
    <Row type="flex" justify="center" align="middle">
      <Disconnection messages={i18n().disconnectionMessage} />
    </Row>
  )

  getRepeatValidateError = () => {
    const { form } = this.props
    const {
      beyondMeasuringRange,
      deviceCalibration,
      deviceError,
      useBasicConfig,
      ...valueStationTypes
    } = form.getFieldsValue()

    const convertArrayErrorToObject = stationTypeKey => (
      baseErrorMeasure,
      [measureKey, valueMeasure]
    ) => {
      return {
        ...baseErrorMeasure,
        [`${stationTypeKey}.${measureKey}.repeat`]: {
          value: valueMeasure.repeat,
          errors: [new Error(i18n().errorRepeat)],
        },
      }
    }

    const repeatValidateError = Object.entries(valueStationTypes).reduce(
      (base, [stationTypeKey, value]) => {
        const valueRepeatMeasureErrors = Object.entries(value)
          .filter(([_, valueMeasure]) => {
            const isInValidValue =
              valueMeasure.repeat !== undefined &&
              (valueMeasure.repeat <= 1 ||
                !Number.isInteger(valueMeasure.repeat))
            return isInValidValue
          })
          .reduce(convertArrayErrorToObject(stationTypeKey), {})

        return { ...base, ...valueRepeatMeasureErrors }
      },
      {}
    )

    return repeatValidateError
  }

  handleSubmit = async () => {
    const { form } = this.props
    const repeatValidateError = this.getRepeatValidateError()
    const [, values] = await Promise.all([
      form.setFields(repeatValidateError),
      form.validateFields(),
    ])
    if (!_.isEmpty(repeatValidateError)) return

    this.setState({ isLoading: true })
    let measureConfig = await this.getData()
    let response = null
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
      message.success(i18n().updateSuccess)
      if (!this.state.configId) {
        this.setState({
          configId: _.get(response, 'data._id', null),
        })
      }
    } else message.error(response.message)

    this.setState({ isLoading: false }, this.props.onCompleted)
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

  getRef = () => this

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
            repeat: data.repeat,
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

  renderButton = () => {
    const { isLoading, configId } = this.state
    return (
      <Button
        loading={isLoading}
        onClick={event => {
          event.stopPropagation()
          this.handleSubmit()
        }}
        type="primary"
      >
        {configId ? i18n().btnUpdate : i18n().btnSave}
      </Button>
    )
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const useBasicConfig = getFieldValue('useBasicConfig')
    return (
      <React.Fragment>
        <Collapse defaultActiveKey="basic">
          <PanelStyled
            header={<div style={{ marginLeft: 2 }}>{i18n().title}</div>}
            key="basic"
            extra={this.renderButton()}
          >
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
                  <React.Fragment>
                    <Row>
                      <Col span={2}>{i18n().removeValues}</Col>
                      <Col span={22}>
                        <Row gutter={12} type="flex">
                          <Col>
                            {getFieldDecorator('beyondMeasuringRange', {
                              valuePropName: 'checked',
                            })(
                              <Checkbox>{i18n().beyondMeasuringRange}</Checkbox>
                            )}
                          </Col>
                          <Col>
                            {getFieldDecorator('deviceError', {
                              valuePropName: 'checked',
                            })(<Checkbox>{i18n().deviceError}</Checkbox>)}
                          </Col>
                          <Col>
                            {getFieldDecorator('deviceCalibration', {
                              valuePropName: 'checked',
                            })(<Checkbox>{i18n().deviceCalibration}</Checkbox>)}
                          </Col>
                        </Row>
                        <Clearfix height={12} />
                        <Col>
                          {getFieldDecorator('useBasicConfig', {
                            valuePropName: 'checked',
                          })(<Checkbox>{i18n().useBasicConfig}</Checkbox>)}
                        </Col>
                      </Col>
                    </Row>
                  </React.Fragment>
                )}
                <div
                  style={{
                    ...(!useBasicConfig && {
                      pointerEvents: 'none',
                      opacity: 0.5,
                    }),
                  }}
                >
                  <Clearfix height={12} />
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
                          repeat: null,
                        }
                      })
                      return (
                        <TabPane
                          forceRender={true}
                          tab={tab.name}
                          key={tab.key}
                        >
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
                </div>
              </Form>
            )}
          </PanelStyled>
        </Collapse>
      </React.Fragment>
    )
  }
}

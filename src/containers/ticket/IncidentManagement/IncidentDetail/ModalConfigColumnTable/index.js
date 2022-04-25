import { Button, Col, Modal, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import ConfigTicket from 'api/ConfigTicket'
import { Clearfix } from 'components/elements'
import Text from 'components/elements/text'
import { translate as t } from 'hoc/create-lang'
import { isEmpty, isNil, get } from 'lodash'
import React, { Component } from 'react'
import { downFileExcel } from 'utils/downFile'
import { getLanguage } from 'utils/localStorage'
import { Fields } from '../../index'
import { i18n, INCIDENT_INFORMATION } from './constants'
import DragDropConfig from './DragDropConfig'

export default class ModalConfigTable extends Component {
  state = {
    columnList: [],
    configList: [],
    loading: false,
  }

  async componentDidMount() {
    const [configs, defaultColumnsExcel] = await Promise.all([
      CalculateApi.getConfigs(),
      ConfigTicket.getConfigTicket(),
    ])

    this.setInitialColumnExcel(configs, defaultColumnsExcel.data)
  }

  setInitialColumnExcel = (configList, configTicket) => {
    const columnListExcel = get(configTicket, 'value.value')

    const configActiveList = configList
      .filter(config => !config.hidden)
      .map(config => {
        return {
          ...config,
          key: config._id,
          checked: true,
        }
      })
    const defaultColumnList = [...INCIDENT_INFORMATION, ...configActiveList]

    if (isEmpty(configTicket)) {
      this.setState({
        configList: configActiveList,
        columnList: defaultColumnList,
      })
      return
    }
    this.handleColumnListExcel(configList, configActiveList, columnListExcel)
  }

  handleColumnListExcel = (configList, configActiveList, columnListExcel) => {
    const objConfigList = configList.reduce((prevConfig, currentConfig) => {
      return { ...prevConfig, [currentConfig._id]: currentConfig }
    }, {})

    const configActiveListFormat = configActiveList.map(config => {
      return {
        ...config,
        checked: false,
      }
    })

    const columnListWithConfigUpdated = columnListExcel.filter(column => {
      const configKey = objConfigList[column.key]

      if (isNil(configKey)) return true
      return !configKey.hidden
    })

    const configListActiveInColumn = columnListWithConfigUpdated.filter(
      column => configActiveList.some(config => config.key === column.key)
    )

    const columnListWithConfigActive = [
      ...columnListWithConfigUpdated,
      ...configActiveListFormat,
    ]

    if (isEmpty(configListActiveInColumn) && !isEmpty(configActiveList)) {
      this.setState({
        configList: configActiveList,
        columnList: this.getTranslateColumnList(columnListWithConfigActive),
      })
      return
    }
    this.setState({
      configList: configActiveList,
      columnList: this.getTranslateColumnList(columnListWithConfigUpdated),
    })
  }

  getTranslateColumnList = columnList => {
    const translatedColumnList = columnList.map(column => {
      return {
        ...column,
        name: this.getTranslateColumnName(column),
      }
    })

    return translatedColumnList
  }

  getTranslateColumnName = column => {
    const isColumnNameHasTranslate = !isEmpty(t(`ticket.excel.${column.key}`))
    const columnName = isColumnNameHasTranslate
      ? t(`ticket.excel.${column.key}`)
      : column.name

    return columnName
  }

  onDragEnd = result => {
    const { columnList } = this.state

    if (!result.destination) return

    const newColumnList = columnList
    const [reorderedItem] = newColumnList.splice(result.source.index, 1)

    newColumnList.splice(result.destination.index, 0, reorderedItem)

    this.setState({ columnList: newColumnList })
  }

  getTimes = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const from = values[Fields.time][0].format('DDMMYYYY')
    const to = values[Fields.time][1].format('DDMMYYYY')

    return { from, to }
  }

  handleExportExcel = async () => {
    const { columnList } = this.state
    const { form, params, onClose } = this.props
    const { from, to } = this.getTimes()

    const columnListFormat = columnList.map(column => {
      return {
        ...column,
        checked: form.getFieldValue('selectedList')[column.key],
      }
    })

    const selectedColumnKeyList = columnListFormat
      .filter(column => column.checked)
      .map(column => column.key)

    this.setState({ loading: true })

    try {
      await ConfigTicket.updateConfigTicket({
        key: 'ticket-export-params',
        value: columnListFormat,
      })

      const excelResult = await CalculateApi.exportTicket({
        ...params,
        lang: getLanguage(),
        columns: ['order'].concat(selectedColumnKeyList).join(','),
      })

      this.setState({ loading: false })
      onClose()

      downFileExcel(
        excelResult.data,
        `${t('ticket.title.incident.report')}${from}_${to}`
      )
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  render() {
    const { visible, onCancel, form } = this.props
    const { columnList, loading } = this.state

    return (
      <Modal
        title={i18n().title}
        centered
        width={700}
        closable
        visible={visible}
        onCancel={onCancel}
        footer={false}
      >
        <Text fontWeight={600} color="#111827">
          {i18n().description}
        </Text>

        <Clearfix height={12} />

        <DragDropConfig
          onDragEnd={this.onDragEnd}
          form={form}
          columnList={columnList}
        />

        <Clearfix height={24} />

        <Row type="flex" gutter={16} justify="end">
          <Col>
            <Button
              onClick={onCancel}
              style={{ color: '#1890FF', background: '#E1EDFB' }}
            >
              {i18n().button.cancel}
            </Button>
          </Col>
          <Col>
            <Button
              onClick={this.handleExportExcel}
              type="primary"
              loading={loading}
            >
              {i18n().button.download}
            </Button>
          </Col>
        </Row>
      </Modal>
    )
  }
}

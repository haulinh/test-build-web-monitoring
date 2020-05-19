import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Icon, Collapse, Checkbox } from 'antd'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import _ from 'lodash'
import { translate } from 'hoc/create-lang'

import StationAutoApi from 'api/StationAuto'

import FormAddCamera from './formAddCamera'

const { Panel } = Collapse

const i18n = {
  addButton: 'Add',
  saveButton: 'Save',
  cameraName: 'Name',
  cameraURL: 'Link RTSP',
  confirmDelCamera: translate('stationAutoManager.delete.require'),
  inputNotEmpty: 'Please input your note!',
  emptyCamera: 'Khong co camera nao!!',
  successSubmit: 'Luu cau hinh camera thanh cong',
  errorSubmit: 'Co loi khi save cau hinh camera'
}

@Form.create()
@autobind
export default class MyCollapse extends React.Component {
  static propTypes = {
    record: PropTypes.object.isRequired,
    selectAll: PropTypes.bool.isRequired
  }

  static defaultProps = {
    record: {
      stations: []
    },
    selectAll: false
  }

  render() {
    const { record } = this.props
    return (
      <Collapse accordion style={{ marginLeft: -35 }} key={record._id}>
        {record.stations.map(station => (
          <Panel
            header={this._renderCollapsePanelHeader(station)}
            key={station._id}
          >
            <FormAddCamera
              stationAuto={station}
              allowed={this.props.form.getFieldValue(`stations.${station._id}`)}
            />
          </Panel>
        ))}
      </Collapse>
    )
  }

  _renderCollapsePanelHeader(station) {
    const { getFieldDecorator } = this.props.form
    const numOfCameras = _.get(station, 'options.camera.list', []).length
    return (
      <Row type="flex" justify="center" align="middle">
        <Col span={8}>{`${station.stt}  ${station.name}`}</Col>
        <Col span={12}>{station.address}</Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          {getFieldDecorator(`stations.${station._id}`, {
            initialValue: _.get(station, 'options.camera.allowed'),
            valuePropName: 'checked'
          })(<Checkbox />)}
        </Col>
        <Col span={1}>
          {numOfCameras} <Icon type="camera" />
        </Col>
      </Row>
    )
  }
}

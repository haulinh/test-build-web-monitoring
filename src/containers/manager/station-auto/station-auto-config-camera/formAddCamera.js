import React from 'react'
import PropTypes from 'prop-types'
import {
  Row,
  Form,
  Button,
  Table,
  Input,
  Icon,
  Popconfirm,
  message,
} from 'antd'
import { autobind } from 'core-decorators'
import _ from 'lodash'
import { translate } from 'hoc/create-lang'
import StationAutoApi from 'api/StationAuto'

const i18n = {
  addButton: translate('addon.add'),
  saveButton: translate('addon.save'),
  cameraName: translate('stationAutoManager.options.name.label'),
  cameraURL: translate('stationAutoManager.options.RTSP.label'),
  confirmDelCamera: translate('stationAutoManager.delete.require'),
  // emptyCamera: 'Khong co camera nao!!',
  successSubmit: translate('addon.onSave.update.success'),
  errorSubmit: translate('addon.onSave.update.error'),
}

@Form.create()
@autobind
export default class FormAddCamera extends React.Component {
  static propTypes = {
    stationAuto: PropTypes.object.isRequired,
    allowed: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {}

  constructor(props) {
    super(props)

    this.state = {
      submitingCameraLinks: false,
      cameras: [],
    }

    this.state.cameras = _.get(
      this.props.stationAuto,
      'options.camera.list',
      []
    )
  }

  render() {
    let { cameras, submitingCameraLinks } = this.state

    if (cameras.length === 0) this._addEmptyRow()

    return (
      <Row>
        {/* ADD BUTTON */}
        <Row style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this._addEmptyRow}>
            {i18n.addButton}
          </Button>
        </Row>
        {/* TABLE && SAVE_BUTTON */}
        <Row>
          <Table
            pagination={false}
            columns={this._getColumns()}
            dataSource={cameras}
          />
          <Button
            block
            type="primary"
            loading={submitingCameraLinks}
            onClick={this._submitCameras}
          >
            {i18n.saveButton}
          </Button>
        </Row>
      </Row>
    )
  }

  // TODO
  _getColumns() {
    return [
      /* CAMERA NAME */
      {
        title: i18n.cameraName,
        render: (text, record, index) => {
          return (
            <div>
              {this.props.form.getFieldDecorator(`${index}.name`, {
                initialValue: record.name,
              })(<Input />)}
            </div>
          )
        },
      },
      /* LINK RTSP */
      {
        title: i18n.cameraURL,
        render: (text, record, index) => {
          return (
            <div>
              {this.props.form.getFieldDecorator(`${index}.rtspUrl`, {
                initialValue: record.rtspUrl,
              })(<Input />)}
            </div>
          )
        },
      },
      /* ACTIONS */
      {
        title: '',
        width: 50,
        render: (text, record, index) => (
          <Popconfirm
            title={i18n.confirmDelCamera}
            onConfirm={() => this._removeCamera(index)}
          >
            <Icon type="delete" style={{ marginLeft: '5px', color: 'red' }} />
          </Popconfirm>
        ),
      },
    ]
  }

  _addEmptyRow() {
    let cameras = [...this.state.cameras]

    let record = {
      key: Date.now() + cameras.length,
      name: '',
      rtspUrl: '',
    }

    cameras.push(record)
    this.setState({ cameras: cameras })
  }

  _removeCamera(index) {
    let newCameras = [...this.state.cameras]
    newCameras.splice(index, 1)
    this.setState({ cameras: newCameras })
  }

  async _submitCameras() {
    const { getFieldsValue } = this.props.form

    const fieldsValue = getFieldsValue()

    /* remove empty records */
    for (let [k, record] of Object.entries(fieldsValue)) {
      const isEmptyCamera = record.name === ''
      const isEmptyRTSP = record.rtspUrl === ''
      if (isEmptyCamera || isEmptyRTSP) {
        delete fieldsValue[k]
      }
    }

    let stationID = this.props.stationAuto._id
    const submitedCameras = Object.values(fieldsValue)

    this.setState({ submitingCameraLinks: true })

    let submitData = {
      [stationID]: {
        camera: {
          allowed: this.props.allowed,
          list: submitedCameras,
        },
      },
    }

    const res = await StationAutoApi.updateStationAutoOptions(submitData)

    this.setState({ submitingCameraLinks: false })

    if (res.success) {
      this.props.onSubmit(res.data[0])
      return message.success(i18n.successSubmit)
    }

    message.error(i18n.errorSubmit)
  }
}

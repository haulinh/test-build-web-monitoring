import React from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
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
import { v4 as uuidV4 } from 'uuid'

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

  static defaultProps = {
    allowed: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      submittingCameraLinks: false,
      cameras: _.get(this.props.stationAuto, 'options.camera.list', [])
        .filter(camera => !!camera)
        .map(camera => ({
          ...camera,
          key: uuidV4(),
        })),
    }
  }

  componentDidMount() {
    if (!this.state.cameras.length) {
      this._addCamera()
    }
  }

  // TODO
  _getColumns() {
    return [
      /* CAMERA NAME */
      {
        title: i18n.cameraName,
        key: 'title',
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
        key: 'cameraURL',
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
        key: 'conform',
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

  _addCamera = () => {
    const camera = {
      key: uuidV4(),
      name: '',
      rtspUrl: '',
    }
    this.setState(prevState =>
      update(prevState, {
        cameras: {
          $push: [camera],
        },
      })
    )
  }

  _removeCamera(index) {
    this.setState(prevState =>
      update(prevState, {
        cameras: {
          $splice: [[index, 1]],
        },
      })
    )
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
    const submittedCameras = Object.values(fieldsValue)

    this.setState({ submittingCameraLinks: true })

    let submitData = {
      [stationID]: {
        camera: {
          allowed: this.props.allowed,
          list: submittedCameras,
        },
      },
    }

    const res = await StationAutoApi.updateStationAutoOptions(submitData)

    this.setState({ submittingCameraLinks: false })

    if (res.success) {
      this.props.onSubmit(res.data[0])
      return message.success(i18n.successSubmit)
    }

    message.error(i18n.errorSubmit)
  }

  render() {
    let { cameras, submittingCameraLinks } = this.state

    return (
      <Row>
        {/* ADD BUTTON */}
        <Row style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this._addCamera}>
            {i18n.addButton}
          </Button>
        </Row>
        {/* TABLE && SAVE_BUTTON */}
        <Row>
          <Table
            pagination={false}
            columns={this._getColumns()}
            dataSource={cameras}
            rowKey="key"
          />
          <Button
            block
            type="primary"
            loading={submittingCameraLinks}
            onClick={this._submitCameras}
          >
            {i18n.saveButton}
          </Button>
        </Row>
      </Row>
    )
  }
}

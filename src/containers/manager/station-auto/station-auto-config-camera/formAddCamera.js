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
  Modal,
} from 'antd'
import { autobind } from 'core-decorators'
import _ from 'lodash'
import { translate } from 'hoc/create-lang'
// import StationAutoApi from 'api/StationAuto'
import { v4 as uuidV4 } from 'uuid'
import { addCameras } from 'api/CameraApi'
// import swal from 'sweetalert2'

function i18n() {
  return {
    addButton: translate('addon.add'),
    saveButton: translate('addon.save'),
    cameraName: translate('stationAutoManager.options.name.label'),
    cameraURL: translate('stationAutoManager.options.RTSP.label'),
    confirmDelCamera: translate('stationAutoManager.delete.require'),
    // emptyCamera: 'Khong co camera nao!!',
    successSubmit: translate('addon.onSave.update.success'),
    errorSubmit: translate('addon.onSave.update.error'),
    errorNetword: translate('empty.camera.errorNetword'),
    errorUnavailable: translate('empty.camera.errorUnavailable'),
    errorInvalidRtsp: translate('empty.camera.errorInvalidRtsp'),
    timeout: translate('empty.camera.timeout'),
    title: translate('pageInfo.header'),
  }
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
    // console.log("get col")
    return [
      /* CAMERA NAME */
      {
        title: i18n().cameraName,
        key: 'title',
        render: (text, record, index) => {
          return (
            <Form.Item>
              {this.props.form.getFieldDecorator(`${index}.name`, {
                rules: [
                  {
                    required: true,
                    message: translate('rules.requiredName'),
                  },
                ],
                initialValue: record.name,
              })(<Input />)}
            </Form.Item>
          )
        },
      },
      /* LINK RTSP */
      {
        title: i18n().cameraURL,
        key: 'cameraURL',
        render: (text, record, index) => {
          return (
            <Form.Item>
              {this.props.form.getFieldDecorator(`${index}.rtspUrl`, {
                rules: [
                  {
                    required: true,
                    message: translate('rules.requiredRtsp'),
                  },
                ],
                initialValue: record.rtspUrl,
              })(<Input />)}
            </Form.Item>
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
            title={i18n().confirmDelCamera}
            onConfirm={() => this._removeCamera(index)}
          >
            <Icon type="delete" style={{ marginLeft: '5px', color: 'red' }} />
          </Popconfirm>
        ),
      },
    ]
  }

  _addCamera = () => {
    // console.log('_addCamera')
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
    // console.log('_removeCamera')
    this.setState(prevState =>
      update(prevState, {
        cameras: {
          $splice: [[index, 1]],
        },
      })
    )
  }

  setNumOfCameras = quantityCamera => {
    this.props.refHeader.current.setNumOfCameras(quantityCamera)
  }

  async _submitCameras() {
    // return console.log('==submit camera')
    await this.props.form.validateFields()

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

    // let submitData = {
    //   [stationID]: {
    //     camera: {
    //       allowed: this.props.allowed,
    //       list: submittedCameras,
    //     },
    //   },
    // }
    try {
      const res = await addCameras(stationID, submittedCameras)
      this.setState({ submittingCameraLinks: false })

      if (res.success) {
        this.props.onSubmit(res.data[0])
        const quantityCamera = Object.keys(fieldsValue).length
        this.setNumOfCameras(quantityCamera)
        return message.success(i18n().successSubmit)
      }

      message.error(i18n().errorSubmit)
    } catch (error) {
      console.log('======error in FormAddCamera => _submitCameras=======start')
      console.log(error)
      console.log('======error in FormAddCamera => _submitCameras=========end')

      // const errStt = _.get(error, 'response.status', 503)
      // const errMess = _.get(error, 'response.data.message', error.message)
      const errCode = _.get(error, 'response.data.code', '')
      this.setState({
        submittingCameraLinks: false,
      })
      let errMess = ''
      switch (errCode) {
        case 'NETWORK_ERROR': {
          errMess = i18n().errorNetword
          break
        }
        case 'SERVICE_UNAVAILABLE': {
          errMess = i18n().errorUnavailable
          break
        }
        case 'INVALID_RTS': {
          errMess = i18n().errorInvalidRtsp
          break
        }
        case 'TIMEOUT_ERROR': {
          errMess = i18n().timeout
          break
        }
        default: {
          errMess = i18n().errorUnavailable
          break
        }
      }
      Modal.warn({
        title: i18n().title,
        content: errMess,
      })
      // swal(errCode, errMess, 'error')
    }
  }

  render() {
    let { cameras, submittingCameraLinks } = this.state

    return (
      <Row>
        {/* ADD BUTTON */}
        <Row style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this._addCamera}>
            {i18n().addButton}
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
            {i18n().saveButton}
          </Button>
        </Row>
      </Row>
    )
  }
}

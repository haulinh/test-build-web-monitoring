import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Button, Table, Input, Icon, Popconfirm, message} from 'antd'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import _ from 'lodash'
import camera from 'containers/camera'
import { translate } from 'hoc/create-lang'
import { rootCertificates } from 'tls'
import StationAutoApi from 'api/StationAuto'
// import PageContainer from 'layout/default-sidebar-layout/PageContainer'
// import createManagerList from 'hoc/manager-list'
// import createManagerDelete from 'hoc/manager-delete'
// import createLanguageHoc from 'hoc/create-lang'
// import protectRole from 'hoc/protect-role'
// import { translate } from 'hoc/create-lang'
// import { mapPropsToFields } from 'utils/form'
// import StationAutoSearchForm from '../station-auto-search.1'
// import Breadcrumb from '../breadcrumb'
// import ROLE from 'constants/role'
// import { SAMPLING_CONFIG_TABLE_COLUMN } from 'constants/labels'
// import swal from 'sweetalert2'

// import DynamicTable from 'components/elements/dynamic-table'
// import { resetAllCounts } from 'redux/actions/notification'


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
export default class FormAddCamera extends React.Component {
    static propTypes = {
        stationAuto: PropTypes.object.isRequired
    }

    static defaultProps = { }

    constructor(props) {
        super(props)
        
        this.state = {
            submitingCameraLinks: false,
            submitingCameraAllow: false,
            cameras: [],
        }

        this.state.cameras = _.get(this.props.stationAuto, 'options.camera.list', [])
    }

    render() {
        let {cameras, submitingCameraAllow, submitingCameraLinks} = this.state

        return (
            <Row>
                {/* ADD BUTTON */}
                <Row style={{marginBottom: 16}}>
                    <Button type="primary" onClick={this._addEmptyRow}>{i18n.addButton}</Button>
                </Row>
                {/* TABLE && SAVE_BUTTON */}
                <Row>
                    <Table
                        pagination={false}
                        columns={this._getColumns()}
                        dataSource={cameras}
                    />
                    <Button block type="primary" loading={submitingCameraLinks} onClick={this._submitCameras}>{i18n.saveButton}</Button>
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
                            {this.props.form.getFieldDecorator(`${record.key}.name`, {
                                initialValue: record.name,
                                rules: [{required: true, message: i18n.inputNotEmpty}]
                            })(
                                <Input />
                            )}
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
                            {this.props.form.getFieldDecorator(`${record.key}.rtspUrl`, {
                                initialValue: record.rtspUrl,
                                rules: [{required: true, message: i18n.inputNotEmpty}]
                            })(
                                <Input />
                            )}
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
                        <Icon
                            type="delete"
                            style={{ marginLeft: '5px', color: 'red' }}
                        />
                    </Popconfirm>
                ),
            },
        ]
    }

    _addEmptyRow() {
        let cameras = [...this.state.cameras]

        let record = {
            key: Date.now() + cameras.length,
            name: "",
            rtspUrl: ''
        }

        cameras.push(record)
        this.setState({cameras: cameras})
    }

    _removeCamera(index) {
        let cameras = [...this.state.cameras]
        cameras.splice(index, 1)
        console.log(index)
        this.setState({cameras})
    }

    async _submitCameras() {
        const { getFieldsValue } = this.props.form

        const fieldsValue = getFieldsValue()

        /* remove empty records */
        const { cameras } = this.state
        for (let [k, record] of Object.entries(fieldsValue)) {
            const isEmptyCamera = record.name === ""
            const isEmptyRTSP = record.rtspUrl === ""
            if (isEmptyCamera || isEmptyRTSP) {
                delete fieldsValue[k]
            }
        }

        let stationID = this.props.stationAuto._id
        const submitedCameras = Object.values(fieldsValue)

        if (submitedCameras.length === 0) {
            return message.warning(i18n.emptyCamera)
        }

        this.setState({submitingCameraLinks: true})

        let submitData = {
            [stationID]: {
                camera: {
                    list: submitedCameras
                }
            }
        }

        const res = await StationAutoApi.updateStationAutoOptions(submitData)

        this.setState({submitingCameraLinks: false})

        if (res.success) {
            return message.success(i18n.successSubmit)
        }
        
        message.error(i18n.errorSubmit)
    }
}
import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Button, Table, Checkbox, Collapse} from 'antd'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import _ from 'lodash'
import camera from 'containers/camera'
// import StationAutoApi from 'api/StationAuto'
// import { updateStationAutoOptions } from 'api/StationAuto'
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
    cameraURL: 'Link RTSP'
}

@Form.create()
@autobind
export default class FormAddCamera extends React.Component {
    static propTypes = {
        stationAuto: PropTypes.object.isRequired
    }

    static defaultProps = { }

    render() {
        let cameras = _.get(this.props.stationAuto, 'options.camera.list', [])

        return (
            <Row>
                {/* ADD BUTTON */}
                <Row>
                    <Button type="primary" onClick={this._addEmptyRow}>{i18n.addButton}</Button>
                </Row>

                {/* chỉ show table khi có tối thiểu 1 camera */}
                { cameras.length !== 0 && (
                    <Row>
                        {/* TABLE */}
                        <Table
                            columns={this._getColumns()}
                            dataSource={cameras}
                        />

                        {/* SAVE BUTTON */}
                        <Row><Button block type="primary">{i18n.saveButton}</Button></Row>
                    </Row>
                )}
            </Row>
        )
    }

    // TODO
    _getColumns() {
        return [
            {
                title: i18n.cameraName,
                render: (text, record, index) => <strong>{record.name}</strong>,
            },
            {
                title: i18n.cameraURL,
                render: (text, record, index) => <strong>{record.rtspUrl}</strong>,
            },
            {
                title: '',
                render: (text, record, index) => <strong>Delete</strong>,
            },
        ]
    }
}
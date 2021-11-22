import { Col, Row, Switch, Button, Icon } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import { Clearfix } from 'components/layouts/styles'
import React from 'react'
import styled from 'styled-components'
import TableConditionFilter from './TableConditionFilter'
import { ModalConfirmDelete } from 'containers/qa-qc/config/ConfigQaqcAdvanced/components'
import ModalConditionFilter from './ModalConditionFilter'

const ColSwitch = styled(Col)`
  .ant-form-item .ant-switch {
    margin: 20px 0 4px;
  }
`
export const FIELDS = {
    FILTER_NAME: 'filterName',
    STATION_TYPE: 'stationType',
    STATION: 'station',
}

class FilterConditionContainer extends React.Component {
    state = {
        stationKey: '',
        isShowModal: false,
        showConfirmDelete: false,
    }

    showModal = () => {
        this.setState({
            isShowModal: true,
        })
    }

    showConfirmDelete = () => {
        this.setState({
            showConfirmDelete: true,
        })
    }

    onCancelDelete = () => {
        this.setState({
            showConfirmDelete: false,
        })
    }

    onCancelModal = () => {
        this.setState({
            isShowModal: false,
        })
    }

    onChangeStationAuto = stationKey => {
        this.setState({
            stationKey,
        })
    }

    handleDataChange = hasData => {
        this.setState({
            hasData,
        })
    }

    render() {
        const { stationKey, isShowModal, showConfirmDelete } = this.state
        return (
            <React.Fragment>
                <Row type="flex" justify="space-between">
                    <Col span={6}>
                        <SelectStationAuto
                            onChange={this.onChangeStationAuto}
                            placeholder="Trạm quan trắc"
                            value={stationKey}
                        />
                    </Col>
                    <Col span={6}>
                        <Row type="flex" justify="end" align="middle">
                            <ColSwitch>
                                <div style={{ marginRight: '10px' }}>
                                    <Switch defaultChecked />
                                </div>
                            </ColSwitch>
                            <Col>
                                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                    Bộ lọc điều kiện giá trị
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Clearfix height={12} />
                <TableConditionFilter
                    editRecord={this.showModal}
                    deleteRecord={this.showConfirmDelete}
                    footer={() => (
                        <div onClick={this.showModal}>
                            <Row type="flex">
                                <div style={{ marginRight: '10px' }}>
                                    <Icon type="plus" style={{ color: '#1890FF' }} />
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: '500', color: '#1890FF' }}>
                                    Thêm điều kiện lọc
                                </div>
                            </Row>
                        </div>
                    )}
                />
                <ModalConditionFilter
                    visible={isShowModal}
                    onCancel={this.onCancelModal}
                    showConfirmDelete={this.showConfirmDelete}
                />
                <ModalConfirmDelete
                    visible={showConfirmDelete}
                    closable={false}
                    footer={false}
                    onCancelDelete={this.onCancelDelete}
                />

            </React.Fragment>
        )
    }
}

export default FilterConditionContainer

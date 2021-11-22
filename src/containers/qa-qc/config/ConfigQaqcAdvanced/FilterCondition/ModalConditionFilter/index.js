import { Col, Form, Icon, Input, Row, Select, Table, Modal, Button } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import React from 'react'
import { ModalConfirmDelete } from 'containers/qa-qc/config/ConfigQaqcAdvanced/components'
import { FIELDS } from '../index'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import FormTableMeasureCondition from './FormTableMeasureCondition'

const dataSource = [
    {
        key: '01',
        conditionName: 'Flow tăng cao',
        station: 'Trạm A',
        conditionMeasure: 'Flow = 0',
        measure: 'pH, No2, TSS',
    },
    {
        key: '02',
        station: 'Trạm A',
        conditionMeasure: 'Flow = 0',
        conditionName: 'pH, No2',
        measure: 'pH, No2, TSS',
    },
    {
        key: '03',
        conditionName: 'pH, No2',
        conditionMeasure: 'Flow = 0',
        station: 'Trạm A',
        measure: 'pH, No2, TSS',
    },
]

let id = 0

@Form.create()
class ModalConditionFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            isDeleteVisible: false,
            measures: [],
        }
    }
    add = () => {
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(id++)
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        })
    }

    remove = k => {
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('keys')
        // We need at least one passenger
        if (keys.length === 1) {
            return
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        })
    }



    getMeasuringList = () => {
        const { form } = this.props
        const stationAutoValue = form.getFieldValue(FIELDS.STATION_AUTO)

        if (!stationAutoValue) return []

        const stationAutoList = this.state.stationAutos.filter(stationAuto =>
            stationAutoValue.includes(stationAuto.key)
        )
        const measureList = getMeasuringListFromStationAutos(stationAutoList)
        return measureList
    }


    render() {
        const { form } = this.props

        const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
        const measureList = this.getMeasuringList()

        return (
            <Modal
                title="Thêm điều kiện bộ lọc mới"
                {...this.props}
                centered
                width={1060}
                footer={[
                    <Row type="flex" justify="space-between">
                        <Col span={3}>
                            <Button key="back" type="danger">
                                Xóa bộ lọc
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Row type="flex">
                                <Button key="back">Nhập lại</Button>
                                <Button key="submit" type="primary">
                                    Cập nhật
                                </Button>
                            </Row>
                        </Col>
                    </Row>,
                ]}
            >
                <Row gutter={12}>
                    <Col span={8}>
                        <Form.Item label="Tên bộ lọc">
                            {form.getFieldDecorator(FIELDS.FILTER_NAME, {
                                initialValue: 'Tên bộ lọc',
                                rules: [
                                    {
                                        required: true,
                                        message: '',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Loại trạm">
                            {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                                onChange: this.onChangeStationType,
                                rules: [
                                    {
                                        required: true,
                                        message: '',
                                    },
                                ],
                            })(<SelectStationType placeholder="Chọn loại trạm" />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Trạm quan trắc">
                            {form.getFieldDecorator(FIELDS.STATION, {
                                rules: [
                                    {
                                        required: true,
                                        message: '',
                                    },
                                ],
                            })(
                                <SelectStationAuto
                                    placeholder="Chọn trạm quan trắc"
                                    stationType={stationType}
                                    onFetchSuccess={this.onStationAutosFetchSuccess}
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <FormTableMeasureCondition form={form} measureList={measureList} />
                    {/* <Table
              columns={this.columns}
              dataSource={dataSource}
              pagination={false}
              bordered
              footer={() => (
                <div onClick={this.add}>
                  <Row type="flex">
                    <div style={{ marginRight: '10px' }}>
                      <Icon type="plus" style={{ color: '#1890FF' }} />
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#1890FF',
                      }}
                    >
                      Thêm điều kiện lọc
                    </div>
                  </Row>
                </div>
              )}
            />
            <ModalConfirmDelete isVisible={this.state.isDeleteVisible} /> */}
                </Row>
            </Modal>
        )
    }
}

export default ModalConditionFilter

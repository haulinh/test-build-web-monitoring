import React, { Component } from 'react'
import { Modal as ModalAnt, Form, Radio, Row, Col } from 'antd'
import { FormItem } from 'components/layouts/styles'
import { FIELDS } from '../constants'
import styled from 'styled-components'
import SelectStationType from 'components/elements/select-station-type'

const Modal = styled(ModalAnt)`
  .ant-modal-body {
    padding: 12px 24px;
  }
`
@Form.create()
export default class ModalDownloadFile extends Component {
  onOk = () => {
    const { form } = this.props

    const value = form.getFieldsValue()

    console.log({ value })
  }

  onChangeStationType = stationKey => {
    console.log({ stationKey })
  }

  onFetchSuccess = value => {
    console.log({ value })
  }

  render() {
    const { visible, onCancel, form } = this.props

    return (
      <Modal
        title="Thiết lập mẫu Báo cáo tải xuống"
        centered
        width={700}
        closable
        onCancel={onCancel}
        cancelText="Hủy"
        okText="Tải xuống"
        visible={visible}
        onOk={this.onOk}
      >
        <FormItem label="Chọn loại báo cáo">
          {form.getFieldDecorator(FIELDS.TYPE_REPORT, {
            initialValue: 'simple',
            valuePropsName: 'checked',
          })(
            <Radio.Group>
              <Row type="flex" justify="space-between" gutter={20}>
                <Col span={12}>
                  <Radio value="simple">Mẫu đơn giản</Radio>
                  <div style={{ marginTop: '8px', color: '#A2A7B3' }}>
                    Phù hợp với nhu cầu sử dụng nhập nhanh dữ liệu lên hệ thống
                    với các trường thông tin cơ bản.
                  </div>
                </Col>
                <Col span={12}>
                  <Radio value="detail">Mẫu chi tiết</Radio>
                  <div style={{ marginTop: '8px', color: '#A2A7B3' }}>
                    Phù hợp với nhu cầu sử dụng nhập chi tiết dữ liệu lên hệ
                    thống với các trường thông tin chi tiết.
                  </div>
                </Col>
              </Row>
            </Radio.Group>
          )}

          <Row>
            <Col span={12}>
              <FormItem label="Loại trạm">
                {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                  onChange: this.onChangeStationType,
                })(
                  <SelectStationType
                    fieldValue="key"
                    placeholder="Chọn loại trạm"
                    onFetchSuccess={this.onFetchSuccess}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      </Modal>
    )
  }
}

import { Col, Input, Modal, Radio, Row } from 'antd'
import { Clearfix, FormItem } from 'components/layouts/styles'
import React from 'react'
import { ACTION_TYPE, FIELDS } from './constants'

export const ModalSaveFilter = ({
  onCancel,
  form,
  onSubmitSaveFilter,
  filterName,
  isUpdate,
  ...otherProps
}) => {
  return (
    <Modal
      title="Lưu bộ lọc"
      closable
      onCancel={onCancel}
      {...otherProps}
      width={600}
      onOk={onSubmitSaveFilter}
    >
      Dữ liệu chọn lọc theo các trường được tạo bởi bạn sẽ được lưu trữ khi bạn
      đặt tên cho bộ lọc này.
      <Clearfix height={20} />
      <FormItem label="Tên bộ lọc">
        {form.getFieldDecorator(FIELDS.FILTER_NAME, {
          initialValue: filterName || undefined,
          rules: [
            { required: true, message: 'Không được để trống' },
            {
              max: 64,
              message: 'Vượt quá 64 kí tự',
            },
            {
              whitespace: true,
              message: 'Không được để trống',
            },
          ],
        })(<Input placeholder="Vui lòng nhập tên bộ lọc" />)}
      </FormItem>
      <Clearfix height={10} />
      {isUpdate &&
        form.getFieldDecorator(FIELDS.ACTION, {
          valuePropsName: 'checked',
          initialValue: ACTION_TYPE.UPDATE,
        })(
          <Radio.Group>
            <Row type="flex" justify="space-between" gutter={20}>
              <Col span={12}>
                <Radio value={ACTION_TYPE.UPDATE}>Cập nhật bộ lọc</Radio>
                <div style={{ marginTop: '8px', color: '#A2A7B3' }}>
                  Cập nhật bộ lọc cũ dựa trên các trường thông tin.
                </div>
              </Col>

              <Col span={12}>
                <Radio value={ACTION_TYPE.CREATE}>Tạo mới bộ lọc</Radio>
                <div style={{ marginTop: '8px', color: '#A2A7B3' }}>
                  Tạo một bộ lọc mới dựa trên các trường thông tin.
                </div>
              </Col>
            </Row>
          </Radio.Group>
        )}
    </Modal>
  )
}

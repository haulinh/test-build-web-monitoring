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
      onOk={onSubmitSaveFilter}
    >
      Dữ liệu chọn lọc theo các trường được tạo bởi bạn sẽ được lưu trữ khi bạn
      đặt tên cho bộ lọc này.
      <Clearfix height={20} />
      <FormItem label="Tên bộ lọc">
        {form.getFieldDecorator(FIELDS.FILTER_NAME, {
          initialValue: filterName || undefined,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập tên báo cáo',
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
              </Col>

              <Col span={12}>
                <Radio value={ACTION_TYPE.CREATE}>Tạo mới bộ lọc</Radio>
              </Col>
            </Row>
          </Radio.Group>
        )}
    </Modal>
  )
}
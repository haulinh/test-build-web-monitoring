import { Col, Input, Modal, Radio, Row } from 'antd'
import { Clearfix, FormItem } from 'components/layouts/styles'
import React from 'react'
import { ACTION_TYPE, FIELDS, i18n } from './constants'

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
      title={i18n().modalFilter.title}
      closable
      onCancel={onCancel}
      {...otherProps}
      okText={i18n().button.saveFilter}
      cancelText={i18n().button.cancel}
      width={600}
      onOk={onSubmitSaveFilter}
    >
      {i18n().modalFilter.desc}
      <Clearfix height={20} />
      <FormItem label={i18n().modalFilter.nameInput.title}>
        {form.getFieldDecorator(FIELDS.FILTER_NAME, {
          initialValue: filterName || undefined,
          rules: [
            {
              required: true,
              message: i18n().modalFilter.nameInput.rules.require,
            },
            {
              max: 64,
              message: i18n().modalFilter.nameInput.rules.max64,
            },
            {
              whitespace: true,
              message: i18n().modalFilter.nameInput.rules.require,
            },
          ],
        })(<Input placeholder={i18n().modalFilter.nameInput.placeholder} />)}
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
                <Radio value={ACTION_TYPE.UPDATE}>
                  {i18n().option.update.title}
                </Radio>
                <div style={{ marginTop: '8px', color: '#A2A7B3' }}>
                  {i18n().option.update.hint}
                </div>
              </Col>

              <Col span={12}>
                <Radio value={ACTION_TYPE.CREATE}>
                  {i18n().option.create.title}
                </Radio>
                <div style={{ marginTop: '8px', color: '#A2A7B3' }}>
                  {i18n().option.create.hint}
                </div>
              </Col>
            </Row>
          </Radio.Group>
        )}
    </Modal>
  )
}

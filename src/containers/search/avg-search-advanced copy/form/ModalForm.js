import React from 'react'
import { Modal, Form, Input } from 'antd'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .ant-form-item-label {
    padding: 0;
  }
`

const Content = styled.div`
  margin-bottom: 24px;
`

@Form.create({ name: 'name_filter' })
export default class ModalForm extends React.Component {
  render() {
    const { visible, confirmLoading, onCancel, onCreate, form } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal
        visible={visible}
        title={translate('avgSearchFrom.filterForm.title')}
        onOk={onCreate}
        okText={translate('addon.save')}
        onCancel={onCancel}
        cancelText={translate('addon.cancel')}
        confirmLoading={confirmLoading}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <FormWrapper>
          <Content>{translate('avgSearchFrom.filterForm.description')}</Content>
          <Form layout="vertical">
            <Form.Item label={translate('avgSearchFrom.filterForm.name.label')}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: translate('avgSearchFrom.filterForm.name.isEmpty'),
                  },
                ],
              })(
                <Input
                  size="large"
                  placeholder={translate(
                    'avgSearchFrom.filterForm.name.placeholder'
                  )}
                />
              )}
            </Form.Item>
          </Form>
        </FormWrapper>
      </Modal>
    )
  }
}

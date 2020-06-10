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
        title="Lưu bộ lọc"
        onOk={onCreate}
        okText={translate('addon.save')}
        onCancel={onCancel}
        cancelText={translate('addon.cancel')}
        confirmLoading={confirmLoading}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <FormWrapper>
          <Content>
            Dữ liệu chọn lọc theo các trường được tạo bởi bạn sẽ được lưu trữ
            khi bạn đặt tên cho bộ lọc này.
          </Content>
          <Form layout="vertical">
            <Form.Item label="Tên bộ lọc">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your name filter!',
                  },
                ],
              })(
                <Input
                  size="large"
                  placeholder="Please input your name filter!"
                />
              )}
            </Form.Item>
          </Form>
        </FormWrapper>
      </Modal>
    )
  }
}

import React, { Component } from 'react'
import { Button, Form } from 'antd'
import styled from 'styled-components'
import FormInfoBasic from './FormInfoBasic'

const FormContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;

  .form-body {
    flex: 1;
    padding: 0 24px;
    overflow: auto;
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    border-top: 1px solid #e8e8e8;
    padding: 24px;
  }

  .row-form {
    display: flex;
    gap: 20px;
  }
`

@Form.create()
export default class FormMonitoring extends Component {
  render() {
    const { form, phases } = this.props
    console.log({ phases })
    return (
      <FormContainer>
        <div className="form-body">
          <FormInfoBasic form={form} phases={phases} />
        </div>
        <div className="form-footer">
          <Button type="link">Nhập lại</Button>
          <Button type="primary">Tạo mới</Button>
        </div>
      </FormContainer>
    )
  }
}

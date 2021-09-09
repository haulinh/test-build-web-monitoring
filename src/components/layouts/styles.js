import { Form } from 'antd'
import styled from 'styled-components'

export const Header = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #3b3b3b;
`

export const BoxShadow = styled.div`
  background: #ffffff;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  padding: 12px;
`

export const FormItem = styled(Form.Item)`
  margin-bottom: 16px;
  font-size: 14;
  font-weight: 600;
  .ant-form-item-label {
    line-height: unset;
    label {
      margin: 0;
    }
  }
`

export const Clearfix = styled.div`
  ${props => (props.height ? `height: ${props.height}px;` : '')};
  ${props => (props.width ? `width: ${props.width}px;` : '')};
`

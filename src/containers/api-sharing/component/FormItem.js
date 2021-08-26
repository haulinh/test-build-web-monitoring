import { Form } from 'antd'
import styled from 'styled-components'

const FormItem = styled(Form.Item)`
  margin-bottom: 16px;
  font-size: 14;
  font-weight: 600;

  .ant-form-item-label {
    line-height: unset;
    label {
      margin: 0;
    }
  }
  .switch-filter {
    display: flex;
    flex-direction: row-reverse;
  }
`
export default FormItem

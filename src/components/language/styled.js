import styled from 'styled-components'
import {Form} from 'antd'

const FormWrapper = styled(Form)`
  .ant-form-item{
    margin-bottom: 12px;
  }
  .ant-form-item-label {
    line-height: unset;
  }
  .ant-form-item-label > label {
    display: flex;
    align-items: center;
  }
`

const FormItem = Form.Item

const FlagLabel = styled.div`
  display: inline-flex;
  align-items: center;
  img {
    margin-right: 8px;
  }
  span {
    display: inline-block;
  }
`

const WarningWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  span {
    font-weight: 600;
  }
  > div {
    margin-top: 10px;
    text-align: center;
  }
`

export {FormWrapper, FormItem, FlagLabel, WarningWrapper}

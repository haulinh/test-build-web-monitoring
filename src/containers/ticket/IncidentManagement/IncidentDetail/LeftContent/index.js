import { Input } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { FormItem } from 'components/layouts/styles'
import { EditWrapper } from 'containers/ticket/Component'
import React from 'react'
import { i18n } from '../../index'
import { Fields } from '../index'
import Attachments from './Attachments'

const LeftContent = ({ form, record, updateTicket }) => {
  const handleUpdateField = fieldName => {
    const value = form.getFieldValue(fieldName)
    return updateTicket({ [fieldName]: value })
  }

  const values = form.getFieldsValue()

  const revertValue = fieldValue => form.setFieldsValue(fieldValue)

  return (
    <React.Fragment>
      <EditWrapper
        value={values[Fields.name]}
        update={() => handleUpdateField(Fields.name)}
        style={{ color: '#262626', fontWeight: 600, fontSize: 20 }}
        prevValue={record[Fields.name]}
        name={Fields.name}
        revertValue={revertValue}
      >
        <FormItem>
          {form.getFieldDecorator(Fields.name, { rules: [{ required: true }] })(
            <Input />
          )}
        </FormItem>
      </EditWrapper>

      <EditWrapper
        value={values[Fields.description]}
        update={() => handleUpdateField(Fields.description)}
        type="textArea"
        title={i18n().description}
        name={Fields.description}
        revertValue={revertValue}
        prevValue={record[Fields.description]}
      >
        <FormItem>
          {form.getFieldDecorator(Fields.description)(<TextArea />)}
        </FormItem>
      </EditWrapper>

      <Attachments />
    </React.Fragment>
  )
}

export default LeftContent

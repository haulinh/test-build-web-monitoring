import { Divider } from 'antd'
import Attachments from 'components/elements/attachments'
import { Clearfix, FormItem } from 'components/layouts/styles'
import { EditWrapper2 } from 'containers/ticket/Component'
import { translate } from 'hoc/create-lang'
import React from 'react'
import { i18n } from '../../index'
import { Fields } from '../index'

const LeftContent = ({ form, record, updateTicket, setName, setUpdatedAt }) => {
  const handleUpdateField = fieldName => {
    const value = form.getFieldValue(fieldName)
    return updateTicket({ [fieldName]: value })
  }

  const values = form.getFieldsValue()

  const handleUpdateName = async () => {
    const values = await form.validateFields()
    if (!values) return false
    handleUpdateField(Fields.name)
    const name = form.getFieldValue(Fields.name)
    setName(name)
    return true
  }

  return (
    <React.Fragment>
      <FormItem>
        {form.getFieldDecorator(Fields.name, {
          rules: [
            {
              required: true,
              message: translate('ticket.required.incident.name'),
            },
            { max: 64, message: translate('rules.max64') },
            {
              whitespace: true,
              message: translate('ticket.required.incident.name'),
            },
          ],
        })(
          <EditWrapper2
            height={40}
            type="input"
            value={values[Fields.name]}
            update={handleUpdateName}
            style={{ color: '#262626', fontWeight: 600, fontSize: 28 }}
            prevValue={record[Fields.name]}
            name={Fields.name}
          ></EditWrapper2>
        )}
      </FormItem>

      <Clearfix height={12} />

      {form.getFieldDecorator(Fields.description)(
        <EditWrapper2
          value={values[Fields.description]}
          update={() => handleUpdateField(Fields.description)}
          type="textArea"
          title={i18n().description}
          name={Fields.description}
          prevValue={record[Fields.description]}
          style={{ overflow: 'scroll', overflowX: 'hidden' }}
        ></EditWrapper2>
      )}

      <Clearfix height={12} />
      <Divider />
      <Attachments type="ticket" setUpdatedAt={setUpdatedAt} />
    </React.Fragment>
  )
}

export default LeftContent

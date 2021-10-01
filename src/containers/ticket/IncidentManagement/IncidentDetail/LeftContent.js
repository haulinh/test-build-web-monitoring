import { Clearfix, Flex } from 'components/layouts/styles'
import { EditWrapper } from 'containers/ticket/Component'
import React from 'react'
import { Fields } from './index'
import { Icon } from 'antd'

export const LeftContent = ({ form, record }) => {
  return (
    <React.Fragment>
      {form.getFieldDecorator(Fields.name)(
        <EditWrapper
          type="input"
          style={{ color: '#262626', fontWeight: 600, fontSize: 20 }}
          prevValue={record[Fields.name]}
        />
      )}

      <Clearfix height={12} />
      {form.getFieldDecorator(Fields.description)(
        <EditWrapper
          type="textArea"
          title="Mô tả"
          prevValue={record[Fields.description]}
        />
      )}

      <Clearfix height={12} />
      <Flex justifyContent="space-between">
        <b>Đính kèm tệp</b>
        <Icon
          type="plus"
          theme="outlined"
          style={{
            fontSize: 18,
            background: '#E6F7FF',
            borderRadius: 4,
            padding: 4,
            color: '#008EFA',
          }}
        />
      </Flex>

      <Clearfix height={12} />
      <b>PDF, Excel, Word, SVG, PNG, JPG</b>
    </React.Fragment>
  )
}

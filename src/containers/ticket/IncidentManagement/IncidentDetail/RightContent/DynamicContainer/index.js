import { Col, Row } from 'antd'
import { Clearfix } from 'components/layouts/styles'
import _ from 'lodash'
import React from 'react'
import { Title } from '..'
import { DynamicComponent } from './DynamicComponent'

export const DynamicContainer = ({
  form,
  categories,
  updateDynamicField,
  record,
}) => {
  return (
    <React.Fragment>
      <Row type="flex" align="top" gutter={[0, 16]}>
        {categories.map(property => (
          <React.Fragment key={property._id}>
            <Col span={12}>
              <Clearfix height={8} />
              <Title>{property.name}</Title>
            </Col>
            <Col span={12}>
              <DynamicComponent
                prevValue={_.get(record, ['categories', property._id])}
                type={property.type}
                form={form}
                name={property._id}
                categories={property.categories}
                updateDynamicField={updateDynamicField}
              />
            </Col>
          </React.Fragment>
        ))}
      </Row>
    </React.Fragment>
  )
}

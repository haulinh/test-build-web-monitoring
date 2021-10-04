import { Col, Row } from 'antd'
import React from 'react'
import { Title } from '../RightContent'
import { DynamicComponent } from './DynamicComponent'

export const DynamicContainer = ({ form, categories }) => {
  return (
    <React.Fragment>
      <Row gutter={[0, 12]}>
        {categories.map(property => (
          <React.Fragment key={property._id}>
            <Col span={12}>
              <Title>{property.name}</Title>
            </Col>
            <Col span={12}>
              <DynamicComponent
                type={property.type}
                form={form}
                name={property._id}
                categories={property.categories}
              />
            </Col>
          </React.Fragment>
        ))}
      </Row>
    </React.Fragment>
  )
}

import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { Col, InputNumber, Icon } from 'antd'
import createLang from 'hoc/create-lang'
import createValidateComponent from 'components/elements/redux-form-validate'
import SelectAnt from 'components/elements/select-ant'
import Clearfix from 'components/elements/clearfix'

const FSelectAnt = createValidateComponent(SelectAnt)
const FInputNumber = createValidateComponent(InputNumber)

const operators = [
  { value: '>', name: '>' },
  { value: '>=', name: '>=' },
  { value: '<', name: '<' },
  { value: '<=', name: '<=' },
  { value: '=', name: '=' },
]

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
`

const CRow = styled.div`
  width: 100%;
`

@createLang
@autobind
export default class ConditionItem extends React.Component {
  static propTypes = {
    measuringList: PropTypes.array,
    handleCreate: PropTypes.func,
    handleDelete: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      isHovering: false,
    }
  }

  handleMouseHover() {
    this.setState({ isHovering: !this.state.isHovering })
  }

  render() {
    const t = this.props.lang.createNameSpace('dataSearchFrom.form')

    const { index } = this.props
    return (
      <div
        onMouseEnter={this.handleMouseHover}
        onMouseLeave={this.handleMouseHover}
      >
        <Flex>
          <CRow justify="center" align="top" gutter={10}>
            <Col span={10}>
              <Field
                label={t('measuringList.label')}
                placeholder={t('measuringList.placeholder')}
                name={`advanced[${index}].measuringKey`}
                size="large"
                showSearch
                options={this.props.measuringList}
                component={FSelectAnt}
                onChange={this.props.handleCreate(index, 'measuringKey')}
              />
            </Col>
            <Col span={10}>
              <Field
                label={t('operator.label')}
                name={`advanced[${index}].operator`}
                size="large"
                showSearch
                options={operators}
                component={FSelectAnt}
                onChange={this.props.handleCreate(index, 'operator')}
              />
            </Col>
            <Col span={4}>
              <Field
                label={t('value.label')}
                name={`advanced[${index}].value`}
                size="large"
                style={{
                  width: '100%',
                }}
                component={FInputNumber}
                onChange={this.props.handleCreate(index, 'value')}
              />
            </Col>
          </CRow>
          {this.state.isHovering ? (
            <Icon
              className="icon-delete"
              type="close-circle"
              style={{
                marginTop: '25px',
                fontSize: '12px',
                width: '12px',
                height: '12px',
              }}
              theme="filled"
              onClick={() => this.props.handleDelete(index)}
            />
          ) : (
            <div style={{ width: '12px', height: '12px' }} />
          )}
        </Flex>
        <Clearfix height={16} />
      </div>
    )
  }
}

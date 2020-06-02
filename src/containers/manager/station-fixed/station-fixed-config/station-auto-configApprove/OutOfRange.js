import React from 'react'
import { Form, Checkbox, InputNumber } from 'antd'
import styled from 'styled-components'
// import * as _ from 'lodash'
import { autobind } from 'core-decorators'
import createLanguageHoc from 'hoc/create-lang'

const FormItem = Form.Item

const Container = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
`

@createLanguageHoc
@autobind
export default class OutOfRange extends React.Component {
  render() {
    return (
      <Container>
        <Checkbox
          checked={this.props.checkedOut}
          name="OUT_RANGE"
          data={this.props.row}
          onChange={this.props.onChangeCheckbox}
        />
        {this.props.checkedOut && (
          <FormItem
            style={{
              marginTop: 0,
              marginBottom: 0,
              marginLeft: 8,
              marginRight: 8,
            }}
          >
            {this.props.getFieldDecorator(`${this.props.row.key}.minRange`, {
              rules: [
                {
                  required: true,
                  message: this.props.lang.t(
                    'stationAutoManager.options.allowApprove.error'
                  ),
                },
              ],
              initialValue: this.props.minRange,
            })(
              <InputNumber
                name="min"
                defaultValue={this.props.minRange}
                onChange={value =>
                  this.props.onChangeValue(this.props.row.key, value, false)
                }
              />
            )}
          </FormItem>
        )}
        {this.props.checkedOut && (
          <FormItem style={{ margin: 0 }}>
            {this.props.getFieldDecorator(`${this.props.row.key}.maxRange`, {
              rules: [
                {
                  required: true,
                  message: this.props.lang.t(
                    'stationAutoManager.options.allowApprove.error'
                  ),
                },
              ],
              initialValue: this.props.maxRange,
            })(
              <InputNumber
                name="max"
                defaultValue={this.props.maxRange}
                onChange={value =>
                  this.props.onChangeValue(this.props.row.key, value, true)
                }
              />
            )}
          </FormItem>
        )}
      </Container>
    )
  }
}

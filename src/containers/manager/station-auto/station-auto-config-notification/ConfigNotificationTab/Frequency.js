import React from 'react'
import { Row, Checkbox, Select, Col } from 'antd'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'

const { Option } = Select
const i18n = {
  repeat: translate('configNotify.repeat'),
  onlyOnce: translate('configNotify.onlyOnce')
}

const optionSelects = [
  // {
  //   title: 'Chỉ 1 lần',
  //   value: 0,
  // },
  {
    title: 'Mỗi 5 phút',
    value: 5,
  },
  {
    title: 'Mỗi 15 phút',
    value: 15,
  },
  {
    title: 'Mỗi 30 phút',
    value: 30,
  },
  {
    title: 'Mỗi tiếng',
    value: 60,
  },
  {
    title: 'Mỗi 2 tiếng',
    value: 120,
  },
  {
    title: 'Mỗi ngày',
    value: 1440,
  },
  {
    title: 'Mỗi 2 ngày',
    value: 2880,
  },
]

const OnyOnceWrapper = styled.div`
color: gray;
font-size: 14px;
margin-left: 1em;
`

const OnLyOnceMessage = ({ content }) => {
  return (
    <OnyOnceWrapper>
      <p style={{
        marginBottom: 0,
        marginLeft: '-8px'
      }}>{content}</p>
    </OnyOnceWrapper>
  )
}

export default class Frequency extends React.Component {
  state = {
    isEnable: this.props.isEnable,
    frequency: this.props.frequency,
  }

  getOption = () => {
    const { frequency } = this.state
    return optionSelects.find(option => option.value === frequency).value
  }

  handleOnChangeCheckBox = e => {
    this.setState({ isEnable: e.target.checked }, () => {
      const frequencyUpdate = {
        _id: this.props._id,
        ...this.state,
      }

      this.props.updateFrequency(frequencyUpdate)
    })
  }

  handleOnChangeSelect = value => {
    this.setState({ frequency: value }, () => {
      const frequencyUpdate = {
        _id: this.props._id,
        ...this.state,
      }

      this.props.updateFrequency(frequencyUpdate)
    })
  }

  render() {

    return (
      <Row>

        <div>

          <Col span={5}>
            <Checkbox
              checked={this.state.isEnable}
              onChange={this.handleOnChangeCheckBox}
            >
              {i18n.repeat}
            </Checkbox>
          </Col>
          <Col span={19}>
            {
              (this.state.frequency === 0 || !this.state.isEnable) && (
                <OnLyOnceMessage content={i18n.onlyOnce} />
              )
            }
            {
              this.state.frequency !== 0 && this.state.isEnable && (
                <Select
                  disabled={
                    !this.state.isEnable || this.props.status === 'COLLECTING'
                  }
                  size="small"
                  defaultValue={this.getOption()}
                  style={{ width: 120 }}
                  onChange={this.handleOnChangeSelect}
                >
                  {optionSelects.map(option => (
                    <Option value={option.value}>{option.title}</Option>
                  ))}
                </Select>
              )
            }

          </Col>

        </div>





      </Row>

    )
  }
}

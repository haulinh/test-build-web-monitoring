import React, { Component } from 'react'
import { Affix, Alert, Button } from 'antd'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'

const Warning = styled.div`
  .ant-alert-info {
    height: ${props => props.height}px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .message {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #2c4bee;
    gap: 12px;
    font-weight: 400;
    .days {
      font-weight: 700;
      color: #e64d3d;
    }
    .ant-btn-primary {
      font-weight: 600;
      padding: 8px 36px;
      height: unset;
    }
  }
`
const Message = ({ days, onClick }) => {
  return (
    <div className="message">
      <div>
        {translate('infoLicense.expireWarning.openWarning')}{' '}
        <span className="days">
          {translate('infoLicense.expireWarning.middleWarning', {
            total: days,
          })}
        </span>{' '}
        {translate('infoLicense.expireWarning.endWarning')}
      </div>
      <Button type="primary" onClick={onClick}>
        {translate('infoLicense.extendLicense')}
      </Button>
    </div>
  )
}

export default class WarningExpiredLicense extends Component {
  render() {
    const { days, onClick, onClose, heightWarning } = this.props

    return (
      <Affix>
        <Warning height={heightWarning}>
          <Alert
            onClose={onClose}
            message={<Message days={days} onClick={onClick} />}
            type="info"
            closable
          />
        </Warning>
      </Affix>
    )
  }
}

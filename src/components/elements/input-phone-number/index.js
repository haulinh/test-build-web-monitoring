import React, { PureComponent } from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import styled from 'styled-components'
import ReactTelephoneInput from 'react-telephone-input/lib/withStyles'

const inputSize = {
  medium: '32px',
  large: '34px',
}

const Wrapper = styled.div`
  display: flex;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  .react-tel-input {
    border-radius: 4px 0 0 4px;
    margin-top: 0;
    display: inline-block;
    background: #eee;
    height: ${props => inputSize[props.size]};
    width: fit-content;
    cursor: pointer;
    input {
      display: none;
    }
    .flag-dropdown {
      display: inline;
      position: relative;
      border: none;

      & .selected-flag,
      &:hover .selected-flag {
        background: #eee;
      }
      .selected-flag {
        cursor: pointer;
        outline: none;
        border: none;
        height: 100%;
      }
    }
  }
`

const PhoneInput = styled(Input)`
  border: none;
  border-radius: 0 4px 4px 0;
  -moz-appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }
  &:focus {
    box-shadow: none;
  }
`

const SelectCountry = styled.div`
  background: #eee;
  display: flex;
  align-items: center;
  width: 115px;
  border-radius: 4px 0 0 4px;
`

const DialCode = styled.span`
  font-weight: 600;
`

const formatPhoneNumber = ({ dialCode = '', format = '', phone = '' }) => {
  const phoneNumber = `${dialCode}${phone.replace(/^0/, '')}`

  let i = 0
  const formattedPhone = format.replace(/\.+/g, strMatch => {
    const str = phoneNumber.slice(i, i + strMatch.length)
    i = i + strMatch.length
    return str
  })

  return `${formattedPhone}${phoneNumber.slice(i, phoneNumber.length)}`
}

const VIETNAME_PHONE = {
  DIAL_CODE: '84',
  FORMAT: '+..-..-....-...',
  PRIORITY:0,
  ISO2:'vn',
  NAME:'Vietnam (Việt Nam)'
}
export default class InputPhoneNumber extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    size: PropTypes.oneOf(['medium', 'large']),
    disabled: PropTypes.bool
  }

  handleTelChange = (_, selectedCountry) => {
    const { onChange } = this.props
    const data = {
      ...selectedCountry,
      phoneNumber: selectedCountry.dialCode,
    }
    onChange(data)
  }

  // DIAL_CODE: '84',
  // FORMAT: '+..-..-....-...',
  // PRIORITY:0,
  // ISO2:'vn',
  // NAME:'Vietnam (Việt Nam)'

  handlePhoneChange = e => {
    const { onChange, value } = this.props
    const valuePhone = (e.target.value || '').replace(/\D/g, '')

    const format = get(value, 'format', VIETNAME_PHONE.FORMAT)
    const dialCode = get(value, 'dialCode', VIETNAME_PHONE.DIAL_CODE)
    const priority = get(value, 'priority', VIETNAME_PHONE.PRIORITY)
    const iso2 = get(value, 'iso2', VIETNAME_PHONE.ISO2)
    const name = get(value, 'name', VIETNAME_PHONE.NAME)

    const phoneNumber = formatPhoneNumber({
      format,
      dialCode,
      phone: valuePhone,
    })
    if (format && format.length < phoneNumber.length) return

    onChange({
      ...value,
      format,
      dialCode,
      phoneNumber,
      priority,
      iso2,
      name,
      phoneString: valuePhone,
    })
  }


  render() {
    const { placeholder, autoFocus, value, size } = this.props
    const dialCode = get(value, 'dialCode', VIETNAME_PHONE.DIAL_CODE)
    const phoneNumber = get(value, 'phoneNumber', '')
    let phoneString = get(value, 'phoneString', null)
    if (phoneString === null) {
      phoneString = phoneNumber
        .replaceAll('-', '')
        .replace(dialCode, '')
        .replace('+', '0')
    }

    return (
      <Wrapper size={size}>
        <SelectCountry>
          <ReactTelephoneInput
            defaultCountry={VIETNAME_PHONE.ISO2}
            flagsImagePath="/images/flags.png"
            onChange={this.handleTelChange}
            value={`${dialCode}${phoneNumber}`}
            disabled={this.props.disabled}
          />
          <DialCode>+{dialCode}</DialCode>
        </SelectCountry>
        <PhoneInput
          size={size}
          value={phoneString}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChange={this.handlePhoneChange}
          disabled={this.props.disabled}
        />
      </Wrapper>
    )
  }
}

InputPhoneNumber.defaultProps = {
  size: 'large',
}

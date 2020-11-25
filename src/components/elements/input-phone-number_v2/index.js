import React, { PureComponent } from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactTelephoneInput from 'react-telephone-input'

const Wrapper = styled.div`
  display: flex;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  .react-tel-input {
    border-radius: 4px 0 0 4px;
    margin-top: 0;
    display: inline-block;
    background: #eee;
    height: 40px;
    width: fit-content;
    padding: 0 5px;
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
`

const DialCode = styled.span`
  font-weight: 600;
`

const formatPhoneNumber = (format = '', phone = '') => {
  let i = 0
  return format.replace(/\.+/g, strMatch => {
    const str = phone.slice(i, i + strMatch.length)
    i = i + strMatch.length
    return str
  })
}

export default class InputPhoneNumber extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
  }

  state = {
    selectedCountry: {
      dialCode: 84,
      format: '+..-..-....-...',
    },
  }

  handleTelChange = (_, selectedCountry) => {
    const { onChange } = this.props
    const data = {
      phoneNumber: '',
      ...selectedCountry,
    }
    this.setState({ selectedCountry })
    onChange(data)
  }

  getRealPhoneNumber = (inputValue = '', dialCode = '84') => {
    const regxPatt = `^(\\+${dialCode}|${dialCode}|0*)`
    const regex = new RegExp(regxPatt)
    return inputValue.replace(regex, '').replace(/\D/g, '')
  }

  handlePhoneChange = e => {
    const { onChange } = this.props
    const { selectedCountry } = this.state
    const inputValue = e.target.value
    let phoneNumber = this.getRealPhoneNumber(
      inputValue,
      selectedCountry.dialCode
    )
    phoneNumber = formatPhoneNumber(
      selectedCountry.format,
      `${selectedCountry.dialCode}${phoneNumber}`
    )
    const data = {
      ...selectedCountry,
      phoneNumber,
    }
    onChange(data)
  }

  render() {
    const { selectedCountry } = this.state
    const { value: { phoneNumber } = {} } = this.props

    return (
      <Wrapper>
        <SelectCountry>
          <ReactTelephoneInput
            defaultCountry={'vn'}
            flagsImagePath="/images/flags.png"
            onChange={this.handleTelChange}
          />
          <DialCode>+{selectedCountry.dialCode}</DialCode>
        </SelectCountry>
        <PhoneInput
          size="large"
          autoFocus
          type="number"
          value={this.getRealPhoneNumber(phoneNumber, selectedCountry.dialCode)}
          onChange={this.handlePhoneChange}
          min="1"
        />
      </Wrapper>
    )
  }
}

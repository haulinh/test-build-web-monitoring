import React, { createRef, PureComponent } from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactTelephoneInput from 'react-telephone-input/lib/withStyles'

const Wrapper = styled.div`
  display: flex;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  .react-tel-input {
    border-radius: 4px 0 0 4px;
    margin-top: 0;
    display: inline-block;
    background: #eee;
    height: ${props => (props.size === 'medium' ? '32px' : '40px')};
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
    placeholder: PropTypes.string,
    size: PropTypes.string,
    autoFocus: PropTypes.bool,
  }

  constructor() {
    super()
    this.ref = createRef()

    this.state = {
      selectedCountry: {
        dialCode: 84,
        format: '+..-..-....-...',
      },
    }
    document.addEventListener('update', this.updateCountryCode)
  }

  static getDerivedStateFromProps(nextProps) {
    if (typeof nextProps.value === 'string') {
      document.dispatchEvent(new CustomEvent('update'))
    }
  }

  updateCountryCode = () => {
    setTimeout(() => {
      const { value, onChange } = this.props
      if (typeof value === 'string') {
        const selectedCountry = this.ref.__wrappedInstance.state.selectedCountry
        onChange({ phoneNumber: value, ...selectedCountry })
        this.setState({ selectedCountry })
      }
    }, 0)
  }

  handleTelChange = (_, selectedCountry) => {
    console.log('handleTelChange', selectedCountry)
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

  setRef = inputRef => {
    this.ref = inputRef
  }

  render() {
    const { selectedCountry } = this.state
    const { placeholder, autoFocus, value, size } = this.props
    const phoneNumber =
      typeof value === 'string' ? value : (value || {}).phoneNumber

    return (
      <Wrapper size={size}>
        <SelectCountry>
          <ReactTelephoneInput
            ref={this.setRef}
            defaultCountry={'vn'}
            flagsImagePath="/images/flags.png"
            onChange={this.handleTelChange}
            value={phoneNumber}
          />
          <DialCode>+{selectedCountry.dialCode}</DialCode>
        </SelectCountry>
        <PhoneInput
          size={size || 'large'}
          autoFocus={autoFocus}
          min="1"
          type="number"
          placeholder={placeholder}
          onChange={this.handlePhoneChange}
          value={this.getRealPhoneNumber(phoneNumber, selectedCountry.dialCode)}
        />
      </Wrapper>
    )
  }
}

import React, { createRef, PureComponent } from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import omit from 'lodash/omit'
import styled from 'styled-components'
import ReactTelephoneInput from 'react-telephone-input/lib/withStyles'

const inputSize = {
  medium: '32px',
  large: '40px',
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

const getRealPhoneNumber = ({ phone = '', dialCode = '' }) => {
  const regxPatt = `^(\\+${dialCode}|${dialCode}|0*)`
  const regex = new RegExp(regxPatt)
  return phone.replace(regex, '').replace(/\D/g, '')
}

const INIT_EVENT = 'formatPhoneNumberFromDefaultValue'

const VIETNAME_PHONE = {
  DIAL_CODE: '84',
  FORMAT: '+..-..-....-...',
}
export default class InputPhoneNumber extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    size: PropTypes.oneOf(['medium', 'large']),
  }

  constructor() {
    super()
    this.ref = createRef()
    this.state = {}
    document.addEventListener(
      INIT_EVENT,
      this.formatPhoneNumberFromDefaultValue
    )
  }

  static getDerivedStateFromProps(nextProps) {
    const value = get(nextProps, 'value')
    if (value && !value.formattedPhone) {
      document.dispatchEvent(new CustomEvent(INIT_EVENT))
    }
    return null
  }

  formatPhoneNumberFromDefaultValue = () => {
    if (!this.ref) return
    setTimeout(() => {
      const { value, onChange } = this.props
      let selectedCountry = {}
      let phone = ''

      if (value && typeof value === 'object') {
        phone = value.phoneNumber
        selectedCountry = omit(value, 'phoneNumber')
      }

      if (typeof value === 'string') {
        phone = value
        selectedCountry = this.ref.__wrappedInstance.state.selectedCountry
      }

      const phoneNumber = getRealPhoneNumber({
        phone,
        dialCode: selectedCountry.dialCode,
      })
      const formattedPhone = formatPhoneNumber({
        phone: phoneNumber,
        dialCode: selectedCountry.dialCode,
        format: selectedCountry.format,
      })

      onChange({ ...selectedCountry, phoneNumber, formattedPhone })
    }, 0)
  }

  handleTelChange = (_, selectedCountry) => {
    const { onChange } = this.props
    const data = {
      ...selectedCountry,
      phoneNumber: '',
      formattedPhone: selectedCountry.dialCode,
    }
    onChange(data)
  }

  handlePhoneChange = e => {
    const { onChange, value } = this.props
    const phoneNumber = e.target.value || ''
    const format = get(value, 'format', VIETNAME_PHONE.FORMAT)
    const dialCode = get(value, 'dialCode', VIETNAME_PHONE.DIAL_CODE)
    const formattedPhone = formatPhoneNumber({
      format,
      dialCode,
      phone: phoneNumber,
    })

    if (format && format.length < formattedPhone.length) return

    onChange({
      ...value,
      phoneNumber,
      formattedPhone,
    })
  }

  setRef = inputRef => {
    this.ref = inputRef
  }

  render() {
    const { placeholder, autoFocus, value, size } = this.props

    const dialCode = get(value, 'dialCode', VIETNAME_PHONE.DIAL_CODE)
    const phoneNumber = get(value, 'phoneNumber', value)
    const formattedPhone = value
      ? get(value, 'formattedPhone', phoneNumber)
      : VIETNAME_PHONE.DIAL_CODE

    return (
      <Wrapper size={size}>
        <SelectCountry>
          <ReactTelephoneInput
            ref={this.setRef}
            defaultCountry={'vn'}
            flagsImagePath="/images/flags.png"
            onChange={this.handleTelChange}
            value={formattedPhone}
          />
          <DialCode>+{dialCode}</DialCode>
        </SelectCountry>
        <PhoneInput
          min="1"
          type="number"
          size={size}
          value={phoneNumber}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChange={this.handlePhoneChange}
        />
      </Wrapper>
    )
  }
}

InputPhoneNumber.defaultProps = {
  size: 'large',
}

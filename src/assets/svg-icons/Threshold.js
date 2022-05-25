import React, { Component } from 'react'

export default class Threshold extends Component {
  render() {
    const { isActive } = this.props

    const color = isActive ? '#1890FF' : '#111827'

    return (
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transition: '1s ease-in-out' }}
      >
        <path
          d="M12.5 9V14"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.5 21.41H6.43999C2.96999 21.41 1.51999 18.93 3.19999 15.9L6.31999 10.28L9.25999 5.00003C11.04 1.79003 13.96 1.79003 15.74 5.00003L18.68 10.29L21.8 15.91C23.48 18.94 22.02 21.42 18.56 21.42H12.5V21.41Z"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.4945 17H12.5035"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    )
  }
}

import { escapeRegExp } from 'lodash'
import React from 'react'

const HighlightedText = ({ text, pattern, ...props }) => {
  if (!pattern) return text

  const parts = text.split(new RegExp(`(${escapeRegExp(pattern)})`, 'gi'))

  return (
    <span onClick={props.onClick}>
      {parts.map((part, i) => {
        return (
          <span
            onClick={props.onClick}
            key={i}
            style={
              part.toLowerCase() === pattern.toLowerCase()
                ? { color: 'orange' }
                : {}
            }
          >
            {part}
          </span>
        )
      })}
    </span>
  )
}

export default HighlightedText

import React from 'react'
import styled from 'styled-components'
import ToolTipIcon from 'assets/svg-icons/tooltip.svg'
import { translate } from 'hoc/create-lang'
import createLang from 'hoc/create-lang'
import { autobind } from 'core-decorators'

const TootipContainer = styled.div`
  .tooltip {
    position: relative;
    display: flex;
    flex-direction:row-reverse;
    opacity: 100;
    z-index:1;
    /* border-bottom: 1px dotted black; */
  }
  .tooltip .tooltiptext {
    visibility: hidden;
    width: max-content;
    background-color: white;
    color: black;
    text-align: center;
    border-radius: 4px;
    padding: 5px 0;

    /* Position the tooltip */
    position: absolute;
    z-index: 1;
    margin-top: 24px;
    border: black;
    border-width: thin;
    border-style: outset;
    padding:4px
  }
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
}
`

@createLang
@autobind
class ToolTip extends React.Component {
  render() {
    return (
      <TootipContainer>
        <div className="tooltip">
          <img
            src={ToolTipIcon}
            alt="tooltipIcon"
            style={{ marginRight: '8px', width: '20px' }}
          />
          <span className="tooltiptext">
            {translate('dataSearchFrom.tooltip')}
          </span>
        </div>
      </TootipContainer>
    )
  }
}

export { ToolTip }

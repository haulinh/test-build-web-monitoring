import ToolTipIcon from 'assets/svg-icons/TooltipSmall.svg'
import { autobind } from 'core-decorators'
import createLang from 'hoc/create-lang'
import React from 'react'
import styled from 'styled-components'

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
            style={{ marginRight: '4px', width: '16px' }}
          />
          <span className="tooltiptext">
            Áp dụng so sánh giá trị thông số theo quy chuẩn đã thiết lập
          </span>
        </div>
      </TootipContainer>
    )
  }
}

export { ToolTip }

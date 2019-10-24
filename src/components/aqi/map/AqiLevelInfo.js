import React from "react"
import styled from "styled-components"
// import levels from "../../../constants/aqi-level"
import { Tooltip } from "antd"
import { getConfigAqiCalculation } from "api/CategoryApi.js"
import { get as _get } from "lodash"

const LevelWrapper = styled.div`
  position: absolute;
  left: 8px;
  bottom: 16px;
  background: #ffffff;
  border: 1px solid #cdcdcd;
  border-radius: 3px;
  z-index: 2;
`

const LevelView = styled.div`
  display: flex;
`

const LevelItem = styled.div`
  // padding: 2px 8px;
  width: 125px;
  height: 25px;
  color: #fff;
  background: ${props => props.color || "green"};
  text-align: center;
`

export default class AqiLevelInfo extends React.PureComponent {
  state = {
    isLoading: false,
    dataLevelAQI: []
  }

  componentDidMount = async () => {
    try {
      this.setState({
        isLoading: true
      })
      const res = await getConfigAqiCalculation()
      // console.log(res, "componentDidMount")
      if (res.success) {
        this.setState({
          dataLevelAQI: _get(res, "data.value", [])
        })
      }
    } catch (ex) {
      console.log(ex)
    } finally {
      this.setState({
        isLoading: false
      })
    }
  }

  render() {
    // console.log(this.state.dataLevelAQI,"dataLevelAQI")
    return (
      <LevelWrapper>
        {!this.state.isLoading && (
          <LevelView>
            {this.state.dataLevelAQI.map(
              ({ color, name, level, description, min, max }, index) => {

                let strLevel = ''
                if(min && max){
                  strLevel = `${min} - ${max}`
                }else if(min && !max){
                  strLevel = `Trên ${min}`
                }else if(!min && max){
                  strLevel = `Dưới ${max}`
                }
                return (
                  <Tooltip key={index} placement="top" title={description}>
                    <LevelItem color={color} key={name}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: "bold" }}>
                          {strLevel}: {name}
                        </span>
                      </div>
                    </LevelItem>
                  </Tooltip>
                )
              }
            )}
          </LevelView>
        )}
      </LevelWrapper>
    )
  }
}

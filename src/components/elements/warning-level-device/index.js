import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import { COLOR_DEVICE_STATUS
  // ,COLOR 
} from 'themes/color'


const WarningWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`
const StationStatusContainer = styled.div`
  display: flex;
  flex:1;
  max-width: 420px;
  justify-content: space-between;
  
`

const DotContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  text-align: center;
  padding-right: 8px;
  font-size: 11px;
  font-weight: 500;
`

const Dot = styled.div`
  height: 15px;
  width: 15px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
`

export default class WarningLevelDevices extends React.PureComponent {
  static propTypes = {
    number: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string
  }

  render() {
    return (
      <WarningWrapper>
        <StationStatusContainer>
          <DotContainer>
            <Dot style={{ backgroundColor: COLOR_DEVICE_STATUS.DATA_LOSS }} />
            <span>{translate('monitoring.deviceStatus.dataloss')}</span>
          </DotContainer>
          <DotContainer>
            <Dot style={{ backgroundColor: COLOR_DEVICE_STATUS.ERROR }} />
            <span>{translate('monitoring.deviceStatus.sensorError')}</span>
          </DotContainer>
          <DotContainer>
            <Dot style={{ backgroundColor: COLOR_DEVICE_STATUS.MAINTENACE }} />
            <span>{translate('monitoring.deviceStatus.maintenance')}</span>
          </DotContainer>

          <DotContainer>
            <Dot style={{ backgroundColor: COLOR_DEVICE_STATUS.NORMAL }} />
            <span>{translate('monitoring.deviceStatus.sensorNormal')}</span>
          </DotContainer>
        </StationStatusContainer>
{/*         
        <StationStatusContainer>
          <DotContainer>
            <Dot style={{ backgroundColor: COLOR.DATA_LOSS }} />
            <span>{translate('monitoring.deviceStatus.dataloss')}</span>
          </DotContainer>
          <DotContainer>
            <Dot style={{ backgroundColor: COLOR.SENSOR_ERROR }} />
            <span>{translate('monitoring.deviceStatus.sensorError')}</span>
          </DotContainer>
          <DotContainer>
            <Dot style={{ backgroundColor: COLOR.SENSOR_MAINTENACE }} />
            <span>{translate('monitoring.deviceStatus.maintenance')}</span>
          </DotContainer>

          <DotContainer>
            <Dot style={{ backgroundColor: COLOR.SENSOR_GOOD }} />
            <span>{translate('monitoring.deviceStatus.sensorNormal')}</span>
          </DotContainer>
        </StationStatusContainer> */}
      </WarningWrapper>
    )
  }
}

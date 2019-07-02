import React from 'react'
import WarningLevel from 'components/elements/warning-level'
import WarningLevelDevices from 'components/elements/warning-level-device'

import styled from 'styled-components'
// import { translate } from 'hoc/create-lang'
import { Clearfix } from 'containers/map/map-default/components/box-analytic-list/style'

const WarningWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export default function LevelInfo() {
  return (
    <WarningWrapper>
      <div style={{ paddingLeft: '8px' }}>
        <WarningLevelDevices />
      </div>
      <Clearfix height={8} />
      <WarningLevel />
    </WarningWrapper>
  )
}

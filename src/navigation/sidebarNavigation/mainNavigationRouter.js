import React from 'react'
import { AkNavigationItemGroup, AkNavigationItem } from '@atlaskit/navigation'
import styled from 'styled-components'

import {
  // createChildListMenuItem,
  WrapperLinkComponent
} from '../../utils/sidebarNavigation'
import slug from '../../constants/slug'
import Icon from '../../themes/icon'

const NavigationWrapper = styled.div`
  margin-top: -12px;
`

const dashboardMenu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.quizLists}
      text="Dashboard"
    />
  )
}

const monitoringMenu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.onlineMonitoring.base}
      icon={Icon.quizLists}
      text="Monitoring"
    />
  )
}

const mapMenu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.map.base}
      icon={Icon.quizLists}
      text="Map"
    />
  )
}

const groupData = {
  component: (
    <NavigationWrapper text="Data">
      <AkNavigationItemGroup title="Data" />
    </NavigationWrapper>
  )
}

const dataSearchMenu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.quizLists}
      text="Data Search"
    />
  )
}

const avgDataMenu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.quizLists}
      text="AVG Data"
    />
  )
}

const groupManager = {
  component: (
    <NavigationWrapper text="Manage">
      <AkNavigationItemGroup title="Manage" />
    </NavigationWrapper>
  )
}

const measuringMenu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.measuring.base}
      icon={Icon.quizLists}
      text="Measuring"
    />
  )
}

const stationTypeMenu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.stationType.base}
      icon={Icon.users}
      text="Station type"
    />
  )
}

const stationAutoMenu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.stationAuto.base}
      icon={Icon.gallerySlider}
      text="Station auto"
    />
  )
}

export default [
  dashboardMenu,
  monitoringMenu,
  mapMenu,
  groupData,
  dataSearchMenu,
  avgDataMenu,
  groupManager,
  measuringMenu,
  stationTypeMenu,
  stationAutoMenu
]

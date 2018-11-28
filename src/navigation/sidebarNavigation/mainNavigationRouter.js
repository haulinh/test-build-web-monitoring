import React from 'react'
import { AkNavigationItemGroup, AkNavigationItem } from '@atlaskit/navigation'
import {
  // createChildListMenuItem,
  WrapperLinkComponent
} from '../../utils/sidebarNavigation'
import slug from 'constants/slug'
import Icon from 'themes/icon'
import NavigationWrapper from './NavigationWrapper'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'
import { translate } from 'hoc/create-lang'

const dashboardMenu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.dashboard}
      icon={Icon.dashboard}
      text={translate('menuApp.dashboard')}
    />
  )
}

const aqiMenu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.aqi.base}
      icon={Icon.aqi}
      text={translate('aqi.title')}
    />
  )
}

const groupQAQC = {
  component: protectRole('', [ROLE.QAQC.VIEW], 'group')(
    <NavigationWrapper text={translate('qaqc.title')}>
      <AkNavigationItemGroup title={translate('qaqc.title')} />
    </NavigationWrapper>
  )
}

const qaqcMenu = {
  component: protectRole(ROLE.QAQC.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.qaqc}
      href={slug.qaqc.base}
      text={translate('qaqc.approveData')}
    />
  )
}

const configPublishMenu = {
  // component: protectRole(ROLE.QAQC.VIEW)(
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.publishConfig}
      href={slug.qaqc.config}
      text={translate('qaqc.configPublish.title')}
    />
  )
}

const monitoringMenu = {
  component: protectRole(ROLE.MONITORING.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.monitoring.base}
      icon={Icon.screen}
      text={translate('menuApp.monitoring')}
    />
  )
}

const CameraMenu = {
  component: protectRole(ROLE.MONITORING.CAMERA)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.cameraControl.base}
      icon={Icon.camera}
      text={translate('menuApp.camera')}
    />
  )
}

const mapMenu = {
  component: protectRole(ROLE.MAP.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.map.base}
      icon={Icon.location}
      text={translate('menuApp.map')}
    />
  )
}

const groupData = {
  component: protectRole(
    '',
    [ROLE.DATA_SEARCH.VIEW, ROLE.AVG_SEARCH.VIEW],
    'group'
  )(
    <NavigationWrapper text={translate('menuApp.data')}>
      <AkNavigationItemGroup title={translate('menuApp.data')} />
    </NavigationWrapper>
  )
}

const dataSearchMenu = {
  component: protectRole(ROLE.DATA_SEARCH.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.graphBar}
      href={slug.dataSearch.base}
      text={translate('menuApp.dataSearch')}
    />
  )
}

const avgDataMenu = {
  component: protectRole(ROLE.AVG_SEARCH.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.graphLine}
      href={slug.avgSearch.base}
      text={translate('menuApp.avgData')}
    />
  )
}

const groupManager = {
  component: protectRole(
    '',
    [
      ROLE.MEASURING.VIEW,
      ROLE.STATION_TYPE.VIEW,
      ROLE.STATION_AUTO.VIEW,
      ROLE.PROVINCE.VIEW,
      ROLE.QCVN.VIEW
    ],
    'group'
  )(
    <NavigationWrapper text={translate('menuApp.manage')}>
      <AkNavigationItemGroup title={translate('menuApp.manage')} />
    </NavigationWrapper>
  )
}

const measuringMenu = {
  component: protectRole(ROLE.MEASURING.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.measuring.base}
      icon={Icon.quizLists}
      text={translate('menuApp.measuring')}
    />
  )
}

const stationTypeMenu = {
  component: protectRole(ROLE.STATION_TYPE.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.stationType.base}
      icon={Icon.hipchat}
      text={translate('menuApp.stationType')}
    />
  )
}

const stationAutoMenu = {
  component: protectRole(ROLE.STATION_AUTO.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.stationAuto.base}
      icon={Icon.book}
      text={translate('menuApp.stationAuto')}
    />
  )
}

const provinceMenu = {
  component: protectRole(ROLE.PROVINCE.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.province.base}
      icon={Icon.province}
      text={translate('menuApp.province')}
    />
  )
}
const qcvnMenu = {
  component: protectRole(ROLE.QCVN.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.qcvn.base}
      icon={Icon.qcvn}
      text={'QCVN'}
    />
  )
}

const groupAdmin = {
  component: protectRole('', [ROLE.USER.VIEW, ROLE.ROLE.VIEW], 'group')(
    <NavigationWrapper text={translate('menuApp.adminManagement')}>
      <AkNavigationItemGroup title={translate('menuApp.adminManagement')} />
    </NavigationWrapper>
  )
}

const userMenu = {
  component: protectRole(ROLE.USER.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.user.base}
      icon={Icon.person}
      text={translate('menuApp.user')}
    />
  )
}

const roleMenu = {
  component: protectRole(ROLE.ROLE.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.role.base}
      icon={Icon.peopleGroup}
      text={translate('menuApp.role')}
    />
  )
}

export default [
  dashboardMenu,
  monitoringMenu,
  mapMenu,
  CameraMenu,
  aqiMenu,
  groupData,
  dataSearchMenu,
  avgDataMenu,
  groupQAQC,
  qaqcMenu,
  configPublishMenu,
  groupManager,
  measuringMenu,
  stationTypeMenu,
  stationAutoMenu,
  provinceMenu,
  qcvnMenu,
  groupAdmin,
  userMenu,
  roleMenu
]

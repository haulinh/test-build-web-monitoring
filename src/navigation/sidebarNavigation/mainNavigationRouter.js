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


// NOTE  không sử dụng


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
  component: protectRole(ROLE.AQI.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.aqi.base}
      icon={Icon.aqi}
      text={translate('aqi.title')}
    />
  )
}

const wqiMenu = {
  component: protectRole(ROLE.WQI.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.wqi.base}
      icon={Icon.wqi}
      text={translate('wqi.title')} //{translate('aqi.title')}
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

const cameraMenu = {
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

const groupStationFixed = {
  component: protectRole(
    '',
    [
      ROLE.MAP_STATION_FIXED.VIEW,
      ROLE.STATION_FIXED.VIEW,
      ROLE.STATION_FIXED_SEARCH.VIEW
    ],
    'group'
  )(
    <NavigationWrapper text={translate('menuApp.stationFixed')}>
      <AkNavigationItemGroup title={translate('menuApp.stationFixed')} />
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

const dataSearchFixedMenu = {
  component: protectRole(ROLE.STATION_FIXED_SEARCH.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.graphBar}
      href={slug.dataSearchFixed.base}
      text={translate('menuApp.dataSearchFixed')}
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
      ROLE.QCVN.VIEW,
      // ROLE.STATION_FIXED.VIEW,
      ROLE.CONFIG_WQI.VIEW
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

const stationFixedMenu = {
  component: protectRole(ROLE.STATION_FIXED.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.stationFixed.base}
      icon={Icon.stationFixed}
      text={translate('menuApp.stationFixed')}
    />
  )
}

const configWQI = {
  component: protectRole(ROLE.CONFIG_WQI.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.configWQI.base}
      icon={Icon.configWQI}
      text={translate('menuApp.configWQI')}
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

const ftpTransferMenu = {
  component: protectRole(ROLE.FTPTRANSFER.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.ftpTransfer.base}
      icon={Icon.ftpTranfer}
      text={translate('menuApp.ftpTranfer')}
    />
  )
}

const configPublishMenu = {
  component: protectRole(ROLE.QAQCCONFIG.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.publishConfig}
      href={slug.qaqc.config}
      text={translate('qaqc.configPublish.title')}
    />
  )
}

const groupPubShare = {
  component: protectRole(
    '',
    [ROLE.QAQCCONFIG.VIEW, ROLE.FTPTRANSFER.VIEW],
    'group'
  )(
    <NavigationWrapper text={translate('menuApp.publishShare')}>
      <AkNavigationItemGroup title={translate('menuApp.publishShare')} />
    </NavigationWrapper>
  )
}

const mapFixedMenu = {
  component: protectRole(ROLE.MAP_STATION_FIXED.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.publishConfig}
      href={slug.mapFixed.base}
      text={translate('menuApp.mapFixed')}
    />
  )
}

const statisticPerRecMenu = {
  component: protectRole(ROLE.STATISTIC.PER_REC_DATA)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.publishConfig}
      href={slug.statistic.perRecData}
      text={translate('statistic.perRecData')}
    />
  )
}

const statisticExceededMenu = {
  component: protectRole(ROLE.STATISTIC.EXCEEDED)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.publishConfig}
      href={slug.statistic.exceeded}
      text={translate('statistic.exceeded')}
    />
  )
}

const statisticAQIMenu = {
  component: protectRole(ROLE.STATISTIC.AQI)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.aqiStatistic}
      href={slug.statistic.aqi}
      text={translate('statistic.aqi.menuApp')}
    />
  )
}

const statisticWQIMenu = {
  component: protectRole(ROLE.STATISTIC.WQI)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.wqiStatistic}
      href={slug.statistic.wqi}
      text={translate('statistic.wqi.menuApp')}
    />
  )
}

const groupStatistic = {
  component: protectRole(
    '',
    [
      ROLE.STATISTIC.EXCEEDED,
      ROLE.STATISTIC.PER_REC_DATA,
      ROLE.STATISTIC.AQI,
      ROLE.STATISTIC.WQI
    ],
    'group'
  )(
    <NavigationWrapper text={translate('menuApp.groupStatistic')}>
      <AkNavigationItemGroup title={translate('menuApp.groupStatistic')} />
    </NavigationWrapper>
  )
}

const groupReport = {
  component: (
    <NavigationWrapper text={translate("menuApp.reportSub")}>
      <AkNavigationItemGroup title={translate("menuApp.reportSub")} />
    </NavigationWrapper>
  )
};

const reportType1Menu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.report.type1}
      icon={Icon.trayIcon}
      text={translate("menuApp.report.type1")}
    />
  ) 
};

const reportType2Menu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.report.type2}
      icon={Icon.trayIcon}
      text={translate("menuApp.report.type2")}
    />
  ) 
};

const reportType3Menu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.report.type3}
      icon={Icon.trayIcon}
      text={translate("menuApp.report.type3")}
    />
  ) 
};

const reportType4Menu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.report.type4}
      icon={Icon.trayIcon}
      text={translate("menuApp.report.type4")}
    />
  ) 
};

const reportType5Menu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.report.type5}
      icon={Icon.trayIcon}
      text={translate("menuApp.report.type5")}
    />
  ) 
};

const reportType6Menu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.report.type6}
      icon={Icon.trayIcon}
      text={translate("menuApp.report.type6")}
    />
  ) 
};

const reportType7Menu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.report.type7}
      icon={Icon.trayIcon}
      text={translate("menuApp.report.type7")}
    />
  ) 
};

const reportType8Menu = {
  component: (
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.report.type8}
      icon={Icon.trayIcon}
      text={translate("menuApp.report.type8")}
    />
  ) 
};

// const reportType9Menu = {
//   component: (
//     <AkNavigationItem
//       linkComponent={WrapperLinkComponent}
//       href={slug.report.type9}
//       icon={Icon.trayIcon}
//       text={translate("menuApp.report.type9")}
//     />
//   ) 
// };

// const reportType10Menu = {
//   component: (
//     <AkNavigationItem
//       linkComponent={WrapperLinkComponent}
//       href={slug.report.type10}
//       icon={Icon.trayIcon}
//       text={translate("menuApp.report.type10")}
//     />
//   ) 
// };

export default [
  dashboardMenu,
  monitoringMenu,
  mapMenu,
  cameraMenu,
  aqiMenu,
  wqiMenu,
  groupData,
  dataSearchMenu,
  avgDataMenu,
  groupPubShare,
  configPublishMenu,
  ftpTransferMenu,
  groupQAQC,
  qaqcMenu,
  groupStationFixed,
  mapFixedMenu,
  dataSearchFixedMenu,
  stationFixedMenu,
  groupStatistic,
  statisticAQIMenu,
  statisticWQIMenu,
  statisticPerRecMenu,
  statisticExceededMenu,
  groupManager,
  measuringMenu,
  stationTypeMenu,
  stationAutoMenu,
  configWQI,
  provinceMenu,
  qcvnMenu,
  groupAdmin,
  userMenu,
  roleMenu,
  groupReport,
  reportType1Menu,
  reportType2Menu,
  reportType3Menu,
  reportType4Menu,
  reportType5Menu,
  reportType6Menu,
  reportType7Menu,
  reportType8Menu,
  // reportType9Menu,
  // reportType10Menu,
]

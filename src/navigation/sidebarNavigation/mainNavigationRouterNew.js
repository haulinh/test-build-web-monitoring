import React, { PureComponent, Component } from "react";
import { AkNavigationItemGroup, AkNavigationItem } from "@atlaskit/navigation";
import {
  // createChildListMenuItem,
  WrapperLinkComponent
} from "../../utils/sidebarNavigation";
import slug from "constants/slug";
import Icon from "themes/icon";
import NavigationWrapper from "./NavigationWrapper";
import protectRole from "hoc/protect-role/index.backup";
import ROLE from "constants/role";
import { translate } from "hoc/create-lang";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const CENTER = {
  display: "flex",
  alignItems: "center",
  fontWeight: 600
};

// linkComponent={WrapperLinkComponent}
// href={slug.dashboard}
// icon={Icon.dashboard}
// text={translate('menuApp.dashboard')}

{
  /* <SubMenu
    
key="sub2"

title={
  <span>
    <span>Navigation Two</span>
  </span>
}
>
<Menu.Item onClick style={{ paddingLeft: 1 }} key="5">
  Option 5
</Menu.Item>
<Menu.Item key="6">Option 6</Menu.Item>
</SubMenu> */
}

export const dashboardMenu = (
  <Menu.Item>
  <Link style={CENTER} to={slug.dashboard}>
    {/* <IconContainer>{Icon.dashboard}</IconContainer>{" "}
    {translate("menuApp.dashboard")} */}
      {Icon.dashboard}
      <span style={{marginLeft: 12}}>{translate("menuApp.dashboard")}</span>
  </Link>
</Menu.Item>
)


//       linkComponent={WrapperLinkComponent}
//       href={slug.monitoring.base}
//       icon={Icon.screen}
//       text={translate("menuApp.monitoring")}

export const monitoringMenu = (
  <SubMenu
    key="monitoring"
    // title={
    //   <div>
    //   <IconContainer >{Icon.screen}</IconContainer> Khai tác dữ liệu
    //   </div>
    // }
    title={
     <div style={CENTER}>
       {Icon.screen}
        <span style={{marginLeft: 12}}>Khai tác dữ liệu</span>
     </div>
    }
  >
    <Menu.Item key={slug.monitoring.base}>
      <Link to={slug.monitoring.base}>Giám sát dữ liệu</Link>
    </Menu.Item>
    <Menu.Item key={slug.map.base}>
      <Link to={slug.map.base}>Bản đồ</Link>
    </Menu.Item>
    <Menu.Item key={slug.cameraControl.base}>
      <Link to={slug.cameraControl.base}>Camera</Link>
    </Menu.Item>
    <Menu.Item key={slug.dataSearch.base}>
      <Link to={slug.dataSearch.base}>Tra cứu dữ liệu</Link>
    </Menu.Item>
    <Menu.Item key={slug.avgSearch.base}>
      <Link to={slug.avgSearch.base}>Dữ liệu trung bình</Link>
    </Menu.Item>
  </SubMenu>
);



export const handleDataMenu = (
  <SubMenu
    key="handleData"
    title={
      <div style={CENTER}>
      {Icon.handleData}
       <span style={{marginLeft: 12}}>Xử lý dữ liệu</span>
    </div>
    }
  >
    <Menu.Item key={slug.qaqc.base}>
      <Link to={slug.qaqc.base}>Kiểm duyệt dữ liệu</Link>
    </Menu.Item>
  </SubMenu>
);

export const shareDataMenu = (
  <SubMenu
    key="shareData"
    title={
      <div style={CENTER}>
        {Icon.configWQI}
         <span style={{marginLeft: 12}}>Chia sẻ dữ liệu</span>
      </div>
     }
  >
    <Menu.Item key={slug.qaqc.config}>
      <Link to={slug.qaqc.config}>Cấu hình chia sẽ dữ liệu</Link>
    </Menu.Item>
    <Menu.Item key={slug.ftpTransfer.base}>
      <Link to={slug.ftpTransfer.base}>Cấu hình truyền FTP</Link>
    </Menu.Item>
  </SubMenu>
);

export const advanceMenu = (
  <SubMenu
    key="advance"
    title={
      <div style={CENTER}>
        {Icon.advance}
         <span style={{marginLeft: 12}}>Nâng cao</span>
      </div>
     }
  >
    <Menu.Item key={slug.aqi.base}>
      <Link to={slug.aqi.base}>Bản đồ AQI</Link>
    </Menu.Item>
    <Menu.Item key={slug.statistic.aqi}>
      <Link to={slug.statistic.aqi}>Tra cứu dữ liệu AQI</Link>
    </Menu.Item>

    <Menu.Item key={slug.wqi.base}>
      <Link to={slug.wqi.base}>Bản đồ WQI</Link>
    </Menu.Item>
    <Menu.Item key={slug.statistic.wqi}>
      <Link to={slug.statistic.wqi}>Tra cứu dữ liệu WQI</Link>
    </Menu.Item>

    <Menu.Item key={slug.configWQI.base}>
      <Link to={slug.configWQI.base}>Cấu hình AQI {"&"} WQI</Link>
    </Menu.Item>
  </SubMenu>
);

export const configMenu = (
  <SubMenu
    key="config"
    title={
      <div style={CENTER}>
        {Icon.config}
         <span style={{marginLeft: 12}}>Cấu hình</span>
      </div>
     }
  >
    <Menu.Item key={slug.stationAuto.base}>
      <Link to={slug.stationAuto.base}>Trạm quan trắc</Link>
    </Menu.Item>
    <Menu.Item key={slug.measuring.base}>
      <Link to={slug.measuring.base}>Chỉ tiêu quan trắc</Link>
    </Menu.Item>

    <Menu.Item key={slug.stationType.base}>
      <Link to={slug.stationType.base}>Loại trạm</Link>
    </Menu.Item>
    <Menu.Item key={slug.province.base}>
      <Link to={slug.province.base}>Đơn vị quản lý</Link>
    </Menu.Item>

    <Menu.Item key={slug.qcvn.base}>
      <Link to={slug.qcvn.base}>Quy chuẩn</Link>
    </Menu.Item>

    <Menu.Item key={slug.role.base}>
      <Link to={slug.role.base}>Nhóm quyền</Link>
    </Menu.Item>

    <Menu.Item key={slug.user.base}>
      <Link to={slug.user.base}>Tài khoản</Link>
    </Menu.Item>
  </SubMenu>
);

const aqiMenu = {
  component: protectRole(ROLE.AQI.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.aqi.base}
      icon={Icon.aqi}
      text={translate("aqi.title")}
    />
  )
};

const wqiMenu = {
  component: protectRole(ROLE.WQI.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.wqi.base}
      icon={Icon.wqi}
      text={translate("wqi.title")} //{translate('aqi.title')}
    />
  )
};

const groupQAQC = {
  component: protectRole("", [ROLE.QAQC.VIEW], "group")(
    <NavigationWrapper text={translate("qaqc.title")}>
      <AkNavigationItemGroup title={translate("qaqc.title")} />
    </NavigationWrapper>
  )
};

const qaqcMenu = {
  component: protectRole(ROLE.QAQC.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.qaqc}
      href={slug.qaqc.base}
      text={translate("qaqc.approveData")}
    />
  )
};

// const monitoringMenu = {
//   component: protectRole(ROLE.MONITORING.VIEW)(
//     <AkNavigationItem
//       linkComponent={WrapperLinkComponent}
//       href={slug.monitoring.base}
//       icon={Icon.screen}
//       text={translate("menuApp.monitoring")}
//     />
//   )
// };

const cameraMenu = {
  component: protectRole(ROLE.MONITORING.CAMERA)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.cameraControl.base}
      icon={Icon.camera}
      text={translate("menuApp.camera")}
    />
  )
};

const mapMenu = {
  component: protectRole(ROLE.MAP.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.map.base}
      icon={Icon.location}
      text={translate("menuApp.map")}
    />
  )
};

const groupData = {
  component: protectRole(
    "",
    [ROLE.DATA_SEARCH.VIEW, ROLE.AVG_SEARCH.VIEW],
    "group"
  )(
    <NavigationWrapper text={translate("menuApp.data")}>
      <AkNavigationItemGroup title={translate("menuApp.data")} />
    </NavigationWrapper>
  )
};

const groupStationFixed = {
  component: protectRole(
    "",
    [
      ROLE.MAP_STATION_FIXED.VIEW,
      ROLE.STATION_FIXED.VIEW,
      ROLE.STATION_FIXED_SEARCH.VIEW
    ],
    "group"
  )(
    <NavigationWrapper text={translate("menuApp.stationFixed")}>
      <AkNavigationItemGroup title={translate("menuApp.stationFixed")} />
    </NavigationWrapper>
  )
};

const dataSearchMenu = {
  component: protectRole(ROLE.DATA_SEARCH.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.graphBar}
      href={slug.dataSearch.base}
      text={translate("menuApp.dataSearch")}
    />
  )
};

const dataSearchFixedMenu = {
  component: protectRole(ROLE.STATION_FIXED_SEARCH.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.graphBar}
      href={slug.dataSearchFixed.base}
      text={translate("menuApp.dataSearchFixed")}
    />
  )
};

const avgDataMenu = {
  component: protectRole(ROLE.AVG_SEARCH.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.graphLine}
      href={slug.avgSearch.base}
      text={translate("menuApp.avgData")}
    />
  )
};

const groupManager = {
  component: protectRole(
    "",
    [
      ROLE.MEASURING.VIEW,
      ROLE.STATION_TYPE.VIEW,
      ROLE.STATION_AUTO.VIEW,
      ROLE.PROVINCE.VIEW,
      ROLE.QCVN.VIEW,
      // ROLE.STATION_FIXED.VIEW,
      ROLE.CONFIG_WQI.VIEW
    ],
    "group"
  )(
    <NavigationWrapper text={translate("menuApp.manage")}>
      <AkNavigationItemGroup title={translate("menuApp.manage")} />
    </NavigationWrapper>
  )
};

const measuringMenu = {
  component: protectRole(ROLE.MEASURING.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.measuring.base}
      icon={Icon.quizLists}
      text={translate("menuApp.measuring")}
    />
  )
};

const stationTypeMenu = {
  component: protectRole(ROLE.STATION_TYPE.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.stationType.base}
      icon={Icon.hipchat}
      text={translate("menuApp.stationType")}
    />
  )
};

const stationAutoMenu = {
  component: protectRole(ROLE.STATION_AUTO.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.stationAuto.base}
      icon={Icon.book}
      text={translate("menuApp.stationAuto")}
    />
  )
};

const stationFixedMenu = {
  component: protectRole(ROLE.STATION_FIXED.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.stationFixed.base}
      icon={Icon.stationFixed}
      text={translate("menuApp.stationFixed")}
    />
  )
};

const configWQI = {
  component: protectRole(ROLE.CONFIG_WQI.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.configWQI.base}
      icon={Icon.configWQI}
      text={translate("menuApp.configWQI")}
    />
  )
};

const provinceMenu = {
  component: protectRole(ROLE.PROVINCE.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.province.base}
      icon={Icon.province}
      text={translate("menuApp.province")}
    />
  )
};
const qcvnMenu = {
  component: protectRole(ROLE.QCVN.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.qcvn.base}
      icon={Icon.qcvn}
      text={"QCVN"}
    />
  )
};

const groupAdmin = {
  component: protectRole("", [ROLE.USER.VIEW, ROLE.ROLE.VIEW], "group")(
    <NavigationWrapper text={translate("menuApp.adminManagement")}>
      <AkNavigationItemGroup title={translate("menuApp.adminManagement")} />
    </NavigationWrapper>
  )
};

const userMenu = {
  component: protectRole(ROLE.USER.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.user.base}
      icon={Icon.person}
      text={translate("menuApp.user")}
    />
  )
};

const roleMenu = {
  component: protectRole(ROLE.ROLE.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.role.base}
      icon={Icon.peopleGroup}
      text={translate("menuApp.role")}
    />
  )
};

const ftpTransferMenu = {
  component: protectRole(ROLE.FTPTRANSFER.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      href={slug.ftpTransfer.base}
      icon={Icon.ftpTranfer}
      text={translate("menuApp.ftpTranfer")}
    />
  )
};

const configPublishMenu = {
  component: protectRole(ROLE.QAQCCONFIG.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.publishConfig}
      href={slug.qaqc.config}
      text={translate("qaqc.configPublish.title")}
    />
  )
};

const groupPubShare = {
  component: protectRole(
    "",
    [ROLE.QAQCCONFIG.VIEW, ROLE.FTPTRANSFER.VIEW],
    "group"
  )(
    <NavigationWrapper text={translate("menuApp.publishShare")}>
      <AkNavigationItemGroup title={translate("menuApp.publishShare")} />
    </NavigationWrapper>
  )
};

const mapFixedMenu = {
  component: protectRole(ROLE.MAP_STATION_FIXED.VIEW)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.publishConfig}
      href={slug.mapFixed.base}
      text={translate("menuApp.mapFixed")}
    />
  )
};

const statisticPerRecMenu = {
  component: protectRole(ROLE.STATISTIC.PER_REC_DATA)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.publishConfig}
      href={slug.statistic.perRecData}
      text={translate("statistic.perRecData")}
    />
  )
};

const statisticExceededMenu = {
  component: protectRole(ROLE.STATISTIC.EXCEEDED)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.publishConfig}
      href={slug.statistic.exceeded}
      text={translate("statistic.exceeded")}
    />
  )
};

const statisticAQIMenu = {
  component: protectRole(ROLE.STATISTIC.AQI)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.aqiStatistic}
      href={slug.statistic.aqi}
      text={translate("statistic.aqi.menuApp")}
    />
  )
};

const statisticWQIMenu = {
  component: protectRole(ROLE.STATISTIC.WQI)(
    <AkNavigationItem
      linkComponent={WrapperLinkComponent}
      icon={Icon.wqiStatistic}
      href={slug.statistic.wqi}
      text={translate("statistic.wqi.menuApp")}
    />
  )
};

const groupStatistic = {
  component: protectRole(
    "",
    [
      ROLE.STATISTIC.EXCEEDED,
      ROLE.STATISTIC.PER_REC_DATA,
      ROLE.STATISTIC.AQI,
      ROLE.STATISTIC.WQI
    ],
    "group"
  )(
    <NavigationWrapper text={translate("menuApp.groupStatistic")}>
      <AkNavigationItemGroup title={translate("menuApp.groupStatistic")} />
    </NavigationWrapper>
  )
};

// export default [
//   dashboardMenu
//   // monitoringMenu,
//   // mapMenu,
//   // cameraMenu,
//   // aqiMenu,
//   // wqiMenu,
//   // groupData,
//   // dataSearchMenu,
//   // avgDataMenu,
//   // groupPubShare,
//   // configPublishMenu,
//   // ftpTransferMenu,
//   // groupQAQC,
//   // qaqcMenu,
//   // groupStationFixed,
//   // mapFixedMenu,
//   // dataSearchFixedMenu,
//   // stationFixedMenu,
//   // groupStatistic,
//   // statisticAQIMenu,
//   // statisticWQIMenu,
//   // statisticPerRecMenu,
//   // statisticExceededMenu,
//   // groupManager,
//   // measuringMenu,
//   // stationTypeMenu,
//   // stationAutoMenu,
//   // configWQI,
//   // provinceMenu,
//   // qcvnMenu,
//   // groupAdmin,
//   // userMenu,
//   // roleMenu
// ];
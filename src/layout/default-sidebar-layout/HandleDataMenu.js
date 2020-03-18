import React from "react";
import { Menu } from "antd";
import slug, { MENU_NAME, MENU_GROUP } from "constants/slug";
import protectRole from "hoc/protect-role/forMenu";
import ROLE from "constants/role";
import Icon from "themes/icon";
import { Link } from "react-router-dom";

const CENTER = {
  display: "flex",
  alignItems: "center",
  fontWeight: 600
};

export default {
  renderComp: props => (
    <Menu.SubMenu
      key={MENU_GROUP.HANDLE_DATA}
      title={
        <div style={CENTER}>
          {Icon.handleData}
          <span style={{ marginLeft: 12 }}>{MENU_NAME.processDataSub}</span>
        </div>
      }
    >
      {/* {protectRole(ROLE.QAQC.CONFIG_NEW)(

        )} */}
      {protectRole(ROLE.XU_LY_KIEM_DUYET_DU_LIEU_CONFIG.VIEW)(
        <Menu.Item
          key={slug.qaqc.configNew}
          onClick={() => {
            props.selectMenu(slug.qaqc.configNew);
          }}
        >
          <Link to={slug.qaqc.configNew}>
            {MENU_NAME.processData.configNew}
          </Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.XU_LY_KIEM_DUYET_DU_LIEU.VIEW)(
        <Menu.Item
          key={slug.qaqc.base}
          onClick={() => {
            props.selectMenu(slug.qaqc.base);
          }}
        >
          <Link to={slug.qaqc.base}>{MENU_NAME.processData.approveData}</Link>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  )
};

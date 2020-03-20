import React, { PureComponent } from "react";
import styled from "styled-components";
import { Table, Checkbox } from "antd";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import update from "react-addons-update";
import createLanguage, { langPropTypes } from "hoc/create-lang";
import AuthApi from "api/AuthApi";
import { orderBy as _orderBy, get as _get } from "lodash";

const View = styled.div``;

@createLanguage
@autobind
export default class CheckBoxRole extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    lang: langPropTypes,
    dataItems: PropTypes.object
  };

  state = {
    menu: {},
    dataMenus: []
  };

  async componentWillMount() {
    let record = await AuthApi.getMe();
    let initialValues;
    if (this.props.value) {
      initialValues = Object.assign({}, this.props.value[0]);
    }

    const UserRole = _get(record, "data.organization.menu", []);
    console.log(
      Object.keys(UserRole),
      "---record.data.organization.menu"
    );
    let arr = Object.keys(UserRole).map(key => {
      return {
        key: key,
        ...UserRole[key]
      }
    });
    arr = _orderBy(arr, ["numericalOrder"], ["asc"]);

    this.setState(
      {
        menu: this.props.value ? initialValues : record.data.organization.menu,
        dataMenus: arr
      },
      () => {
        this.handleCheckChange();
      }
    );
  }

  async onChangeMenu(e, menuName) {
    this.setState(
      {
        menu: {
          ...this.state.menu,
          [menuName]: e.target.checked
            ? {
                actions: {
                  view: e.target.checked
                },
                description: menuName
              }
            : undefined
        }
      },
      () => {
        this.handleCheckChange();
      }
    );
  }

  async onChangeRule(e, menuName, actionName) {
    this.setState(
      update(this.state, {
        menu: {
          [menuName]: {
            actions: {
              [actionName]: {
                $set: e.target.checked
              }
            }
          }
        }
      }),
      () => {
        this.handleCheckChange();
      }
    );
  }

  getColumns() {
    const {
      lang: { t }
    } = this.props;
    return [
      {
        title: t("roleManager.tableHeader.stt"),
        dataIndex: "key",
        render: (text, record, index) => {
          return <strong>{index + 1}</strong>;
        }
      },
      {
        title: t("roleManager.tableHeader.menu"),
        dataIndex: "key",
        key: "key",
        render: (text, record, index) => {
          return (
            <Checkbox
              onChange={e => {
                this.onChangeMenu(e, record.key);
              }}
              checked={this.state.menu[record.key] ? true : false}
            >
              {t(`roleManager.rule.${record.key}.name`)}
            </Checkbox>
          );
        }
      },
      {
        title: t("roleManager.tableHeader.action"),
        key: "action",
        render: (text, record) => {
          const objActions = this.state.dataMenus.find(function(item) {
            return item.key === record.key;
          });

          const arrActions = Object.keys(objActions.actions);
          const actionsOrganization =
            this.state.menu &&
            this.state.menu[record.key] &&
            this.state.menu[record.key].actions
              ? this.state.menu[record.key].actions
              : {};

          return (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {arrActions &&
                arrActions.map((actionName, index) => {
                  if (actionName === "view") return <div />;

                  return (
                    <div style={{ paddingBottom: "8px", width: "25%" }}>
                      {record.actions[actionName] && (
                        <Checkbox
                          key={index}
                          onChange={e => {
                            this.onChangeRule(e, record.key, actionName);
                          }}
                          checked={actionsOrganization[actionName]}
                          disabled={
                            this.state.menu
                              ? !this.state.menu[record.key]
                              : true
                          }
                        >
                          {t(`roleManager.rule.actions.${actionName}`)}
                        </Checkbox>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        }
      }
    ];
  }

  handleCheckChange() {
    this.props.onChange([this.state.menu]);
  }

  render() {
    return (
      <View>
        <Table
          {...this.props}
          loading={this.props.isLoading}
          columns={this.getColumns()}
          dataSource={this.state.dataMenus}
          pagination={{
            pageSize: 1000,
            hideOnSinglePage: true
          }}
        />
      </View>
    );
  }
}

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Table, Checkbox } from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import update from 'react-addons-update'
import createLanguage, { langPropTypes } from 'hoc/create-lang'
import AuthApi from 'api/AuthApi'
import { orderBy as _orderBy, get as _get } from 'lodash'

const View = styled.div``

@createLanguage
@autobind
export default class CheckBoxRole extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    lang: langPropTypes,
    dataItems: PropTypes.object
  }

  state = {
    menu: {},
    dataMenus: []
  }

  async componentWillMount() {
    let record = await AuthApi.getMe()
    let initialValues
    if (this.props.value) {
      initialValues = Object.assign({}, this.props.value[0])
    }

    const UserRole = _get(record, 'data.organization.menu', [])
    let arr = Object.keys(UserRole).map(key => {
      return {
        key: key,
        ...UserRole[key]
      }
    })
    arr = _orderBy(arr, ['numericalOrder'], ['asc'])

    this.setState(
      {
        menu: this.props.value ? initialValues : record.data.organization.menu,
        dataMenus: arr
      },
      () => {
        this.handleCheckChange()
      }
    )
  }

  async onChangeMenu(e, menuName) {
    if (!e.target.checked) {
      this.setState(
        prevState =>
          update(prevState, {
            menu: {
              [menuName]: {
                $set: undefined
              }
            }
          }),
        () => {
          this.handleCheckChange()
        }
      )
    } else {
      this.setState(
        prevState =>
          update(prevState, {
            menu: {
              [menuName]: {
                $set: prevState.dataMenus.find(menu => menu.key === menuName)
              }
            }
          }),
        () => {
          this.handleCheckChange()
        }
      )
    }
    // this.setState(prevState => update(prevState.menu, {
    // 		[menuName]: {
    // 			$set: e.target.checked ? : undefined
    // 		}
    // }),
    // () => {
    // 	this.handleCheckChange();
    // }
    // )
    // this.setState(
    // 	(prevState) => ({
    // 		menu: {
    // 			...prevState.menu,
    // 			[menuName]: e.target.checked
    // 				? {
    // 						...prevState.dataMenus.find((menu) => menu.key === menuName),
    // 						actions: {
    // 							...prevState.dataMenus.find((menu) => menu.key === menuName)
    // 								.actions,
    // 							view: e.target.checked,
    // 						},
    // 						// description: menuName,
    // 				  }
    // 				: undefined,
    // 		},
    // 	}),
    // );
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
        this.handleCheckChange()
      }
    )
  }

  isIndeterminate = key => {
    const menuData = this.state.menu[key]
    if (!menuData) return false
    return (
      !this.isChecked(key) &&
      Object.keys(menuData.actions).some(
        actionKey => menuData.actions[actionKey]
      )
    )
  }

  isChecked = key => {
    const menuData = this.state.menu[key]
    if (!menuData) return false
    return Object.keys(menuData.actions).every(
      actionKey => menuData.actions[actionKey]
    )
  }

  isDisable = key => {
    const menuData = this.state.menu[key]
    if (!menuData) return true
    return Object.keys(menuData.actions).every(
      actionKey => !menuData.actions[actionKey]
    )
  }

  getColumns() {
    const {
      lang: { t }
    } = this.props
    return [
      {
        key: 'index',
        title: t('roleManager.tableHeader.stt'),
        dataIndex: 'key',
        render: (text, record, index) => {
          return <strong>{index + 1}</strong>
        }
      },
      {
        title: t('roleManager.tableHeader.menu'),
        dataIndex: 'key',
        key: 'key',
        render: (text, record, index) => {
          return (
            <Checkbox
              onChange={e => {
                this.onChangeMenu(e, record.key)
              }}
              indeterminate={this.isIndeterminate(record.key)}
              checked={this.isChecked(record.key)}
            >
              {t(`roleManager.rule.${record.key}.name`)}
            </Checkbox>
          )
        }
      },
      {
        title: t('roleManager.tableHeader.action'),
        key: 'action',
        render: (text, record) => {
          const objActions = this.state.dataMenus.find(function(item) {
            return item.key === record.key
          })

          const arrActions = Object.keys(objActions.actions)
          const actionsOrganization =
            this.state.menu &&
            this.state.menu[record.key] &&
            this.state.menu[record.key].actions
              ? this.state.menu[record.key].actions
              : {}

          return (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {arrActions &&
                arrActions.map((actionName, index) => {
                  // if (actionName === 'view') return <div key={index} />;
                  return (
                    <div
                      key={index}
                      style={{ paddingBottom: '8px', width: '25%' }}
                    >
                      {record.actions[actionName] && (
                        <Checkbox
                          key={index}
                          onChange={e => {
                            this.onChangeRule(e, record.key, actionName)
                          }}
                          checked={actionsOrganization[actionName]}
                          disabled={this.isDisable(record.key)}
                        >
                          {t(`roleManager.rule.actions.${actionName}`)}
                        </Checkbox>
                      )}
                    </div>
                  )
                })}
            </div>
          )
        }
      }
    ]
  }

  handleCheckChange() {
    this.props.onChange([this.state.menu])
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
    )
  }
}

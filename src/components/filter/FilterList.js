import {
  Affix,
  Col as ColAnt,
  Icon,
  Input,
  Menu,
  Popconfirm,
  Row,
  Tooltip,
} from 'antd'
import { Clearfix } from 'components/layouts/styles'
import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'

const { SubMenu } = Menu

const MENU_WIDTH = 300

const Col = styled(ColAnt)`
  width: ${MENU_WIDTH}px;
  height: calc(100vh - 55px);
  background-color: rgb(244, 245, 247);
  .ant-menu-light {
    background: unset;
    overflow-y: auto;

    .icon-delete {
      visibility: hidden;
      opacity: 0;
    }
  }

  .ant-menu-item {
    :hover {
      .icon-delete {
        /* transition: 0.5s; */
        transition: visibility 0s, opacity 0.5s linear;
        opacity: 1;
        visibility: visible;
      }
    }
  }

  ul.ant-menu.ant-menu-sub.ant-menu-inline {
    width: 80%;
  }

  .ant-menu-submenu-title {
    font-weight: 600;
    font-size: 16px;
  }
  :hover {
    overflow-y: auto;
  }
`

export const FilterList = props => {
  const { list, onClickMenuItem, onDeleteFilter } = props

  const filterGroupByStationType = list.reduce((base, current) => {
    const stationType = _.get(current, ['stationType'])
    const stationKey = stationType.key

    if (base[stationKey]) {
      return {
        ...base,
        [stationKey]: {
          ...base[stationKey],
          stationKey: stationKey,
          stationName: stationType.name,
          filterList: [...base[stationKey].filterList, current],
        },
      }
    }

    return {
      ...base,
      [stationKey]: {
        filterList: [current],
        stationKey: stationKey,
        stationName: stationType.name,
      },
    }
  }, {})

  const menuSource = Object.values(filterGroupByStationType)

  const defaultOpenKeys = Object.keys(filterGroupByStationType)

  return (
    <Affix offsetTop={58}>
      <Col>
        <Clearfix height={10} />
        <Row type="flex" justify="center">
          <Input
            placeholder="Nhập tên bộ lọc..."
            style={{ width: '80%' }}
            suffix={<Icon type="search" />}
          />
        </Row>
        <Clearfix height={10} />

        <Menu
          forceSubMenuRender={true}
          {...props}
          mode="inline"
          defaultOpenKeys={defaultOpenKeys}
        >
          {menuSource.map(menu => (
            <SubMenu key={menu.stationKey} title={menu.stationName}>
              {menu.filterList.map(filterItem => {
                const isDisable = !filterItem.allowed

                return (
                  <Menu.Item key={filterItem._id} disabled={isDisable}>
                    <Row
                      type="flex"
                      justify="space-between"
                      align="middle"
                      onClick={() => {
                        if (isDisable) return
                        onClickMenuItem(filterItem._id, filterItem)
                      }}
                    >
                      <div style={{ flex: 1 }}>{filterItem.name}</div>
                      {isDisable && (
                        <Tooltip title="Một vài trạm đã bị ẩn do bạn không có quyền">
                          <Icon type="info-circle" theme="twoTone" />
                        </Tooltip>
                      )}
                      {!isDisable && (
                        <Popconfirm
                          title="Bạn có chắc chắn muốn xóa bộ lọc?"
                          onCancel={event => {
                            event.stopPropagation()
                          }}
                          onConfirm={event => {
                            event.stopPropagation()
                            onDeleteFilter(filterItem._id, filterItem)
                          }}
                        >
                          <Icon
                            onClick={event => event.stopPropagation()}
                            className="icon-delete"
                            type="close-circle"
                            theme="filled"
                          />
                        </Popconfirm>
                      )}
                    </Row>
                  </Menu.Item>
                )
              })}
            </SubMenu>
          ))}
        </Menu>
      </Col>
    </Affix>
  )
}

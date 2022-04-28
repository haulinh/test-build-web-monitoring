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
import _, { escapeRegExp, isEmpty } from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { i18n } from './constants'

const { SubMenu } = Menu

const MENU_WIDTH = 300

const { Search } = Input

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

  overflow-y: auto;
`

export const FilterList = ({
  list,
  onClickMenuItem,
  onDeleteFilter,
  onChangeSearch,
  highlightText,
  selectedKeys,
}) => {
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

  const getHighlightedText = text => {
    if (!highlightText) return text

    //Split text on highlight term, include term itself into parts, ignore case
    const parts = text.split(
      new RegExp(`(${escapeRegExp(highlightText)})`, 'gi')
    )

    return (
      <span>
        {parts.map((part, i) => {
          return (
            <span
              key={i}
              style={
                part.toLowerCase() === highlightText.toLowerCase()
                  ? { backgroundColor: 'yellow' }
                  : {}
              }
            >
              {part}
            </span>
          )
        })}
      </span>
    )
  }

  const defaultOpenKeys = Object.keys(filterGroupByStationType)
  const menuSource = Object.values(filterGroupByStationType)

  return (
    <Affix offsetTop={58}>
      <Col>
        <Clearfix height={10} />
        <Row type="flex" justify="center">
          <Search
            placeholder={i18n().menu.search}
            style={{ width: '80%' }}
            onChange={onChangeSearch}
          />
        </Row>
        <Clearfix height={10} />

        {!isEmpty(list) && (
          <Menu
            forceSubMenuRender
            mode="inline"
            defaultOpenKeys={defaultOpenKeys}
            selectedKeys={selectedKeys}
          >
            {menuSource.map(menu => (
              <SubMenu key={menu.stationKey} title={menu.stationName}>
                {menu.filterList.map(filterItem => {
                  const isDisable = !filterItem.allowed
                  return (
                    <Menu.Item key={filterItem._id} disabled={isDisable}>
                      <Tooltip title={filterItem.name} placement="right">
                        <Row
                          type="flex"
                          justify="space-between"
                          align="middle"
                          style={{ gap: 8 }}
                          onClick={() => {
                            if (isDisable) return
                            onClickMenuItem(filterItem._id, filterItem)
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {getHighlightedText(filterItem.name)}
                          </div>

                          <div>
                            {isDisable && (
                              <Tooltip
                                title={i18n().menu.tooltip}
                                overlayStyle={{ width: 150 }}
                              >
                                <Icon
                                  type="info-circle"
                                  theme="twoTone"
                                  style={{ justifySelf: 'end' }}
                                />
                              </Tooltip>
                            )}

                            <Popconfirm
                              title={i18n().menu.popupConfirm.title}
                              onCancel={event => {
                                event.stopPropagation()
                              }}
                              cancelText={i18n().button.cancel}
                              okText={i18n().button.ok}
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
                          </div>
                        </Row>
                      </Tooltip>
                    </Menu.Item>
                  )
                })}
              </SubMenu>
            ))}
          </Menu>
        )}
      </Col>
    </Affix>
  )
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Menu } from 'antd'
import styled from 'styled-components'

import { translate as t } from 'hoc/create-lang'
import maskGroupIcon from 'assets/svg-icons/Mask-Group.svg'

const PopoverWraper = styled.div`
  background: white;
  border-radius: 4px;
  padding: 10px 5px;
  .title {
    font-size: 16px;
    font-weight: 600;
    margin-left: 15px;
    margin-bottom: 6px;
  }
  .ant-menu {
    margin-right: 0px;
    a > div span {
      margin-right: 10px;
    }
  }
`

const i18n = {
  apps: t('apps.title'),
}

class AppList extends Component {
  render() {
    const { list } = this.props
    const renderOverlay = () => (
      <PopoverWraper>
        <div className="title">{i18n.apps}</div>
        <Menu>
          {list.map(item => (
            <Menu.Item key={item.text}>
              <a target="_blank" rel="noopener noreferrer" href={item.href}>
                <div>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              </a>
            </Menu.Item>
          ))}
        </Menu>
      </PopoverWraper>
    )

    return (
      <Dropdown overlay={renderOverlay()}>
        <img src={maskGroupIcon} alt="" />
      </Dropdown>
    )
  }
}

export default AppList

AppList.propTypes = {
  list: PropTypes.array.isRequired,
}

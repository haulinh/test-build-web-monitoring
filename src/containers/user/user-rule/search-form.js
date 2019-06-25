import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Select, Card, Avatar } from 'antd'
import { autobind } from 'core-decorators'
import swal from 'sweetalert2'
import _ from 'lodash'

import { translate } from 'hoc/create-lang'

const { Option } = Select
const { Meta } = Card

const i18n = {
  create: translate('addon.create'),
  error: translate("addon.error"),
  roleAssign: translate('userManager.list.roleAssign')
}

@autobind
export default class UserSearchForm extends React.PureComponent {
  static propTypes = {
    isGettingUsers: PropTypes.bool.isRequired,
    isGettingRoles: PropTypes.bool.isRequired,
    dataSourceUsers: PropTypes.array.isRequired,
    dataSourceRoles: PropTypes.array.isRequired,
  }

  render() {
    return (
      <Row type="flex" gutter={100} justify="space-around">
        <Col span={12}>
          <Select 
            style={{width: '100%'}} 
            loading={this.props.isGettingUsers}
            optionLabelProp="label"
          >
            {this.props.dataSourceUsers.map(user => (
              <Option value={user._id} label={user.email}>
                <Meta
                  avatar={<Avatar src={user.avatar}>T</Avatar>}
                  title={user.email}
                  description={`${user.lastName} ${user.firstName}`}
                />
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Select style={{width: '100%'}} loading={this.props.isGettingRoles}>
            {this.props.dataSourceRoles.map(role => (
              <Option value={role._id}>{role.name}</Option>
            ))}
          </Select>
        </Col>
      </Row>
    )
  }
}

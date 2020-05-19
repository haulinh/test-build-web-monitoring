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
  error: translate('addon.error'),
  roleAssign: translate('userManager.list.roleAssign')
}

const BACKGROUND_COLORS = [
  '#87d068',
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#00a2ae'
]

@autobind
export default class UserSearchForm extends React.PureComponent {
  static propTypes = {
    isGettingUsers: PropTypes.bool.isRequired,
    isGettingRoles: PropTypes.bool.isRequired,
    dataSourceUsers: PropTypes.array.isRequired,
    dataSourceRoles: PropTypes.array.isRequired,
    updateDataForSubmit: PropTypes.func.isRequired
  }

  render() {
    return (
      <Row type="flex" gutter={100} justify="space-around">
        <Col span={12}>
          <Select
            style={{ width: '100%' }}
            loading={this.props.isGettingUsers}
            optionLabelProp="label"
            onSelect={value =>
              this.props.updateDataForSubmit({
                name: 'selectedUserID',
                value: value
              })
            }
            showSearch
            optionFilterProp="search"
            filterOption={this.handleFilter}
          >
            {this.props.dataSourceUsers.map((user, index) => (
              <Option
                key={user._id}
                value={user._id}
                label={user.email}
                search={`${user.lastName} ${user.firstName}`}
              >
                <Meta
                  avatar={
                    <Avatar
                      // size="large"
                      icon="user"
                      src={user.avatar}
                      style={{
                        backgroundColor:
                          BACKGROUND_COLORS[index % BACKGROUND_COLORS.length],
                        marginTop: 5
                      }}
                    />
                  }
                  style={{ padding: '5px 0' }}
                  title={user.email}
                  description={`${user.lastName} ${user.firstName}`}
                />
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Select
            style={{ width: '100%' }}
            loading={this.props.isGettingRoles}
            onSelect={value =>
              this.props.updateDataForSubmit({
                name: 'selectedRoleID',
                value: value
              })
            }
            showSearch
            optionFilterProp="search"
            filterOption={this.handleFilter}
          >
            {this.props.dataSourceRoles.map(role => (
              <Option key={role._id} value={role._id} search={role.name}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    )
  }

  handleFilter(input, option) {
    let regex = new RegExp(input, 'gi')
    return regex.test(option.props.search)
  }
}

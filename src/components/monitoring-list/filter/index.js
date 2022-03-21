import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { Input } from 'antd'
import SelectAnt from 'components/elements/select-ant'
import SelectType from 'components/elements/select-station-type'
import Clearfix from 'components/elements/clearfix'
import update from 'react-addons-update'
import * as _ from 'lodash'
// import { GROUP_OPTIONS, ORDER_OPTIONS } from './options'
import { translate } from 'hoc/create-lang'

const MonitoringHeaderFilterWrapper = styled.div`
  display: flex;
  flex: 1;
`
@autobind
export default class MonitoringHeaderFilter extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
  }

  handleChange = (key, value) => {
    this.props.onChange(
      update(this.props.filter, {
        [key]: {
          $set:
            typeof value === 'object'
              ? _.get(value, 'target.value', null)
              : value,
        },
      })
    )
  }

  getPropsSelect(key, placeholder) {
    return {
      value: this.props.filter[key],
      onChange: event => this.handleChange(key, event),
      placeholder,
    }
  }

  timeOut = null

  debounceHandleChange = event => {
    clearTimeout(this.timeOut)
    event.persist()
    this.timeOut = setTimeout(() => {
      this.handleChange('search', event)
    }, 500)
  }

  render() {
    return (
      <MonitoringHeaderFilterWrapper>
        <div style={{ width: '33%' }}>
          <Input
            defaultValue={_.get(this.props, 'filter.search', '')}
            placeholder={translate('monitoring.keywordSearch')}
            // onChange={this.debounceHandleChange}
            onChange={this.debounceHandleChange}
          />
        </div>
        {/* <Clearfix width={8} />
        <SelectAnt
          style={{ width: '25%' }}
          //  options={GROUP_OPTIONS}
          options={[
            {
              value: 'group',
              name: translate('monitoring.group')
            },
            {
              value: 'ungroup',
              name: translate('monitoring.unGroup')
            }
          ]}
          {...this.getPropsSelect('group', translate('monitoring.selectGroup'))}
        /> */}
        <Clearfix width={8} />
        <SelectAnt
          style={{ width: '33%' }}
          //  options={ORDER_OPTIONS}
          options={[
            {
              value: 'name',
              name: translate('monitoring.sortByStationName'),
            },
            {
              value: 'number',
              name: translate('monitoring.sortByValues'),
            },
          ]}
          {...this.getPropsSelect('order', translate('monitoring.selectOrder'))}
        />
        <Clearfix width={8} />
        <SelectType
          style={{ width: '33%' }}
          placeholder="Select station type"
          isShowAll
          {...this.getPropsSelect(
            'stationType',
            translate('monitoring.selectStationType')
          )}
        />
      </MonitoringHeaderFilterWrapper>
    )
  }
}

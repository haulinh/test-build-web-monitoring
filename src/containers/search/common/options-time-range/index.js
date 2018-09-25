import React from 'react'
import { translate } from 'hoc/create-lang'
import { Select, DatePicker, Menu, Dropdown, Icon } from 'antd'
import moment from 'moment'

const options = [
  {key: 1, text: 'dataSearchFrom.options.byHours', value: 24},
  {key: 7, text: 'dataSearchFrom.options.byDay', value: 7},
  {key: 15, text: 'dataSearchFrom.options.byDay', value: 15},
  {key: 30, text: 'dataSearchFrom.options.byDay', value: 30}
]

'{} ngay'

export default class OptionsTimeRange extends React.Component {
  state = {
    open: true
  }

  menu = () => {
    return (
    <Menu key='1'>
      {
        options.map(({key, value, text}) => <Menu.Item key={key}>{translate(text, {value})}</Menu.Item>)
      }
      
      <Menu.SubMenu title="Chon ngay">
        <DatePicker.RangePicker
          renderExtraFooter={() => null}
          ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
          showTime
          format="YYYY/MM/DD HH:mm:ss"
          onChange={() => {}}
          />
      </Menu.SubMenu>
    </Menu>
    )
  }

  render() {
    return (
      <Dropdown
        style={{

        }}
         overlay={this.menu()}>
            <span>
            <span style={{ color: 'blue', minWidth: 80, borderWidth: 1, flex: 1, borderColor: '#b6b6b6' }}>
              1 ngay
            </span>
            <Icon type="down" />
          </span>
      </Dropdown>
    )
  }
}

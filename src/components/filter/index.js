import React from 'react'
import { Affix, Col as ColAnt, Menu, Input, Row, Icon } from 'antd'
import styled from 'styled-components'
import { Clearfix } from 'components/layouts/styles'
import CalculateApi from 'api/CalculateApi'
import PropTypes from 'prop-types'

const { SubMenu } = Menu

const MENU_WIDTH = 300

const Col = styled(ColAnt)`
  width: ${MENU_WIDTH}px;
  height: calc(100vh - 57px);
  background-color: rgb(244, 245, 247);
  .ant-menu-light {
    background: unset;
    overflow-y: auto;
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

const FilterList = ({ filterList }) => {
  console.log({ filterList })
  return (
    <Affix offsetTop={60}>
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

        <Menu mode="inline" defaultOpenKeys={['sub1', 'sub2']}>
          <SubMenu key="sub1" title="Nước thải sinh hoạt (Loại 1)">
            <Menu.Item key="1">Option 1</Menu.Item>
            <Menu.Item key="2">Option 1</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title="Nước thải sinh hoạt (Loại 2)">
            <Menu.Item key="1">Option 2</Menu.Item>
            <Menu.Item key="2">Option 3</Menu.Item>
          </SubMenu>
        </Menu>
      </Col>
    </Affix>
  )
}

export default FilterList

// export default class FilterList extends Component {
//   state = {
//     filterList: [],
//   }
//   componentDidMount = async () => {
//     const { moduleType } = this.props

//     try {
//       const response = await CalculateApi.getFilterList({ type: moduleType })
//       this.setState({ filterList: response })
//     } catch (error) {
//       console.error({ error })
//     }
//   }

//   getFilterList = () => {
//     const { filterList } = this.state

//     console.log({ filterList })
//   }
//   render() {
//     // const list = this.getFilterList()

//     return (

//     )
//   }
// }

// FilterList.propTypes = {
//   moduleType: PropTypes.string.isRequired,
// }

import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import Heading from 'components/elements/heading'
import { Collapse } from 'reactstrap'
import { Menu, Dropdown, Icon } from 'antd'
import TableList from './TableList'
import Chart from './Chart'
import slug from 'constants/slug'
import { withHighcharts } from 'react-jsx-highstock'
import Highcharts from 'highcharts'
import { translate } from 'hoc/create-lang'
import ReactGA from 'react-ga'
import * as _ from 'lodash'
import { selectMenu, changeOpenSubMenu } from 'redux/actions/themeAction'
import { connect } from 'react-redux'
// import { Clearfix } from '../../../elements'

ReactGA.initialize('UA-36620912-2')

const ChartSummaryWrapper = styled.div``

const ChartWrapper = styled.div`
  display: flex;
  flex: 1;
  box-shadow: 0 2px 10px 0 rgba(238, 238, 238, 0.5);
  background-color: #ffffff;
`
const TableWidth = styled.div`
  width: 300px;
  border-right: 1px solid rgba(241, 241, 241, 0.5);
  background-color: #fafbfb;
`
const ChartWidth = styled.div`
  flex: 1;
  padding: 16px 16px 0px;
`

const IconToggle = styled.span`
  transition: all 0.3s linear;
  transform: rotate(-0deg);
  display: inline-block;
  margin-right: 4px;
  font-size: 10px;
  position: relative;
  ${props => (props.isOpen ? `transform: rotate(90deg);` : ``)};
`

const TextSpan = styled.span`
  &:hover {
    cursor: pointer;
  }
`

const LinkSpan = styled.span`
  color: #000;
  &:hover {
    cursor: pointer;
  }
`

@withRouter
@connect(state => ({}), {
  selectMenu,
  changeOpenSubMenu,
})
@autobind
export class ChartSummary extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    totalStation: PropTypes.number,
    stationList: TableList.propTypes.data,
  }

  state = {
    currentItem: {},
    dataLines: {},
    isFirstLoad: true,
    isOpen: true,
    dataSearch: {},
  }

  handleChangeItem(e, item) {
    e.preventDefault()
    this.changeItem(item)
  }

  toggleOpen() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  changeItem(stationAuto) {
    this.setState({
      currentItem: stationAuto,
    })
  }

  rightChilren(value) {
    const stationType = value.slice(0, 1)[0].stationType
    const dropdown = (
      <Menu>
        <Menu.Item key="0">
          <Link
            onClick={() => {
              ReactGA.event({
                category: 'Dashboard',
                action: translate('dashboard.viewInMonitoring'),
              })
              this.props.selectMenu(slug.monitoring.base)
            }}
            to={slug.monitoring.base + `?Id=${stationType.key}`}
          >
            {translate('dashboard.viewInMonitoring')}
          </Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link
            onClick={() => {
              ReactGA.event({
                category: 'Dashboard',
                action: translate('dashboard.viewInMap'),
              })
              this.props.selectMenu(slug.map.base)
            }}
            to={slug.map.base + `?Id=${stationType.key}`}
          >
            {translate('dashboard.viewInMap')}
          </Link>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={dropdown} trigger={['click']}>
        <LinkSpan className="ant-dropdown-link">
          <Icon type="right" /> {translate('dashboard.viewMore')}
        </LinkSpan>
      </Dropdown>
    )
  }

  componentDidMount() {
    const item = _.head(_.orderBy(this.props.stationList, 'status'))
    if (!_.isEmpty(item)) {
      this.changeItem(item)
    }
  }

  componentDidUpdate(nextProps) {
    if (
      !_.isEqual(
        _.size(nextProps.stationList),
        _.size(this.props.stationList)
      ) &&
      _.head(this.props.stationList)
    ) {
      this.changeItem(_.head(_.orderBy(this.props.stationList, 'status')))
    }
  }

  renderSubTitle = () => {
    const good = _.get(_.countBy(this.props.stationList, 'status'), 'DATA_CONNECTED', 0)
    return <div>&nbsp; {`(${good}/${this.props.totalStation})`}</div>
  }

  render() {
    if (this.props.stationList.length > 0)
      return (
        <ChartSummaryWrapper>
          <Heading
            width="auto"
            rightChildren={this.rightChilren(this.props.stationList)}
          >
            <TextSpan onClick={this.toggleOpen}>{this.props.title}</TextSpan>
            {this.renderSubTitle()}
            <IconToggle style={{ marginLeft: 4 }} isOpen={this.state.isOpen}>
              {' '}
              <Icon type="caret-right" />
            </IconToggle>
          </Heading>
          <Collapse isOpen={this.state.isOpen}>
            <ChartWrapper>
              <TableWidth>
                <TableList
                  filter={this.state.filter}
                  filterType={this.state.filterType}
                  onFilter={this.handleFilter}
                  onChangeItem={this.handleChangeItem.bind(this)}
                  currentItem={this.state.currentItem}
                  data={this.props.stationList}
                />
              </TableWidth>
              <ChartWidth>
                {/* <Chart dataLines={this.state.dataLines} dataSearch={this.state.dataSearch}/> */}
                <Chart station={this.state.currentItem} />
              </ChartWidth>
            </ChartWrapper>
          </Collapse>
        </ChartSummaryWrapper>
      )
    return null
  }
}

export default withHighcharts(ChartSummary, Highcharts)

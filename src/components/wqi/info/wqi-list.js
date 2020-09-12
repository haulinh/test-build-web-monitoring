import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Typography, Input, Skeleton, Empty, Button } from 'antd'
import styled from 'styled-components'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date.js'
import slug from 'constants/slug'
import { Link } from 'react-router-dom'
import { translate } from 'hoc/create-lang'

const { Text } = Typography

const i18n = {
  search: translate('addon.search'),
}

const WrapperView = styled.div`
  display: flex;
  flex-direction: column;
  /* border-radius: 4px;
  border: 1px solid #f2f2f2; */
  margin: 4px 0px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  .item-wqi {
    display: flex;
    padding: 8px 0px;
    border-bottom: 1px solid #f2f2f2;
    justify-content: space-between;
  }

  .ant-empty {
    height: 100%;
    .ant-empty-image {
      margin-top: 50%;
    }
  }
`

const RenderValueWqi = ({ valueAqi, wqiLevel }) => {
  const level = _.find(wqiLevel, ({ min, max }) => {
    return (
      _.inRange(valueAqi, min, max) ||
      valueAqi === max ||
      (min < valueAqi && !max) ||
      (max > valueAqi && !min)
    )
  })
  const backgroundColor = _.get(level, 'backgroundColor', null)
  const colorFont = _.get(level, 'color', null)
  const colorBorder = '#FFFFFF'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor || 'yellow',
        padding: `4px`,
        borderRadius: '50%',
        border: `2px solid ${colorBorder}`,
        width: 45,
        height: 45,
        marginBottom: 6,
      }}
    >
      <div>
        <span
          style={{
            fontSize: `16px`,
            color: colorFont,
            fontWeight: 'bold',
          }}
        >
          {valueAqi}
        </span>
      </div>
    </div>
  )
}

export default class WQIList extends React.PureComponent {
  static propTypes = {
    wqiLList: PropTypes.array,
    wqiLevel: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSoure: props.wqiList,
      selectStationKey: null,
    }
  }

  componentDidUpdate = prevProps => {
    if (prevProps.wqiList !== this.props.wqiList) {
      this.setState({
        dataSoure: this.props.wqiList,
      })
    }
  }

  hanldeOnchange = e => {
    const value = e.target.value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    const dataSearch = _.filter(this.props.wqiList, item => {
      let name = _.get(item, 'name', '')
      name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      return _.toUpper(name.trim()).search(_.toUpper(value.trim())) >= 0
    })

    this.setState({
      dataSoure: dataSearch,
    })
  }

  render() {
    const isEmpty = this.state.dataSoure && this.state.dataSoure.length <= 0

    return (
      <React.Fragment>
        <Input
          style={{ marginTop: 8 }}
          placeholder={i18n.search}
          onChange={this.hanldeOnchange}
        />
        <WrapperView>
          {!this.state.dataSoure && <Skeleton />}
          {isEmpty ? (
            <Empty description={translate('empty.wqi.description')}>
              <Link to={slug.advance.enableAqiWqi}>
                <Button type="primary">{translate('empty.wqi.action')}</Button>
              </Link>
            </Empty>
          ) : (
            _.map(this.state.dataSoure, (item, index) => {
              const key = _.get(item, 'key')
              const name = _.get(item, 'name', '')
              const time = _.get(item, 'time', '')
              const valueAqi = _.get(item, 'wqiDay')
              const mapLocation = _.get(item, 'mapLocation')
              return (
                <Row
                  style={{ cursor: 'pointer' }}
                  key={index}
                  onClick={() => {
                    this.setState({
                      selectStationKey: key,
                    })
                    this.props.onSelect({
                      key: key,
                      mapLocation: mapLocation
                        ? {
                            lat: parseFloat(_.get(mapLocation, 'lat', 0)),
                            lng: parseFloat(_.get(mapLocation, 'long', 0)),
                          }
                        : undefined,
                    })
                  }}
                >
                  <Col>
                    <div className="item-wqi">
                      <div>
                        <div>
                          <Text
                            style={{
                              fontSize: 16,
                              color:
                                this.state.selectStationKey === key
                                  ? '#1890FF'
                                  : 'unset',
                            }}
                            strong
                          >
                            {name}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary">
                            {moment(time).format(DD_MM_YYYY_HH_MM)}
                          </Text>
                        </div>
                      </div>
                      <div>
                        <RenderValueWqi
                          wqiLevel={this.props.wqiLevel}
                          valueAqi={valueAqi}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              )
            })
          )}
        </WrapperView>
      </React.Fragment>
    )
  }
}

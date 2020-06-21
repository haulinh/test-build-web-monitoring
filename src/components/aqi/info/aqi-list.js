import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button, Typography, Input, Skeleton } from 'antd'
import styled from 'styled-components'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date.js'
import { translate } from 'hoc/create-lang'
import AqiListStatus from './aqi-list-status'
import Clearfix from 'components/elements/clearfix'

const { Text } = Typography

const i18n = {
  search: translate('addon.search'),
}

const WrapperView = styled.div`
  display: flex;
  flex-direction: column;

  .item-aqi {
    display: flex;
    padding: 8px 0px;
    border-bottom: 1px solid #f2f2f2;
    justify-content: space-between;
  }
`

const RenderValueAqi = ({ valueAqi, aqiLevel }) => {
  const level = _.find(aqiLevel, ({ min, max }) => {
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

export default class AQIList extends React.PureComponent {
  static propTypes = {
    aqiList: PropTypes.array,
    aqiLevel: PropTypes.array,
    locale: PropTypes.string,
    onChangeLocale: PropTypes.func,
    listConfigAQI: PropTypes.array,
  }

  state = {
    selectStationKey: null,
  }

  componentDidUpdate = prevProps => {
    if (prevProps.aqiList !== this.props.aqiList) {
      this.setState({
        dataSoure: this.props.aqiList,
      })
    }
  }

  hanldeOnchange = e => {
    const value = e.target.value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    const dataSearch = _.filter(this.props.aqiList, item => {
      let name = _.get(item, 'name', '')
      name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      return _.toUpper(name.trim()).search(_.toUpper(value.trim())) >= 0
    })

    // console.log(dataSearch, "---dataSearch");
    this.setState({
      dataSoure: dataSearch,
    })
    // => objects for ['fred']
  }

  render() {
    console.log(this.props.aqiList, '--listConfigAQI--')
    return (
      <WrapperView>
        {this.props.listConfigAQI.length > 0 && (
          <Row gutter={8}>
            {_.map(this.props.listConfigAQI, item => {
              const spanCol = this.props.listConfigAQI.length > 1 ? 12 : 24
              return (
                <Col span={spanCol}>
                  <Button
                    onClick={() => {
                      if (this.props.locale === item.key) {
                        return
                      }
                      this.setState({
                        dataSoure: null,
                      })
                      this.props.onChangeLocale(item.key)
                    }}
                    block
                    type={
                      this.props.locale === item.key ? 'primary' : 'default'
                    }
                  >
                    {item.name}
                  </Button>
                </Col>
              )
            })}
          </Row>
        )}

        <Clearfix height={8} />
        <Input placeholder={i18n.search} onChange={this.hanldeOnchange} />
        {!this.props.aqiList && <Skeleton />}
        {_.map(this.props.aqiList, (item, index) => {
          const key = _.get(item, 'key')
          const name = _.get(item, 'name', '')
          const time = _.get(item, 'time', '')
          const valueAqi = _.get(item, 'aqiDay')
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
                <div className="item-aqi">
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
                    <RenderValueAqi
                      aqiLevel={this.props.aqiLevel}
                      valueAqi={valueAqi}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          )
        })}
        {this.props.aqiList && this.props.aqiList.length === 0 && (
          <AqiListStatus />
        )}
      </WrapperView>
    )
  }
}

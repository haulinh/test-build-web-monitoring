import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import slug from 'constants/slug'

import * as _ from 'lodash'
import { Table, Button, Spin, Checkbox, message } from 'antd'

import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { PRIMARY } from '../../../themes/color'
import { Clearfix } from 'containers/map/map-default/components/box-analytic-list/style'
import { getListConfigAqi, postListConfigAqi } from 'api/CategoryApi'
import { translate } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'

const Breadcrumb = createBreadcrumb()

const Wrapper = styled.div``

const i18n = {
  pageName: translate('aqiConfigCalculation.pageName'),
  phuongPhapTinh: translate('aqiConfigCalculation.phuongPhapTinh'),
  cauHinh: translate('aqiConfigCalculation.cauHinh'),
  taiLieu: translate('aqiConfigCalculation.taiLieu'),
  config: translate('aqiConfigCalculation.config'),
  view: translate('aqiConfigCalculation.view'),
  save: translate('addon.save'),
  updateSuccess: translate('addon.onSave.update.success'),
  updateError: translate('addon.onSave.update.error'),
}

export default class ListAQI extends React.Component {
  static propTypes = {
    goConfig: PropTypes.func,
  }
  state = {
    dataSource: [],
    isLoaded: false,
    isEdit: false,
    isLoadingButuon: false,
  }
  componentDidMount = async () => {
    getListConfigAqi()
      .then(retult => {
        const data = _.get(retult, 'data.value', [])
        // console.log(data, '--data')
        this.setState({
          dataSource: data,
          isLoaded: true,
        })
      })
      .catch(ex => {
        this.setState({
          dataSource: [],
          isLoaded: true,
        })
        console.log(ex, '--ex--')
      })
  }

  hanldeOnChange = (value, record) => {
    const dataTemp = this.state.dataSource
    const index = _.findIndex(this.state.dataSource, item => {
      return item.key === record.key
    })
    dataTemp[index] = {
      ...record,
      activated: value,
    }
    this.setState({
      dataSource: dataTemp,
      isEdit: true,
    })
  }

  hanldeSubmit = () => {
    this.setState({
      isLoadingButuon: true,
    })
    postListConfigAqi(this.state.dataSource)
      .then(result => {
        console.log(result, '--result--')
        if (result.success) {
          message.success(i18n.updateSuccess)
        } else {
          message.error(i18n.updateError)
        }
      })
      .catch(ex => {
        // console.log(ex, "---ex--")
        message.error(i18n.updateError)
      })
      .finally(() => {
        this.setState({
          isLoadingButuon: false,
        })
      })
  }

  getColumn = [
    {
      title: i18n.phuongPhapTinh,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <Checkbox
            defaultChecked={_.get(record, 'activated')}
            onChange={e => {
              this.hanldeOnChange(e.target.checked, record)
            }}
          >
            {text}
          </Checkbox>
        )
      },
    },
    {
      title: i18n.cauHinh,
      render: record => {
        return (
          <Link to={slug.aqi.configWithKey + '/' + record.key}>
            {i18n.config}
          </Link>
          // <a style={{ color: PRIMARY }} onClick={() => this.goConfig(record)}>

          // </a>
        )
      },
    },
    {
      title: i18n.taiLieu,
      dataIndex: 'downloadUrl',
      key: 'downloadUrl',
      align: 'center',
      render: text => {
        if (text) {
          return (
            <a
              style={{ color: PRIMARY }}
              onClick={() => {
                window.open(text)
              }}
            >
              {i18n.view}
            </a>
          )
        } else {
          return null
        }
      },
    },
  ]

  goConfig = ({ key, name }) => {
    // console.log('run goConfig ', key)
    if (this.props.goConfig) {
      this.props.goConfig({ key, name })
    }
  }
  render() {
    return (
      <PageContainer isLoading={this.state.isLoading}>
        <Breadcrumb
          items={[
            {
              id: '1',
              name: i18n.pageName,
            },
          ]}
        />
        <Wrapper>
          <Spin spinning={!this.state.isLoaded}>
            <Table
              size="middle"
              dataSource={this.state.dataSource}
              columns={this.getColumn}
              pagination={false}
              bordered={true}
            />
          </Spin>
          <Clearfix height={16} />
          <Button
            block
            type="primary"
            loading={this.state.isLoadingButuon}
            disabled={!this.state.isEdit}
            onClick={this.hanldeSubmit}
          >
            {i18n.save}
          </Button>
        </Wrapper>
      </PageContainer>
    )
  }
}

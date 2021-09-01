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
import { getListConfigWqi, postListConfigWqi } from 'api/CategoryApi'
import { translate } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { getConfigApi } from 'config'

const Breadcrumb = createBreadcrumb()

const Wrapper = styled.div`
  padding-top: 16px;
`

const i18n = {
  pageName: translate('wqiConfigCalculation.pageName'),
  phuongPhapTinh: translate('wqiConfigCalculation.phuongPhapTinh'),
  cauHinh: translate('wqiConfigCalculation.cauHinh'),
  taiLieu: translate('wqiConfigCalculation.taiLieu'),
  config: translate('wqiConfigCalculation.config'),
  view: translate('wqiConfigCalculation.view'),
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
    getListConfigWqi()
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
    postListConfigWqi(this.state.dataSource)
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
          <Link to={slug.advance.configWqi + '/' + record.key}>
            {i18n.config}
          </Link>
        )
      },
    },
    {
      title: i18n.taiLieu,
      dataIndex: 'downloadUrl',
      key: 'downloadUrl',
      align: 'center',
      render: (text, record) => {
        const file = `${getConfigApi().calculate}/wqi-${record.key}.pdf`
        if (text) {
          return (
            <a
              style={{ color: PRIMARY }}
              onClick={() => {
                window.open(file)
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

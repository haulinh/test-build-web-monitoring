import React from 'react'
import PropTypes from 'prop-types'
import {Form, Checkbox, Button, InputNumber } from 'antd'
import { Link } from 'react-router-dom'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { autobind } from 'core-decorators'
import Breadcrumb from 'containers/auth/breadcrumb'
import createLanguage, { langPropTypes } from 'hoc/create-lang'
import StationAutoApi from 'api/StationAuto'
import DynamicTable from 'components/elements/dynamic-table'
import * as _ from 'lodash'

const FormItem = Form.Item

@createLanguage
@autobind
export default class ConfigStation extends React.Component {
  static propTypes = {
    pagination: PropTypes.object,
    pathImg: PropTypes.string,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onDeleteItem: PropTypes.func,
    fetchData: PropTypes.func,
    lang: langPropTypes
  }
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      dataStations: [],
      iconLoading: false,
      dataStatus:[],
    }
  }
  async componentWillMount() {
    const MAX_VALUE = 99999
    let stations = await StationAutoApi.getStationAutos(
      { itemPerPage: MAX_VALUE },
      {}
    )
    console.log(stations)
    this.setState({
      isLoaded: true,
      dataStations: stations && stations.data ? stations.data : [],
    })
  }
   onChangeCheckbox (value){
    var nameStatus = value.target.name
    var status = value.target.checked
    this.setState({
      dataStatus: _.assign({}, {nameStatus: status}),
    })
    console.log(nameStatus)
    console.log(status)
  }
  saveData(id, data){
   // this.setState({iconLoading:true})
    console.log(id)
    console.log(data)
  }
  getHead() {
    const { lang: { t } } = this.props
    return [
      { content: '#', width: 2 },
      { content: t('userManager.roleAssign.name'), width: 15 },
      { content: t('configStation.warningStatus'), width: 10 },
      { content: t('configStation.showStation'), width: 10 },
      { content: t('configStation.numericalOrder'), width: 3 },
      { content: t('configStation.action'), width: 2 },
    ]
  }
  getRows() {
    const { lang: { t } } = this.props
    return this.state.dataStations.map((row, index) => [
      {content: index + 1},
      {content: row.name},
      {content: <Checkbox checked={
        row.options && row.options !== undefined &&
        row.options.warning && row.options.warning !== undefined &&
        row.options.warning.allowed && row.options.warning.allowed !== undefined
        ? row.options.warning.allowed: ''
      } 
        name = "warning"
        onChange = {this.onChangeCheckbox}
         />},
      {content:<Checkbox value = {true}
       name = "showStation"
       onChange = {this.onChangeCheckbox} />},
      {content: <InputNumber
        size="small"
        min={1}
        max={10000}
      />},
      {content: (
        <span>
          <Button type="primary" loading={this.state.iconLoading } onClick={()=> this.saveData(row._id, this.state.dataStatus)}>
             Update
          </Button>
        </span>
      )}
    ])

  }
  render() {
    const { lang: { t } } = this.props
    return (
        <PageContainer>
            <Breadcrumb
              items={[
                {
                  id: 'configStation',
                  name: t('profileUser.configStation')
                }
              ]}
            />
            <DynamicTable
              loading={!this.state.isLoaded}
              rows={this.getRows()}
              head={this.getHead()}
              dataSource={this.state.dataStations}
              pagination={{
                pageSize: 1000,
                hideOnSinglePage: true
              }}
            />
        </PageContainer>
    )
  }
}

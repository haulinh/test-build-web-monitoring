import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import CategoryApi from 'api/CategoryApi'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import slug from 'constants/slug'
import { autobind } from 'core-decorators'
import Breadcrumb from '../breadcrumb'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'
import styled from 'styled-components'
import DynamicTable from 'components/elements/dynamic-table'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'
import CameraItem from 'components/elements/camera-item'
import Clearfix from 'components/elements/clearfix'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;

  // .ant-collapse-item {
  // width: 50%;
  // }
  .card {
    width: 100.5%;
  }

  .ant-collapse-header {
    text-align: center;
  }
`

@protectRole(ROLE.MONITORING.CAMERA)
@createLanguageHoc
@autobind
export default class CameraDetail extends PureComponent {
  static propTypes = {}

  constructor(props) {
    super(props)
    this.state = {
      rtspUrl: '',
      name: '',
      isLoaded: false
    }
  }

  componentWillMount() {
    const key = this.props.match.params.key
    const name = this.props.match.params.name
    if (key)
      this.setState({
        isLoaded: true,
        rtspUrl: decodeURIComponent(key),
        name: decodeURIComponent(name)
      })
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb
          items={[
            'list',
            {
              id: 'detail',
              name: this.state.isLoaded ? this.state.name : 'detail'
            }
          ]}
        />
        {this.state.rtspUrl != '' && (
          <CameraItem
            isFullWidth
            name={this.state.name}
            rtspUrl={this.state.rtspUrl}
            index={1}
          />
        )}
      </PageContainer>
    )
  }
}

import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { Icon } from 'antd'
import { autobind } from 'core-decorators'
import styled from 'styled-components';
import { translate } from "hoc/create-lang";


const lang = {
  header: translate("pageInfo.header"),
  body1: translate("pageInfo.body1"),
  body2: translate("pageInfo.body2"),
}

@autobind
export default class PageInfo extends React.PureComponent {
  render() {
    return (
      <PageContainer>
        <div style={{height: '80vh' }}>

        <div style={{fontSize: 42, marginTop: 42, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Icon type="info-circle" theme="twoTone" /> 
        <div style={{width: 8}} /> <span style={{fontSize: 20}}>{lang.header}</span>
        </div>
        <div style={{height: 24}} />
       <div style={{width: 550, margin: 'auto'}}>
       <div>{lang.body1}</div>
        <div>{lang.body2}</div>
       </div>
        </div>

      </PageContainer>
    )
  }
}

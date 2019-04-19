/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
import styled from 'styled-components'
import {Row, Col, InputNumber} from 'antd';
/* user import */
import { translate } from 'hoc/create-lang'

const i18n = {
  totalBottles: translate('monitoring.moreContent.sampling.content.config.sttotalBottlest'),
  controlTagName: translate('monitoring.moreContent.sampling.content.config.controlTagName'),
  timeToTakeOneBottle: translate('monitoring.moreContent.sampling.content.config.timeToTakeOneBottle'),
}

const RowWrapper = styled(Row)`
  margin-bottom: 30px;
`

@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  state = {}

  render(){
    return (
      <div style={{padding: 8}}>
        <Row>
          <Col>
            <RowWrapper>
              <Row>{i18n.totalBottles}</Row>
              <Row>
                <InputNumber defaultValue="12" style={{width: '100%'}}/>
              </Row>
            </RowWrapper>
            <RowWrapper>
              <Row>{i18n.controlTagName}</Row>
              <Row>
                <InputNumber defaultValue="12" style={{width: '100%'}}/>
              </Row>
            </RowWrapper>
            <RowWrapper>
              <Row>{i18n.timeToTakeOneBottle}</Row>
              <Row>
                <InputNumber defaultValue="15" style={{width: '100%'}}/>
              </Row>
            </RowWrapper>
          </Col>
        </Row>
      </div>
    )
  }
}


/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
import styled from 'styled-components'
import {Row, Col, InputNumber, Button} from 'antd';
/* user import */
import { translate } from 'hoc/create-lang'

const i18n = {
  totalBottles: translate('monitoring.moreContent.sampling.content.config.totalBottles'),
  controlTagName: translate('monitoring.moreContent.sampling.content.config.controlTagName'),
  timeToTakeOneBottle: translate('monitoring.moreContent.sampling.content.config.timeToTakeOneBottle'),
  save: translate('monitoring.moreContent.sampling.content.config.save'),
}

const RowWrapper = styled(Row)`
  margin-bottom: 30px;
`

@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  state = {
    isSaving: false
  }

  handleSave = () => {
    this.setState({isSaving: true})
    setTimeout(() => {
      this.setState({isSaving: false})
    }, 1000)
  }

  render(){
    const {isSaving} = this.state
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
            <RowWrapper>
              <Button block type="primary" loading={isSaving} onClick={this.handleSave}>
                {i18n.save}
              </Button>
            </RowWrapper>
          </Col>
        </Row>
      </div>
    )
  }
}


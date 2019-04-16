/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components'
import {withRouter} from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

/* user import */
import { translate } from 'hoc/create-lang'
import MoreCamera from './camera';
import MoreChart from './chart';
import MoreImage from './image';
import MoreMap from './map';
import MoreRating from './rating';
import MoreSampling from './sampling';
import MoreStation from './station';


const MoreContentWrapper = styled.div`
  background-color: red;
  height: auto;
  transition: all 1s ease
`


@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool,
    panel: PropTypes.string
  }

  static defaultProps = {
    isActive: false,
    panel: ''
  }

  state = {}


  render(){
    if (!this.props.isActive) return null;
    return ((
      <MoreContentWrapper>  
        <MoreCamera isActive={this.props.panel === "camera"}/>
        <MoreChart isActive={this.props.panel === "chart"}/>
        <MoreImage isActive={this.props.panel === "image"}/>
        <MoreMap isActive={this.props.panel === "map"}/>
        <MoreRating isActive={this.props.panel === "rating"}/>
        <MoreSampling isActive={this.props.panel === "sampling"}/>
        <MoreStation isActive={this.props.panel === "station"}/>
      </MoreContentWrapper>
    ))
  }
}
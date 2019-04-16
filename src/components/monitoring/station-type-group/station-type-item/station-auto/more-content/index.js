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
.example-enter {
  opacity: 0.01;
  height: 0px;
}

.example-enter.example-enter-active {
  opacity: 1;
  height: auto;
  transition: all 2s ease-in;
}

.example-leave {
  opacity: 1;
  height: auto;
}

.example-leave.example-leave-active {
  opacity: 0.01;
  height: 0px;
  transition: all 2s ease-in;
}
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
        <ReactCSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={400}
          transitionLeaveTimeout={400}
        >
          { this.props.panel === "camera"   && <MoreCamera/> }
          { this.props.panel === "chart"    && <MoreChart/> }
          { this.props.panel === "image"    && <MoreImage/> }
          { this.props.panel === "map"      && <MoreMap/> }
          { this.props.panel === "rating"   && <MoreRating/> }
          { this.props.panel === "sampling" && <MoreSampling/> }
          { this.props.panel === "station"  && <MoreStation/> }
        </ReactCSSTransitionGroup>
      </MoreContentWrapper>
    ))
  }
}
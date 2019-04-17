import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'

import { translate } from 'hoc/create-lang'

@withRouter
export default class ChartMoreInfo extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  state = {}


  render(){
    return <div style={{backgroundColor: 'blue', height:'300px'}}>Chart panel...</div>
  }
}
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'

import { translate } from 'hoc/create-lang'

@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  state = {}


  render(){
    if (!this.props.isActive) return null
    return <div>Station Info panel...</div>
  }
}
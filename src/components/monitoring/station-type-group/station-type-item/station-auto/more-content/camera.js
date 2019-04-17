/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
/* user import */
import { translate } from 'hoc/create-lang'

@withRouter
export default class CameraMoreInfo extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool,
  }

  static defaultProps = {}

  state = {}


  render(){
    return <div style={{backgroundColor: 'yellow'}}>Camera panel...</div>
  }
}
// @flow
import React, { PureComponent } from 'react'
import {
  AkCreateDrawer,
  AkNavigationItem,
  AkNavigationItemGroup
} from '@atlaskit/navigation'
import PropTypes from 'prop-types'
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left'
import Icon from 'themes/icon'
// import slug from 'constants/slug'
import { WrapperLinkComponent } from 'utils/sidebarNavigation'
import swal from 'sweetalert2'
import { autobind } from 'core-decorators'

@autobind
export default class DocumentDrawer extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool
  }

  static defaultProps = {
    isOpen: false
  }

  handleClick(e) {
    if (!this.props.href){
      e.preventDefault()
      swal({
        type: 'info',
        title: 'App ' + this.props.children + ' is building',
        text: 'We will send newsletter when we complete'
      })
    }
  }

  render() {
    return (
      <AkCreateDrawer
        heading={null}
        key="drawler"
        backIcon={<ArrowLeftIcon label="" />}
        {...this.props}
      >
        <div key="drawler" style={{ marginTop: -64 }}>
          <AkNavigationItemGroup title="Documents helpdesk">
            <AkNavigationItem
              // href={slug.measuring.create}
              linkComponent={WrapperLinkComponent}
              onClick={this.handleClick}
              icon={Icon.car}
              text="Guide install 1"
            />
            <AkNavigationItem
              // href={slug.measuring.create}
              linkComponent={WrapperLinkComponent}
              onClick={this.handleClick}
              icon={Icon.car}
              text="Guide install 2"
            />
          </AkNavigationItemGroup>
        </div>
      </AkCreateDrawer>
    )
  }
}

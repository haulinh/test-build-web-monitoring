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
import createLang from 'hoc/create-lang'

@createLang
@autobind
export default class DocumentDrawer extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool
  }

  static defaultProps = {
    isOpen: false
  }

  handleClick(e) {
    console.log(this.props)
    if (!this.props.href){
      e.preventDefault()
      swal({
        type: 'info',
        title: this.props.lang.t('documents.develop.title'),
        text: this.props.lang.t('documents.develop.process')
      })
    }
  }

  render() {
    const { t } = this.props.lang
    return (
      <AkCreateDrawer
        heading={null}
        key="drawler"
        backIcon={<ArrowLeftIcon label="" />}
        {...this.props}
      >
        <div key="drawler" style={{ marginTop: -64 }}>
          <AkNavigationItemGroup title={t('documents.label')}>
            <AkNavigationItem
              linkComponent={WrapperLinkComponent}
              onClick={this.handleClick}
              icon={Icon.car}
              text={t('documents.guide1')}
            />
            <AkNavigationItem
              linkComponent={WrapperLinkComponent}
              onClick={this.handleClick}
              icon={Icon.car}
              text={t('documents.guide2')}
            />
          </AkNavigationItemGroup>
        </div>
      </AkCreateDrawer>
    )
  }
}

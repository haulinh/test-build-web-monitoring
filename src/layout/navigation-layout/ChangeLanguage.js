import React from 'react'
import AkDropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu'
import { AkGlobalItem } from '@atlaskit/navigation'
import styled from 'styled-components'
import { connect } from 'react-redux'
// import FlagIcon from 'react-flag-kit/lib/CDNFlagIcon.js'
import { FlagIcon } from 'react-flag-kit'
import { autobind } from 'core-decorators'
import createLang from 'hoc/create-lang'
import { putProfile } from 'api/AuthApi'
import { get } from 'lodash'

const FlagWrapper = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DropdownItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: safe;
`
const LabelWrapper = styled.div`
  padding-left: 8px;
`

@createLang
@autobind
@connect(state => ({
  userId: get(state, 'auth.userInfo._id'),
  listLanguage: get(state, 'language.listLanguage'),
}))
export default class ChangeLanguage extends React.Component {
  async selectLanguage(e, item) {
    if (e) e.preventDefault()
    const { userId, lang } = this.props
    lang.changeLanguage(item.locale)
    await putProfile(userId, { preferredLanguage: item.locale })
    window.location = window.location.pathname
  }

  getFlag() {
    const language = this.props.listLanguage.find(
      lang => lang.locale === this.props.lang.locale
    )
    if (!language) return
    return language.flag
  }

  render() {
    return (
      <AkDropdownMenu
        appearance="tall"
        position="right bottom"
        trigger={
          <AkGlobalItem>
            <FlagWrapper>
              <FlagIcon code={this.getFlag()} size={25} />
            </FlagWrapper>
          </AkGlobalItem>
        }
      >
        <DropdownItemGroup title={`change language`}>
          {this.props.listLanguage.map((item, index) => {
            if (item.enable) {
              return (
                <DropdownItem
                  key={index}
                  onClick={e => this.selectLanguage(e, item)}
                >
                  <DropdownItemWrapper>
                    <FlagIcon code={item.flag} size={25} />
                    <LabelWrapper>
                      <span>{item.name}</span>{' '}
                    </LabelWrapper>
                  </DropdownItemWrapper>
                </DropdownItem>
              )
            } else return null
          })}
        </DropdownItemGroup>
      </AkDropdownMenu>
    )
  }
}

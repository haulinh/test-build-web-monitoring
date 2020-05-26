import React from 'react'
import styled from 'styled-components'
import { connectAutoDispatch } from 'redux/connect'
import { fetchUserMe } from 'redux/actions/authAction'
import LoaderCircle from 'components/elements/loader-circle'
import { withRouter } from 'react-router-dom'
import Errors from 'constants/errors'
import slug from 'constants/slug'
import Intercom from 'react-intercom'

const StyledLoading = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function createProtectedAuth(Component) {
  @withRouter
  @connectAutoDispatch(
    state => ({
      authMe: state.auth.userInfo,
      isAuthenticated: state.auth.isAuthenticated,
      isPending: state.auth.isPending,
      isFail: state.auth.isFail
    }),
    { fetchUserMe }
  )
  class ProtectedAuth extends React.Component {
    async componentWillMount() {
      if (!this.props.isAuthenticated) {
        const auth = await this.props.fetchUserMe()
        if (!auth) return this.props.history.push('/login')
        console.log(auth, '---auth')
        if (auth.error === true) {
          if (auth.message === Errors.ORGANIZATION_EXPIRED) {
            // this.props.history.push(slug.user.expLicense)
            this.props.history.push(
              `${slug.user.expLicense}?expDate=${auth.userMessage}`
            )
          } else {
            this.props.history.push('/login')
          }
        }
      }
    }

    render() {
      if (this.props.isAuthenticated && !this.props.isPending) {
        const user = {
          user_id: this.props.authMe._id,
          email: this.props.authMe.email,
          name: this.props.authMe.firstName + ' ' + this.props.authMe.lastName
        }

        console.log(window.config.intercomID)

        return (
          <div style={{ height: '100%' }} className="app">
            <Component {...this.props} />
            <Intercom appID={window.config.intercomID} {...user} />
          </div>
        )
      }
      if (this.props.isPending)
        return (
          <StyledLoading>
            <LoaderCircle /> &nbsp; Loading ...
          </StyledLoading>
        )
      return null
    }
  }

  return ProtectedAuth
}

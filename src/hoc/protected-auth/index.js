import React from 'react'
import { connectAutoDispatch } from 'redux/connect'
import { fetchUserMe } from 'redux/actions/authAction'
import { withRouter } from 'react-router-dom'
import Errors from 'constants/errors'
import slug from 'constants/slug'
import SplashLoading from 'components/splash'

export default function createProtectedAuth(Component) {
  @withRouter
  @connectAutoDispatch(
    state => ({
      authMe: state.auth.userInfo,
      isAuthenticated: state.auth.isAuthenticated,
      isPending: state.auth.isPending,
      isFail: state.auth.isFail,
      isLoading: state.language.isLoading,
    }),
    { fetchUserMe }
  )
  class ProtectedAuth extends React.Component {
    async componentWillMount() {
      if (!this.props.isAuthenticated) {
        const auth = await this.props.fetchUserMe()
        if (!auth) return this.props.history.push('/login')
        // console.log(auth, '---auth')
        if (auth.error === true) {
          if (auth.message === Errors.ORGANIZATION_EXPIRED) {
            // this.props.history.push(slug.user.expLicense)
            this.props.history.push(
              `${slug.user.expLicense}?expDate=${auth['0'].expDate}`
            )
          } else {
            this.props.history.push('/login')
          }
        }
      }
    }

    render() {
      if (
        this.props.isAuthenticated &&
        !this.props.isPending &&
        !this.props.isLoading
      ) {
        return (
          <div style={{ height: '100%' }} className="app">
            <Component {...this.props} />
          </div>
        )
      }
      if (this.props.isPending || this.props.isLoading) return <SplashLoading />
      return null
    }
  }

  return ProtectedAuth
}

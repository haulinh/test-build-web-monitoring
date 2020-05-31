import React from 'react'
import Layout from 'layout/default-sidebar-layout'
import { getApps } from 'config'

export default class IncidentAppContainer extends React.Component {
  render() {
    return (
      <Layout>
        <iframe
          style={{ width: '100%', height: '100vh' }}
          frameBorder={0}
          src={getApps().incidents}
        >
        </iframe>
      </Layout>
    )
  }
}

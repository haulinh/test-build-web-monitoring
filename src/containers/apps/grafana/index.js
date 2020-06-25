import React from 'react'
import Layout from 'layout/default-sidebar-layout'
import { getApps } from 'config'
import { translate } from 'hoc/create-lang'
import { getLanguage } from 'utils/localStorage'

export default class GrafanaAppContainer extends React.Component {
  render() {
    return (
      <Layout>
        <iframe
          title={translate('apps.grafana')}
          style={{ width: '100%', height: '100vh' }}
          frameBorder={0}
          src={`${getApps().grafana}?lng=${getLanguage()}`}
        />
      </Layout>
    )
  }
}

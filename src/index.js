import React from 'react'
import ReactDOM from 'react-dom'
import { getFetch } from 'utils/fetch'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'simple-line-icons/css/simple-line-icons.css'
import 'font-awesome/css/font-awesome.css'
import 'sweetalert2/dist/sweetalert2.css'
import 'animate.css/animate.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'antd/dist/antd.css'
import 'video-react/dist/video-react.css'
import 'simplebar/src/simplebar.css'
import './index.css'

import { AppContainer } from 'react-hot-loader'
import { createBrowserHistory } from 'history'
import configureStore from './redux/createStore'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import registerServiceWorkerFireBase from './registerServiceWorkerFireBase'
import { GOOGLE_TAG_TRACKING_ID } from 'config'

import TagManager from 'react-gtm-module'
const trackingId = GOOGLE_TAG_TRACKING_ID
console.log("Init tracking Id " + trackingId)

const tagManagerArgs = {
  gtmId: trackingId
}

TagManager.initialize(tagManagerArgs)

const rootEl = document.getElementById('root')

const getStoreDefault = () => {
  if (typeof window !== 'undefined')
    return window.__REDUX_STORE__ ? window.__REDUX_STORE__ : {}
  return {}
}

const store = configureStore(getStoreDefault(), {
  routerHistory: createBrowserHistory,
})

getFetch('/app.json').then(dataConfig => {
  // console.log('dataConfig',dataConfig)
  window.config = dataConfig

  // console.log('dataConfig',dataConfig)
  const render = Component => {
    ReactDOM.render(
      <AppContainer>
        <App store={store} />
      </AppContainer>,
      rootEl
    )
  }

  render(App)

  // Webpack Hot Module Replacement API
  if (module.hot) {
    module.hot.accept('./App', () => {
      render(App)
    })
  }
  registerServiceWorker()
  registerServiceWorkerFireBase()
})

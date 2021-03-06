import auth from './auth'
import { reducer as awaitReducer } from 'redux-await'
import { reducer as reduxForm } from 'redux-form'
import breadcrumbs from 'shared/breadcrumb/reducer'
import language from './language'
import theme from './theme'
import notification from './notification'
import stationAuto from './stationAuto'
import map from './map'
import config from './config'
import ticket from './ticket'
import alarmReducer from './alarm'
import globalReducer from './global'

export default {
  config,
  auth,
  language,
  theme,
  await: awaitReducer,
  form: reduxForm,
  breadcrumbs,
  notification,
  stationAuto,
  map,
  ticket,
  alarm: alarmReducer,
  global: globalReducer,
}

import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    //icon: Icon.car,
    href: slug.stationAuto.list,
    name: translate('stationAutoManager.list.title')
  },
  config: {
    id: 'config',
    //icon: Icon.car,
    href: slug.stationAuto.configConnection.base,
    name: translate('stationAutoManager.list.config.title')
  },
  configNotification: {
    id: 'configNotification',
    //icon: Icon.car,
    href: slug.stationAuto.configSendNotification.base,
    name: translate('stationAutoManager.list.notification.title')
  },
  configSampling: {
    id: 'configSampling',
    //icon: Icon.car,
    href: slug.stationAuto.configSampling.base,
    name: translate('stationAutoManager.list.sampling.title')
  },
  create: {
    id: 'create',
    href: slug.stationAuto.create,
    name: translate('stationAutoManager.create.label')
  },
  edit: {
    href: slug.stationAuto.edit,
    name: translate('stationAutoManager.edit.label')
  },
  ftpInfo: {
    id: 'ftpInfo',
    href: slug.stationAuto.configConnection.ftp,
    name: translate('stationAutoManager.list.ftpInfo')
  },
  ftpFile: {
    id: 'ftpFile',
    href: slug.stationAuto.configConnection.file,
    name: translate('stationAutoManager.list.ftpFile')
  }
})

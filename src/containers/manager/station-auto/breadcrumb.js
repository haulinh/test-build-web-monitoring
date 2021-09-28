import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    //icon: Icon.car,
    href: slug.stationAuto.list,
    getName: () => translate('stationAutoManager.list.title'),
  },
  config: {
    id: 'config',
    //icon: Icon.car,
    href: slug.stationAuto.configConnection.base,
    getName: () => translate('stationAutoManager.configConnect.title'),
  },
  configNotification: {
    id: 'configNotification',
    //icon: Icon.car,
    href: slug.stationAuto.configSendNotification.base,
    getName: () => translate('stationAutoManager.configNotification.title'),
  },
  configSampling: {
    id: 'configSampling',
    //icon: Icon.car,
    href: slug.stationAuto.configSampling.base,
    getName: () => translate('stationAutoManager.sampling.title'),
  },
  configCamera: {
    id: 'configCamera',
    //icon: Icon.car,
    href: slug.stationAuto.configCamera.base,
    getName: () => translate('stationAutoManager.camera.title'),
  },
  configColor: {
    id: 'configColor',
    //icon: Icon.car,
    href: slug.stationAuto.configColor.base,
    getName: () => translate('stationAutoManager.configColor.title'),
  },
  create: {
    id: 'create',
    href: slug.stationAuto.create,
    getName: () => translate('stationAutoManager.create.label'),
  },
  edit: {
    href: slug.stationAuto.edit,
    getName: () => translate('stationAutoManager.edit.label'),
  },
  ftpInfo: {
    id: 'ftpInfo',
    href: slug.stationAuto.configConnection.ftp,
    getName: () => translate('stationAutoManager.list.ftpInfo'),
  },
  ftpFile: {
    id: 'ftpFile',
    href: slug.stationAuto.configConnection.file,
    getName: () => translate('stationAutoManager.list.ftpFile'),
  },
})

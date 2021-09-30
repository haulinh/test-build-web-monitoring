import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    getName: () => translate('qaqc.approveData'),
    id: 'base',
    icon: '',
    href: slug.qaqc.base,
  },
  config: {
    getName: () => translate('qaqc.configPublish.title'),
    id: 'config',
    icon: '',
    href: slug.qaqc.config,
  },
  transfer: {
    getName: () => translate('qaqc.configPublish.title'),
    id: 'transfer',
    icon: '',
    href: slug.stationAuto.ftpTransfer,
  },
  configNew: {
    getName: () => translate('qaqcConfig.title'),
    id: 'configNew',
    icon: '',
    href: slug.qaqc.configNew,
  },
})

import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    name: translate('qaqc.approveData'),
    id: 'base',
    icon: '',
    href: slug.qaqc.base
  },
  config: {
    name: translate('qaqc.configPublish.title'),
    id: 'config',
    icon: '',
    href: slug.qaqc.config
  },
  transfer: {
    name: translate('qaqc.configPublish.title'),
    id: 'transfer',
    icon: '',
    href: slug.stationAuto.ftpTransfer
  }
})

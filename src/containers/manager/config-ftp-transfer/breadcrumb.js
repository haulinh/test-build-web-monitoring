import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    //icon: Icon.car,
    href: slug.ftpTransfer.list,
    name: translate('ftpTranfer.breadCrumb'),
  },
  history: {
    id: 'history',
    href: slug.ftpTransfer.history,
    name: 'History',
  },
})

import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    name: translate('dataLogger.breadcrumb.base'),
    id: 'base',
    icon: '',
    href: slug.dataLogger.base
  },
})

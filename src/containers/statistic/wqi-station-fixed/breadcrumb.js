import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    name: translate('menuApp.advance.wqiPeriodic'),
    id: 'wqi',
    icon: '',
    href: slug.statistic.wqiPeriodic,
  },
})

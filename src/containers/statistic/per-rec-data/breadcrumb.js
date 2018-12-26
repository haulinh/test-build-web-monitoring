import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'

export default createBreadcrumb({
  perRecData: {
    name: translate('statistic.perRecData'),
    id: 'perRecData',
    icon: '',
    href: slug.statistic.perRecData
  }
})

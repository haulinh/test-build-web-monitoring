import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'

export default createBreadcrumb({
  list: {
    getName: () => translate('statistic.perRecDataFrom.breadCrumb'),
    id: 'perRecData',
    icon: '',
    href: slug.statistic.perRecData,
  },
})

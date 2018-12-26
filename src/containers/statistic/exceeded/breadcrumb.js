import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'

export default createBreadcrumb({
  exceeded: {
    name: translate('statistic.exceeded'),
    id: 'exceeded',
    icon: '',
    href: slug.statistic.exceeded
  }
})

import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'

export default createBreadcrumb({
  list: {
    name: translate('statistic.exceededFrom.breadCrumb'),
    id: 'exceeded',
    icon: '',
    href: slug.statistic.exceeded
  }
})

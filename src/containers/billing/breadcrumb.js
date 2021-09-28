import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'
import { translate as t } from 'hoc/create-lang'

export default createBreadcrumb({
  list: {
    id: 'list',
    href: slug.billing.config,
    getName: () => t('billing.title.config'),
  },
  create: {
    id: 'create',
    href: slug.billing.configCreate,
    getName: () => t('stationFixedPoint.create.label'),
  },
  edit: {
    id: 'edit',
    href: slug.billing.configEdit,
    getName: () => t('stationFixedPoint.edit.label'),
  },
  report: {
    id: 'search',
    href: slug.billing.report,
    getName: () => t('billing.title.report'),
  },
})

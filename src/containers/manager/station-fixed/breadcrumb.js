import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    href: slug.stationFixed.list,
    name: translate('stationFixedPoint.list.title'),
  },
  create: {
    id: 'create',
    href: slug.stationFixed.create,
    name: translate('stationFixedPoint.create.label'),
  },
  edit: {
    id: 'edit',
    href: slug.stationFixed.edit,
    name: translate('stationFixedPoint.edit.label'),
  },
})

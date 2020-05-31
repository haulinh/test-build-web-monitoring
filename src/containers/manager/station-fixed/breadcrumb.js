import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    //icon: Icon.car,
    href: slug.stationFixed.list,
    name: translate('stationFixedManager.list.title'),
  },
  create: {
    id: 'create',
    href: slug.stationFixed.create,
    name: translate('stationAutoManager.create.label'),
  },
  edit: {
    href: slug.stationFixed.edit,
    name: translate('stationAutoManager.edit.label'),
  },
})

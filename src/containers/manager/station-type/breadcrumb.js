import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    //icon: Icon.car,
    href: slug.stationType.list,
    getName: () => translate('stationTypeManager.list.title'),
  },
  create: {
    id: 'create',
    href: slug.stationType.create,
    getName: () => translate('stationTypeManager.create.label'),
  },
  edit: {
    id: 'edit',
    href: slug.stationType.edit,
    getName: () => translate('stationTypeManager.edit.label'),
  },
})

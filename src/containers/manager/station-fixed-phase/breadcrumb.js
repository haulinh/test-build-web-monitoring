import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    //icon: Icon.car,
    href: slug.stationFixedPhase.list,
    getName: () => translate('stationFixedPhase.list.title'),
  },
  create: {
    id: 'create',
    href: slug.stationFixedPhase.create,
    getName: () => translate('stationFixedPhase.create.label'),
  },
  edit: {
    id: 'edit',
    href: slug.stationFixedPhase.edit,
    getName: () => translate('stationFixedPhase.edit.label'),
  },
})

import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    //icon: Icon.car,
    href: slug.province.list,
    getName: () => translate('province.list.title'),
  },
  create: {
    id: 'create',
    href: slug.province.create,
    getName: () => translate('province.create.label'),
  },
  edit: {
    href: slug.province.edit,
    getName: () => translate('province.edit.label'),
  },
})

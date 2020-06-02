import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    //icon: Icon.car,
    href: slug.province.list,
    name: translate('province.list.title'),
  },
  create: {
    id: 'create',
    href: slug.province.create,
    name: translate('province.create.label'),
  },
  edit: {
    href: slug.province.edit,
    name: translate('province.edit.label'),
  },
})

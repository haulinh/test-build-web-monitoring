import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'base',
    icon: '',
    href: slug.role.base,
    getName: () => translate('roleManager.breadcrumb.list'),
  },
  create: {
    id: 'create',
    href: slug.role.create,
    getName: () => translate('roleManager.breadcrumb.create'),
  },
  edit: {
    href: slug.role.edit,
    getName: () => translate('roleManager.breadcrumb.edit'),
  },
})

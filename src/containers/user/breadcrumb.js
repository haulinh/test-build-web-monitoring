import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    //icon: Icon.car,
    href: slug.user.list,
    getName: () => translate('userManager.breadcrumb.list'),
  },
  rule: {
    id: 'rule',
    //icon: Icon.car,
    href: slug.user.rule,
    getName: () => translate('userManager.breadcrumb.rule'),
  },
  create: {
    id: 'create',
    href: slug.user.create,
    getName: () => translate('userManager.breadcrumb.create'),
  },
  edit: {
    href: slug.user.edit,
    getName: () => translate('userManager.breadcrumb.edit'),
  },
})

import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    //icon: Icon.car,
    href: slug.measuring.list,
    getName: () => translate('parameterManager.breadcrumb.base'),
  },
  create: {
    id: 'create',
    href: slug.measuring.create,
    getName: () => translate('parameterManager.breadcrumb.create'),
  },
  edit: {
    href: slug.measuring.edit,
    getName: () => translate('parameterManager.breadcrumb.edit'),
  },
})

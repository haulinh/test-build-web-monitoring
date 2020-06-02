import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    //icon: Icon.car,
    href: slug.qcvn.list,
    name: translate('qcvn.list.title'),
  },
  create: {
    id: 'create',
    href: slug.qcvn.create,
    name: translate('qcvn.create.label'),
  },
  edit: {
    href: slug.qcvn.edit,
    name: translate('qcvn.edit.label'),
  },
})

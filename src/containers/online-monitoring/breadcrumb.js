import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'base',
    icon: '',
    href: slug.onlineMonitoring.base,
    getName: () => 'Online monitoring',
  },
})

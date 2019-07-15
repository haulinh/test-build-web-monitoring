import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  type1: {
    id: 'base',
    // icon: '',
    href: slug.report.type1,
    name: 'Báo cáo tháng khí'
  }
})
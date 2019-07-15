import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  type1: {
    id: 'base',
    // icon: '',
    href: slug.report.type1,
    name: 'Báo cáo tháng khí'
  },

  type2: {
    id: 'base',
    // icon: '',
    href: slug.report.type2,
    name: 'Báo cáo tháng khí 2'
  },

  type3: {
    id: 'type3',
    // icon: '',
    href: slug.report.type3,
    name: 'Báo cáo tháng khí 3'
  },

  type4: {
    id: 'type4',
    // icon: '',
    href: slug.report.type4,
    name: 'TB 8H Max'
  },
})
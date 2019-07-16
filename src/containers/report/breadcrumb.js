import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  type1: {
    id: 'base',
    // icon: '',
    href: slug.report.type1,
    name: 'Dữ Liệu Thô'
  },

  type2: {
    id: 'base',
    // icon: '',
    href: slug.report.type2,
    name: 'TB 24H'
  },

  type3: {
    id: 'type3',
    // icon: '',
    href: slug.report.type3,
    name: 'TB 1H Max'
  },

  type4: {
    id: 'type4',
    // icon: '',
    href: slug.report.type4,
    name: 'TB 8H Max'
  },

  type5: {
    id: 'type5',
    // icon: '',
    href: slug.report.type5,
    name: 'AQI Tháng'
  },

  type6: {
    id: 'type6',
    // icon: '',
    href: slug.report.type6,
    name: 'AQI Thông Số Giờ'
  }
})
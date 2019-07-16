import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  type1: {
    id: 'base',
    // icon: '',
    href: slug.report.type1,
    name: 'Khí - Dữ Liệu Thô'
  },

  type2: {
    id: 'base',
    // icon: '',
    href: slug.report.type2,
    name: 'Khí - TB 24H'
  },

  type3: {
    id: 'type3',
    // icon: '',
    href: slug.report.type3,
    name: 'Khí - TB 1H Max'
  },

  type4: {
    id: 'type4',
    // icon: '',
    href: slug.report.type4,
    name: 'Khí - TB 8H Max'
  },

  type5: {
    id: 'type5',
    // icon: '',
    href: slug.report.type5,
    name: 'Khí - AQI Tháng'
  },

  type6: {
    id: 'type6',
    // icon: '',
    href: slug.report.type6,
    name: 'Khí - AQI Thông Số Giờ'
  },

  type7: {
    id: 'type7',
    // icon: '',
    href: slug.report.type7,
    name: 'Khí - AQI Thông Số Ngày'
  },

  type8: {
    id: 'type8',
    // icon: '',
    href: slug.report.type8,
    name: 'Nuớc - Tỷ lệ dữ liệu'
  },
})
import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    href: slug.periodicalForecast.station,
    name: 'Trạm quan trắc',
  },
  create: {
    id: 'create',
    href: slug.periodicalForecast.stationCreate,
    name: translate('stationFixedPoint.create.label'),
  },
  edit: {
    id: 'edit',
    href: slug.periodicalForecast.stationEdit,
    name: translate('stationFixedPoint.edit.label'),
  },
  import: {
    id: 'import',
    href: slug.periodicalForecast.importStation,
    name: 'Nhập dữ liệu',
  },
  search: {
    id: 'search',
    href: slug.periodicalForecast.search,
    name: 'Tra cứu dữ liệu',
  },
})

import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'
import { translate as t } from 'hoc/create-lang'

export default createBreadcrumb({
  list: {
    id: 'list',
    href: slug.periodicalForecast.station,
    name: t('periodicalForecast.title.station'),
  },
  create: {
    id: 'create',
    href: slug.periodicalForecast.stationCreate,
    name: t('stationFixedPoint.create.label'),
  },
  edit: {
    id: 'edit',
    href: slug.periodicalForecast.stationEdit,
    name: t('stationFixedPoint.edit.label'),
  },
  import: {
    id: 'import',
    href: slug.periodicalForecast.importStation,
    name: t('periodicalForecast.title.importData'),
  },
  search: {
    id: 'search',
    href: slug.periodicalForecast.search,
    name: t('periodicalForecast.title.search'),
  },
})

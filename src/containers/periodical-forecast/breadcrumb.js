import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'
import { translate as t } from 'hoc/create-lang'

export default createBreadcrumb({
  list: {
    id: 'list',
    href: slug.periodicalForecast.station,
    getName: () => t('periodicalForecast.title.station'),
  },
  create: {
    id: 'create',
    href: slug.periodicalForecast.stationCreate,
    getName: () => t('stationFixedPoint.create.label'),
  },
  edit: {
    id: 'edit',
    href: slug.periodicalForecast.stationEdit,
    getName: () => t('stationFixedPoint.edit.label'),
  },
  import: {
    id: 'import',
    href: slug.periodicalForecast.importStation,
    getName: () => t('periodicalForecast.title.importData'),
  },
  search: {
    id: 'search',
    href: slug.periodicalForecast.search,
    getName: () => t('periodicalForecast.title.search'),
  },
})

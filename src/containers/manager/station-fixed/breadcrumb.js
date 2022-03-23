import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    href: slug.stationFixed.list,
    getName: () => translate('stationFixedPoint.list.title'),
  },
  create: {
    id: 'create',
    href: slug.stationFixed.create,
    getName: () => translate('stationFixedPoint.create.label'),
  },
  edit: {
    id: 'edit',
    href: slug.stationFixed.edit,
    getName: () => translate('stationFixedPoint.edit.label'),
  },
  drive: {
    id: 'drive',
    href: slug.stationFixed.edit,
    name: 'FILE',
  },
  monitoringData: {
    id: 'monitoringData',
    href: slug.stationFixed.monitoringData,
    name: 'Dữ liệu quan trắc',
    getName: () => translate('menuApp.stationFixed.monitoringData'),
  },
})

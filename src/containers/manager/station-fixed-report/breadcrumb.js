import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  base: {
    id: 'base',
    //icon: Icon.car,
    href: slug.stationFixedReport.base,
    name: translate('stationFixedReport.base.title'),
  }
})

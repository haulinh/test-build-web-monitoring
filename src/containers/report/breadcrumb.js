import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'

export default createBreadcrumb({
  type1: {
    id: 'type1',
    // icon: '',
    href: slug.report.type1,
    getName: () => translate('menuApp.reportBreadcrum.type1'),
  },
  type2: {
    id: 'type2',
    // icon: '',
    href: slug.report.type2,
    getName: () => translate('menuApp.reportBreadcrum.type2'),
  },
  type3: {
    id: 'type3',
    // icon: '',
    href: slug.report.type3,
    getName: () => translate('menuApp.reportBreadcrum.type3'),
  },
  type4: {
    id: 'type4',
    // icon: '',
    href: slug.report.type4,
    getName: () => translate('menuApp.reportBreadcrum.type4'),
  },
  type5: {
    id: 'type5',
    // icon: '',
    href: slug.report.type5,
    getName: () => translate('menuApp.reportBreadcrum.type5'),
  },
  type6: {
    id: 'type6',
    // icon: '',
    href: slug.report.type6,
    getName: () => translate('menuApp.reportBreadcrum.type6'),
  },
  type7: {
    id: 'type7',
    // icon: '',
    href: slug.report.type7,
    getName: () => translate('menuApp.reportBreadcrum.type7'),
  },
  type8: {
    id: 'type8',
    // icon: '',
    href: slug.report.type8,
    getName: () => translate('menuApp.reportBreadcrum.type8'),
  },
  type9: {
    id: 'type9',
    // icon: '',
    href: slug.report.type9,
    getName: () => translate('menuApp.reportBreadcrum.type9'),
  },
  type10: {
    id: 'type10',
    // icon: '',
    href: slug.report.type10,
    getName: () => translate('menuApp.reportBreadcrum.type10'),
  },
  type11: {
    id: 'type11',
    // icon: '',
    href: slug.report.type11,
    getName: () => translate('menuApp.reportBreadcrum.type11'),
  },
  type12: {
    id: 'type12',
    // icon: '',
    href: slug.report.type12,
    getName: () => translate('menuApp.reportBreadcrum.type12'),
  },
  status_data: {
    id: 'status_data',
    // icon: '',
    href: slug.report.status_data,
    getName: () => translate('menuApp.reportBreadcrum.status_data'),
  },
  type2_flow: {
    id: 'type2_flow',
    href: slug.report.type2_flow,
    getName: () => translate('menuApp.reportBreadcrum.type2_flow'),
  },
})

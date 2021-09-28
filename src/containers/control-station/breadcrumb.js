import { translate } from 'hoc/create-lang'
import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'

export default createBreadcrumb({
  trigger: {
    id: 'base',
    icon: '',
    href: slug.controlStation.trigger,
    getName: () => translate('controlStation.breadcrumb.trigger'),
  },
  history: {
    id: 'history',
    href: slug.controlStation.history,
    getName: () => translate('controlStation.breadcrumb.history'),
  },
  config: {
    id: 'config',
    href: slug.controlStation.config,
    getName: () => translate('controlStation.breadcrumb.config'),
  },
})

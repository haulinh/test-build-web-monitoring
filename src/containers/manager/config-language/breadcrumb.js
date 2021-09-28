import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'
//import Icon from 'themes/icon'
function i18n() {
  return {
    base: translate('language.breadcrumb.base'),
  }
}

export default createBreadcrumb({
  list: {
    getName: () => {
      return i18n().base
    },
    id: 'list',
    icon: '',
    href: slug.language.base,
  },
})

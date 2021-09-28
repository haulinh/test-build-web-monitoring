import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'

export default createBreadcrumb({
  changePassword: {
    id: 'changePassword',
    icon: '',
    href: slug.user.changePassword,
    getName: () => translate('changePassword.breadcrumb.changePassword'),
  },
  profileUser: {
    id: 'profileUser',
    icon: '',
    href: slug.user.profile,
    getName: () => translate('changePassword.breadcrumb.profileUser'),
  },
  infoLicense: {
    id: 'infoLicense',
    icon: '',
    href: slug.user.infoLicense,
    getName: () => translate('infoLicense.breadCrumb'),
  },
  configStation: {
    id: 'configStation',
    icon: '',
    href: slug.user.configStation,
    getName: () => translate('profileUser.configStation'),
  },
  security: {
    id: 'security',
    icon: '',
    href: slug.user.security,
    getName: () => translate('changePassword.breadcrumb.security'),
  },
})

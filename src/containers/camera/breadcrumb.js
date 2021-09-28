import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'base',
    icon: '',
    href: slug.camera.base,
    getName: () => translate('cameraManager.breadcrumb.camera'),
  },
  edit: {
    id: 'base',
    icon: '',
    href: slug.camera.base,
    getName: () => translate('cameraManager.breadcrumb.camera'),
  },
})

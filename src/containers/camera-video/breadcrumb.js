import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
//import Icon from 'themes/icon'

export default createBreadcrumb({
  list: {
    id: 'list',
    href: slug.cameraControl.base,
    getName: () => translate('cameraManager.breadcrumb.camera'),
  },
  detail: {
    href: slug.cameraControl.detail,
    getName: () => translate('cameraManager.breadcrumb.camera'),
  },
})

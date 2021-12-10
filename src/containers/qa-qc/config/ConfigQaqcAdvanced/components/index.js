import ModalConfirmDelete from './ModalConfirmDelete'
import ModalConfirmCancel from './ModalConfirmCancel'
import { translate as t } from 'hoc/create-lang'

export { ModalConfirmDelete, ModalConfirmCancel }

export const i18n = () => ({
  modal: {
    delete: {
      title: t('qaqcConfig.advanced.modal.delete.title'),
      message: t('qaqcConfig.advanced.modal.delete.message'),
    },
    cancel: {
      create: {
        title: t('qaqcConfig.advanced.modal.cancel.create.title'),
        message: t('qaqcConfig.advanced.modal.cancel.create.message'),
      },
      edit: {
        title: t('qaqcConfig.advanced.modal.cancel.edit.title'),
        message: t('qaqcConfig.advanced.modal.cancel.edit.message'),
      },
    },
  },
  button: {
    delete: t('qaqcConfig.advanced.button.delete'),
    cancel: t('qaqcConfig.advanced.button.cancel'),
    continueCreate: t('qaqcConfig.advanced.button.continueCreate'),
    continueEdit: t('qaqcConfig.advanced.button.continueEdit'),
    close: t('qaqcConfig.advanced.button.close'),
  },
})

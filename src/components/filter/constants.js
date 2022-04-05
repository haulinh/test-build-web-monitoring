import { translate as t } from 'hoc/create-lang'

export const FIELDS = {
  FILTER_NAME: 'name',
  ACTION: 'action',
}

export const ACTION_TYPE = {
  UPDATE: 'update',
  CREATE: 'create',
}

export const MODULE_TYPE = {
  ANALYTIC: 'Analytic',
  ORIGINAL: 'Original',
  AVERAGE: 'Average',
}

export const i18n = () => {
  return {
    button: {
      ok: t('storageFilter.button.ok'),
      cancel: t('storageFilter.button.cancel'),
      saveFilter: t('storageFilter.button.saveFilter'),
    },
    menu: {
      search: t('storageFilter.menu.search'),
      popupConfirm: {
        title: t('storageFilter.menu.popupConfirm.title'),
      },
      tooltip: t('storageFilter.menu.tooltip'),
    },
    modalFilter: {
      title: t('storageFilter.modalFilter.title'),
      desc: t('storageFilter.modalFilter.desc'),
      nameInput: {
        title: t('storageFilter.modalFilter.nameInput.title'),
        placeholder: t('storageFilter.modalFilter.nameInput.placeholder'),
        rules: {
          require: t('storageFilter.modalFilter.nameInput.rules.require'),
          max64: t('storageFilter.modalFilter.nameInput.rules.max64'),
        },
      },
    },
    option: {
      update: {
        title: t('storageFilter.option.update.title'),
        hint: t('storageFilter.option.update.hint'),
      },
      create: {
        title: t('storageFilter.option.create.title'),
        hint: t('storageFilter.option.create.hint'),
      },
    },
    message: {
      updateSuccess: t('storageFilter.message.updateSuccess'),
      saveSuccess: t('storageFilter.message.saveSuccess'),
      deleteSuccess: t('storageFilter.message.deleteSuccess'),
    },
  }
}

import { translate as t } from 'hoc/create-lang'
import styled from 'styled-components'

export const FIELDS = {
  PHASE: 'phase',
  POINT: 'stationId',
  REPORT_ID: 'reportId',
  NAME_REPORT: 'reportName',
  TIME: 'datetime',
  MEASURING_LOGS: 'measuringLogs',
  TYPE: 'type',
  FILE: 'file',
  STATION_TYPE: 'stationType',
  TYPE_REPORT: 'typeReport',
  OTHER: {
    SYMBOL: 'symbol',
    WEATHER: 'weather',
    SAMPLER: 'sampler',
    NOTES: 'notes',
    MONITORING_PLACE: 'monitoringPlace',
    REQUIREMENTS: 'requirements',
    METHOD: 'method',
    CHEMICAL: 'chemical',
    CONDITIONS: 'conditions',
    EQUIPMENTLIST: 'equipmentlist',
    ANALYST: 'analyst',
    PLACE_OF_ANALYSIS: 'placeOfAnalysis',
  },
}

export const REPORT_TYPE = {
  SIMPLE: 'simple',
  DETAIL: 'detail',
}

export const FormCollapseContainer = styled.div`
  .ant-collapse {
    border: unset;
    background: unset;
  }
  .ant-collapse-icon-position-right
    > .ant-collapse-item
    > .ant-collapse-header {
    padding: 12px 0;
  }
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding-left: 16px;
  }
  .ant-collapse-content-box {
    padding: 16px 0;
  }
  .ant-collapse
    > .ant-collapse-item
    > .ant-collapse-header
    .ant-collapse-arrow {
    left: 0;
  }

  .ant-collapse-header {
    padding: unset;
  }

  .ant-collapse-content,
  .ant-collapse-item {
    border: unset;
  }
`

export const i18n = () => {
  return {
    importButton: {
      manual: t('stationFixedMonitoring.importButton.manual'),
      importExcel: t('stationFixedMonitoring.importButton.importExcel'),
    },
    drawer: {
      title: {
        edit: t('stationFixedMonitoring.drawer.title.edit'),
        create: t('stationFixedMonitoring.drawer.title.create'),
      },
      formBasic: {
        title: t('stationFixedMonitoring.drawer.formBasic.title'),
        nameReport: t('stationFixedMonitoring.drawer.formBasic.nameReport'),
        point: t('stationFixedMonitoring.drawer.formBasic.point'),
        time: t('stationFixedMonitoring.drawer.formBasic.time'),
        selectTime: t('stationFixedMonitoring.drawer.formBasic.selectTime'),
        message: {
          nameReport: {
            require: t(
              'stationFixedMonitoring.drawer.formBasic.message.nameReport.require'
            ),
            max64: t(
              'stationFixedMonitoring.drawer.formBasic.message.nameReport.max64'
            ),
          },
          point: {
            require: t(
              'stationFixedMonitoring.drawer.formBasic.message.point.require'
            ),
          },
          time: t('stationFixedMonitoring.drawer.formBasic.message.time'),
        },
        datePicker: {
          now: t('stationFixedMonitoring.drawer.formBasic.datePicker.now'),
          selectTime: t(
            'stationFixedMonitoring.drawer.formBasic.datePicker.selectTime'
          ),
        },
      },
      formMeasure: {
        title: t('stationFixedMonitoring.drawer.formMeasure.title'),
        measure: t('stationFixedMonitoring.drawer.formMeasure.measure'),
        value: t('stationFixedMonitoring.drawer.formMeasure.value'),
        popupDelete: {
          title: t(
            'stationFixedMonitoring.drawer.formMeasure.popupDelete.title'
          ),
        },
        buttonAdd: t('stationFixedMonitoring.drawer.formMeasure.buttonAdd'),
        message: {
          measure: t(
            'stationFixedMonitoring.drawer.formMeasure.message.measure'
          ),
          value: t('stationFixedMonitoring.drawer.formMeasure.message.value'),
          format: t('stationFixedMonitoring.drawer.formMeasure.message.format'),
        },
        hint: {
          text: t('stationFixedMonitoring.drawer.formMeasure.hint.text'),
        },
      },
      formOtherInfo: {
        placeholder: t(
          'stationFixedMonitoring.drawer.formOtherInfo.placeholder'
        ),
        title: t('stationFixedMonitoring.drawer.formOtherInfo.title'),
        sampler: t('stationFixedMonitoring.drawer.formOtherInfo.sampler'),
        monitoringPlace: t(
          'stationFixedMonitoring.drawer.formOtherInfo.monitoringPlace'
        ),
        requirements: t(
          'stationFixedMonitoring.drawer.formOtherInfo.requirements'
        ),
        method: t('stationFixedMonitoring.drawer.formOtherInfo.method'),
        chemical: t('stationFixedMonitoring.drawer.formOtherInfo.chemical'),
        conditions: t('stationFixedMonitoring.drawer.formOtherInfo.conditions'),
        equipmentList: t(
          'stationFixedMonitoring.drawer.formOtherInfo.equipmentList'
        ),
        symbol: t('stationFixedMonitoring.drawer.formOtherInfo.symbol'),
        weather: t('stationFixedMonitoring.drawer.formOtherInfo.weather'),
        analyst: t('stationFixedMonitoring.drawer.formOtherInfo.analyst'),
        placeOfAnalysis: t(
          'stationFixedMonitoring.drawer.formOtherInfo.placeOfAnalysis'
        ),
        note: t('stationFixedMonitoring.drawer.formOtherInfo.note'),
      },
    },
    popupCreateSuccess: {
      title: t('stationFixedMonitoring.popupCreateSuccess.title'),
    },
    popupCreateLogSuccess: {
      title: t('stationFixedMonitoring.popupCreateLogSuccess.title'),
    },
    popupEditLogSuccess: {
      title: t('stationFixedMonitoring.popupEditLogSuccess.title'),
    },
    modalConfirmCancel: {
      content: t('stationFixedMonitoring.modalConfirmCancel.content'),
    },
    button: {
      accept: t('stationFixedMonitoring.button.accept'),
      cancel: t('stationFixedMonitoring.button.cancel'),
      reset: t('stationFixedMonitoring.button.reset'),
      create: t('stationFixedMonitoring.button.create'),
      download: t('stationFixedMonitoring.button.download'),
      upload: t('stationFixedMonitoring.button.upload'),
      update: t('stationFixedMonitoring.button.update'),
    },

    errorUploadFile: {
      line: t('importDataPoint.line'),
      duplicateParameter: t('importDataPoint.duplicateParameter'),
      duplicateData: t('importDataPoint.duplicateData'),
      invalidDataSheet: t('importDataPoint.invalidDataSheet'),
      invalidDateTime: t('importDataPoint.invalidDateTime'),
      invalidParameter: t('importDataPoint.invalidParameter'),
      pointKeyNotExisted: t('importDataPoint.pointKeyNotExisted'),
      parameterNotTypeNumber: t('importDataPoint.parameterNotTypeNumber'),
      pointAndPhaseNotBelongToStationType: t(
        'importDataPoint.pointAndPhaseNotBelongToStationType'
      ),
      pointKeyRequired: t('importDataPoint.pointKeyRequired'),
      dateTimeRequired: t('importDataPoint.dateTimeRequired'),
    },

    importExcel: {
      breadCrumb: t('stationFixedMonitoring.importExcel.breadCrumb'),
      nameReport: t('stationFixedMonitoring.importExcel.nameReport'),
      placeholder: t('stationFixedMonitoring.importExcel.placeholder'),
      message: t('stationFixedMonitoring.importExcel.message'),
      note: t('stationFixedMonitoring.importExcel.note'),
      desc: t('stationFixedMonitoring.importExcel.desc'),
      dragger: {
        title: t('stationFixedMonitoring.importExcel.dragger.title'),
        desc: t('stationFixedMonitoring.importExcel.dragger.desc'),
      },
      notificationUpload: {
        notFile: {
          title: t(
            'stationFixedMonitoring.importExcel.notificationUpload.notFile.title'
          ),
          desc: t(
            'stationFixedMonitoring.importExcel.notificationUpload.notFile.desc'
          ),
        },
        uploadError: {
          title: t(
            'stationFixedMonitoring.importExcel.notificationUpload.uploadError.title'
          ),
          desc: t(
            'stationFixedMonitoring.importExcel.notificationUpload.uploadError.desc'
          ),
        },
        empty: {
          title: t(
            'stationFixedMonitoring.importExcel.notificationUpload.empty.title'
          ),
          desc: t(
            'stationFixedMonitoring.importExcel.notificationUpload.empty.desc'
          ),
        },
        success: {
          title: t(
            'stationFixedMonitoring.importExcel.notificationUpload.success.title'
          ),
          desc: t(
            'stationFixedMonitoring.importExcel.notificationUpload.success.desc'
          ),
          desc2: t(
            'stationFixedMonitoring.importExcel.notificationUpload.success.desc2'
          ),
        },
      },
    },
    downloadExcel: {
      downloadFile: t('stationFixedMonitoring.downloadExcel.downloadFile'),
      cancel: t('stationFixedMonitoring.downloadExcel.cancel'),
      modal: {
        title: t('stationFixedMonitoring.downloadExcel.modal.title'),
        typeReport: {
          title: t(
            'stationFixedMonitoring.downloadExcel.modal.typeReport.title'
          ),
          simpleTitle: t(
            'stationFixedMonitoring.downloadExcel.modal.typeReport.simpleTitle'
          ),
          simpleDesc: t(
            'stationFixedMonitoring.downloadExcel.modal.typeReport.simpleDesc'
          ),
          detailTitle: t(
            'stationFixedMonitoring.downloadExcel.modal.typeReport.detailTitle'
          ),
          detailDesc: t(
            'stationFixedMonitoring.downloadExcel.modal.typeReport.detailDesc'
          ),
        },
        selectStationType: {
          title: t(
            'stationFixedMonitoring.downloadExcel.modal.selectStationType.title'
          ),
          placeholder: t(
            'stationFixedMonitoring.downloadExcel.modal.selectStationType.placeholder'
          ),
          require: t(
            'stationFixedMonitoring.downloadExcel.modal.selectStationType.require'
          ),
        },
        dragDrop: {
          hint: t('stationFixedMonitoring.downloadExcel.modal.dragDrop.hint'),
        },
        downloadSuccess: t(
          'stationFixedMonitoring.downloadExcel.modal.downloadSuccess'
        ),
      },
    },
  }
}

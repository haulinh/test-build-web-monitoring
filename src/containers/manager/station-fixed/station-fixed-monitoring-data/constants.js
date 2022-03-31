import { translate as t } from 'hoc/create-lang'
import styled from 'styled-components'

export const FIELDS = {
  PHASE: 'phase',
  POINT: 'stationId',
  REPORT_ID: 'reportId',
  NAME_REPORT: 'name',
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
      title: t('stationFixedMonitoring.drawer.title'),
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
    modalConfirmCancel: {
      content: t('stationFixedMonitoring.modalConfirmCancel.content'),
    },
    button: {
      accept: t('stationFixedMonitoring.button.accept'),
      cancel: t('stationFixedMonitoring.button.cancel'),
      reset: t('stationFixedMonitoring.button.reset'),
      create: t('stationFixedMonitoring.button.create'),
    },
  }
}

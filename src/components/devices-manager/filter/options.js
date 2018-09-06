import monitoringFilter from 'constants/monitoringFilter'

export const getGroupOptions = (t = null) => {

  return [
    {
      value: monitoringFilter.GROUP.GROUP,
      name: t ? t(monitoringFilter.GROUP.GROUP_LABEL) : ''
    },
    {
      value: monitoringFilter.GROUP.UNGROUP,
      name: t ? t(monitoringFilter.GROUP.UNGROUP_LABEL) : ''
    }
  ]
}

export const getOrderOptions = (t = null) => {
  
  return [
    {
      value: monitoringFilter.DEVICES.NAME,
      name: t ? t(monitoringFilter.DEVICES.LABEL_NAME) : ''
    },
    {
      value: monitoringFilter.DEVICES.MAINTENANCE,
      name: t ? t(monitoringFilter.DEVICES.LABEL_MAINTENANCE): ''
    },
    {
      value: monitoringFilter.DEVICES.BROKENED,
      name: t ? t(monitoringFilter.DEVICES.LABEL_BROKENED): ''
    }
  ]
}


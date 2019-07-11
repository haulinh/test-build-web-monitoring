export default {
  unit: {
    time: {
      second: 'second',
      minute: 'minute',
      hour: 'hour'
    }
  },
  chart: {
    all: 'All',
    time: 'Time',
    from: 'From',
    to: 'To'
  },
  dashboard: {
    good: 'Good',
    dataLoss: 'Lost',
    notUse: 'Not In Use',
    connected: 'Connected',
    exceeded: 'Exceeded',
    exceededPreparing: 'Almost Exceed',
    exceededTendency: 'Tend To Exceed',
    viewInMonitoring: 'View In Monitoring',
    viewInMap: 'View In Map',
    viewMore: 'View More',
    all: 'All',
    selectProvince: 'Select Site',
    tableList: {
      name: 'Name',
      dataStatus: 'Status'
    },
    chartRatio: {
      title: 'Data receiving rate',
      dataByDate: 'The {{=it.day}}-day {{=it.unit}} data rate',
      received: 'Recieved Data',
      notReceived: `Not Recieved`,
      byDay: '{{=it.day}} days'
    },
    chartStatus: {
      title: 'Connection status of the station',
      titleByUnit: 'Rate of receiving data of {{=it.unit}} unit',
      activate: 'Connecting',
      inactive: `Inactive`,
      dataLoss: `Disconnected`,
      stations: 'stations',
      max: 'Maximum: {{=it.max}}',
      min: 'Minimum: {{=it.min}}'
    },
    activeStationPer: 'Station Active ({{=it.good}}/{{=it.total}})',
    unit: 'Unit'
  },
  monitoring: {
    title: 'Monitoring',
    selectProvince: 'Select Site',
    selectStationType: 'Type of Station',
    group: 'Group by Type',
    unGroup: 'Ungroup',
    sortByStationName: 'Sort By Station Name',
    sortByValues: 'Sort By Status',
    keywordSearch: 'Station Name',
    limit: 'Limit',
    selectGroup: 'Select Group',
    selectOrder: 'Order By',
    dataSearch: 'Data Search',
    viewInMap: 'View In Map',
    sampling: 'Sampling',
    camera: 'Camera',
    lossAt: 'Lost at',
    notInUse: 'Not In Use',
    deviceStatus: {
      dataloss: 'Lost Connection',
      sensorError: 'Sensor Error',
      maintenance: 'Calibration',
      sensorNormal: 'Sensor Normal',
      normal: 'Normal',
      broken: 'Broken',
    },
    statusResult: 'Monitoring results',
    note: 'Note',
    actions: {
      sampling: 'Sampling',
      camera: 'Camera',
      chart: 'Chart',
      map: 'Map',
      images: 'Images',
      stationInfo: 'Station Infomation',
      reviewStation: 'Review Station'
    },
    moreContent: {
      sampling: {
        tabs: {
          sampling: 'Sampling',
          history: 'History',
          config: 'Config'
        },
        content: {
          totalBottles: 'Total bottles:',
          sampledBottles: 'Sampled bottles:',
          typeOfSampling: 'Action',
          immediatelySampling: 'Immediately Sampling',
          scheduleSampling: 'Schedule Sampling',
          bottlesNeedToTake: 'Bottles need to take:',
          frequency: 'Frequency (minutes):',
          timeStartSampling: 'Time start sampling:',
          dateStartSampling: 'Date start sampling:',
          takeSample: 'Take Sample',
          commandSent: 'Command sent',
          takingSample: 'Sampling...',
          active: 'Active',
          actived: 'Actived (Click to cancel Sampling by Scheduled)',
          activeOverRange: 'Active Take sample when data over-range',
          activedOverRange:
            'Actived Take sample when data over-range (Click to Cancel)',
          history: {
            stt: 'STT',
            bottleNo: 'Bottle No',
            dateTime: 'Date time',
            typeOfSampling: 'Action',
            activedUser: 'Actived User',
            result: 'Result',
            manual:'Immediately Sampling',
            cancel_schedule:'Cancel Sampling By Scheduled',
            active_schedule:'Active Sampling By Scheduled',
            config:'Modify Configuration',
            reset_bottles:'Reset Sampled Bottles'
          },
          config: {
            totalBottles: 'Total bottles:',
            controlTagName: 'Controlling Tag name:',
            timeToTakeOneBottle: 'Time to take one bottle (minutes):',
            save: 'Save'
          }
        }
      },
      chart: {
        tab: {
          avgHour: 'Hourly',
          avgDay: 'Daily'
        },
        content: {
          minLimit: 'Minimum',
          maxLimit: 'Maximum',
          to: 'To',
          from: 'From'
        }
      }
    }
  },
  aqi: {
    title: 'Air Quality Index',
    paramsTitle: 'The {{= it.day}}-day AQI value of each parameter'
  },
  wqi: {
    title: 'Water Quality Index'
  },
  qaqc: {
    configPublish: {
      title: 'Publish Configuration',
      stationName: 'Station Name',
      publish: 'Publish',
      measurePublish: 'Measuring Publish'
    },
    publish: 'Publish',
    title: `QA/QC`,
    removeData: 'Data removed',
    removeDataBy: 'Remove Data By',
    approveData: 'Check Data',
    config: 'Config',
    approveAll: 'Approve All',
    manualApprove: 'Manual Approve',
    dataFilter: {
      label: 'Data filter by',
      negative: 'Negative',
      outOfRange: 'Out of range',
      isZero: 'Is Zero',
      deviceStatus: 'Device Status'
    },
    data: 'Data Type',
    approve: 'Approve',
    cancel: 'Cancel',
    remove: 'Removed Data',
    restore: 'Restore Data',
    allCancel: 'All Cancel',
    unApprove: 'UnApprove',
    yetApprove: 'Yet Approved',
    originalData: 'Original data',
    validData: 'Valid data',
    inValidData: 'Invalid data',
    ok: 'OK',
    province: {
      label: 'Select Site',
      placeholder: 'Select Site'
    },
    notEmpty: '{{=it.value}} is required!',
    pageInfo: '{{=it.from}}-{{=it.to}} of {{it.total}} items',
    msg: {
      confirmUnApprove: 'Do you want to cancel the selected approval?',
      success: 'Saved Successfully',
      failure: 'Save failure'
    },
    date: {
      from: 'From Date',
      to: 'To Date'
    },
    outOfRange: 'Out of range'
  },
  qaqcConfig: {
    title: 'QAQC Config',
    beyondMeasuringRange: 'Out of range',
    deviceError: 'Sensor error',
    deviceCalibration: "Sensor Calibration",
    zero: 'Zero value',
    negative: "Negative value"
  },
  controlStation: {
    text: 'Sampling',
    breadcrumb: {
      trigger: 'Sampling',
      history: 'History',
      config: 'Config'
    },
    trigger: {
      triggerSuccess: 'Trigger Succeeded',
      triggerCancel: 'Trigger Cancel Succeeded',
      triggerExceeded: ' Trigger Exceeded'
    },
    config: {
      reset: 'Reset Succeeded',
      success: 'Config Succeeded'
    },
    bottle: 'Bottle Number',
    handMade: 'Manual',
    automatic: 'Automatic',
    total: 'Total',
    totalHaveTaken: 'No. Of Taken Bottles',
    amountToGet: 'Quantity',
    timer: 'Timer',
    date: 'Date',
    typeControl: 'Type Of Control',
    orderByBottle: 'Order By Bottle',
    dateTime: 'Date Time',
    content: 'Content',
    email: 'Email',
    tagName: 'Tag Name',
    configTotal: 'Config No. Of Total',
    cycleSampling: 'Cycle Of Sampling',
    buttonTrigger: 'Trigger',
    cancelTrigger: 'Cancel Trigger',
    triggerExceeded: 'Trigger Exceeded',
    cancelTriggerExceeded: 'Cancel Trigger Exceeded',
    statusSampling: 'Sampling ...',
    viewMore: 'View More'
  },
  map: {
    mapOverview: 'Map Overview',
    AQI: 'AQI',
    WQI: 'WQI',
    menuRight: {
      good: 'Good',
      dataLoss: 'Data Lost',
      notUse: 'Not In Use',
      connected: 'Connected',
      exceeded: 'Exceeded',
      exceededPreparing: 'Almost Exceed',
      exceededTendency: 'Tend To Exceed',
      notify: 'Notifications',
      noData: 'No Data Available',
      dataStatus: 'Data Status',
      stationStatus: 'Station Status'
    },
    menuLeft: {
      stationSearch: 'Search By Station'
    },
    dataTable: {
      measuring: 'Measuring',
      value: 'Value',
      unit: 'Unit',
      statusSensor: 'Sensor Status',
      dataLossAt: 'Data Lost At:',
      dataReceived: 'Received At:',
      longitude: 'Longitude',
      latitude: 'Latitude',
      address: 'Address',
      viewMore: {
        sampling: 'Sampling',
        camera: 'Camera',
        viewData: 'View Data',
        detail: 'Detail'
      }
    },
    marker: {
      transmitting: 'Transmitting',
      dataLoss: 'Disconnected',
      notUse: 'Not In Use',
      info: 'Info',
      image: 'Image',
      time: 'Time',
      status: 'Status',
      result: 'Results'
    }
  },
  dataSearchFixed: {
    downloadTemplate: 'Download Template',
    importData: 'Import Data',
    importSuccess: 'Import Data Success',
    importFailed: 'Import Data Failed'
  },
  dataSearchFrom: {
    titleText: 'Data Search',
    options: {
      byHours: '{{=it.value}} Hours',
      byDay: '{{=it.value}} Day',
      range: 'In range'
    },
    form: {
      all: 'All',
      time: 'Time',
      stationType: {
        label: 'Type Of Station',
        placeholder: 'Select Type Of Station'
      },
      stationAuto: {
        label: 'Station Name',
        placeholder: 'Select Station Name'
      },
      fromDate: {
        label: 'Start',
        placeholder: 'Select Starting Date'
      },
      toDate: {
        label: 'End',
        placeholder: 'Select Ending date'
      },
      measuringList: {
        label: 'Parameters',
        placeholder: 'Select Parameter',
        require: 'Choose At Least 1 Parameter'
      },
      isExceeded: {
        label: 'Only Exceeded'
      },
      operator: {
        label: 'Operator'
      },
      value: {
        label: 'Value'
      },
      type: {
        label: 'Type Of Report'
      },
      advanced: {
        label: 'Advanced',
        reset: 'Reset'
      }
    },
    table: {
      emptyText: 'There Are No Records To Display',
      receivedAt: 'Received At',
      all: 'All',
      numericalOrder: 'No.'
    },
    tab: {
      data: 'Data',
      chart: 'Chart',
      exportExcel: 'Export To Excel',
      statusExport: 'Exporting...'
    },
    analyze: {
      max: 'Max',
      maxTime: 'Max Time',
      min: 'Min',
      minTime: 'Min Time',
      avg: 'Average',
      parameters: 'Parameters'
    }
  },
  avgSearchFrom: {
    titleText: 'AVG Search',
    form: {
      time: 'Time',
      stationType: {
        label: 'Type Of Station',
        placeholder: 'Select Type Of Station',
        error: 'Please Choose Type Of Station'
      },
      rangesDate:{
        error: 'Please Choose Time'
      },
      stationAuto: {
        label: 'Station Name',
        placeholder: 'Select Station Name',
        error: 'Please Choose Station Name'
      },
      fromDate: {
        label: 'Start',
        placeholder: 'Select Starting Date'
      },
      toDate: {
        label: 'End',
        placeholder: 'Select Ending Date'
      },
      measuringList: {
        label: 'Parameters',
        placeholder: 'Select Parameter',
        require: 'Choose At Least 1 Parameter'
      },
      isExceeded: {
        label: 'Only Exceeded Data'
      },
      operator: {
        label: 'Operator'
      },
      value: {
        label: 'Value'
      },
      type: {
        label: 'Average Data',
        error: 'Please Choose Average Data'
      },
      advanced: {
        label: 'Advanced'
      }
    },
    table: {
      receivedAt: 'Received At',
      all: 'All',
      emptyText: 'There Are No Records To Display'
    },
    selectTimeRange: {
      minute: 'Minute',
      hour: 'Hour',
      day: 'Day',
      month: 'Month',
      year: 'Year'
    },
    tab: {
      data: 'Data',
      chart: 'Chart',
      exportExcel: 'Export To Excel',
      statusExport: 'Exporting ...'
    }
  },
  measuringManager: {
    list: {
      title: 'Parameters'
    },
    create: {
      success: 'Add Parameter Successfully',
      keyExisted: 'Parameter Is Already Existed'
    },
    edit: {
      label: 'Edit',
      success: 'Update Parameter Successfully'
    },
    delete: {
      label: 'Delete'
    },
    form: {
      key: {
        label: 'Code',
        placeholder: 'Input Parameter Code',
        error: 'Please Input Parameter Code'
      },
      name: {
        label: 'Name',
        placeholder: 'Input Parameter Name',
        error: 'Please Input Parameter Name'
      },
      unit: {
        label: 'Unit',
        placeholder: 'Input Unit Of Parameter'
      },
      numericalOrder: {
        label: 'Numerical Order',
        placeholder: 'Numerical Order'
      },
      action: {
        label: 'Action'
      },
      error: 'Error'
    }
  },
  stationTypeManager: {
    list: {
      title: 'Type Of Station'
    },
    create: {
      label: 'Create',
      success: 'Add New Type Of Station Successfully',
      keyExisted: 'Type Of Station Is Already Existed'
    },
    edit: {
      label: 'Edit',
      success: 'Update Type Of Station Successfully'
    },
    delete: {
      label: 'Delete'
    },
    form: {
      key: {
        label: 'Code',
        placeholder: 'Input Code of Type Of Station',
        error: 'Please Input Code of Type Of Station'
      },
      name: {
        label: 'Name',
        placeholder: 'Input Name of Type Of Station',
        error: 'Please Name of Type Of Station'
      },
      icon: {
        label: 'Icon',
        placeholder: 'Choose Icon'
      },
      auto: {
        label: 'Auto'
      },
      action: {
        label: 'Action'
      },
      error: 'Error',
      errorStationExist: `The Action Can't Be Completed Because There Are Stations In This Type Of Station`,
      color: {
        label: 'Color',
        placeholder: 'Choose Color'
      },
      numericalOrder: {
        label: 'Numerical Order',
        placeholder: 'Numerical Order'
      }
    }
  },
  qcvn: {
    list: {
      title: 'QCVN'
    },
    create: {
      label: 'Create',
      success: 'Add QCVN Successfully',
      keyExisted: 'QCVN Is Already Existed'
    },
    edit: {
      label: 'Edit',
      success: 'Update QCVN Successfully'
    },
    delete: {
      label: 'Delete'
    },
    add: {
      label: 'Add'
    },
    form: {
      key: {
        label: 'Code',
        placeholder: 'Input QCVN Code',
        error: 'Please Input QCVN Code'
      },
      name: {
        label: 'Name',
        placeholder: 'Input QCVN Name',
        error: 'Please Input QCVN Name'
      },
      unit: {
        label: 'Unit',
        placeholder: 'Input Unit Of Parameter'
      },
      numericalOrder: {
        label: 'Numerical Order',
        placeholder: 'Numerical Order'
      },
      action: {
        label: 'Action'
      },
      error: 'Error'
    }
  },
  province: {
    list: {
      title: 'Site',
      key: 'Key',
      numericalOrder: 'Numerical Order'
    },
    create: {
      label: 'Create',
      success: 'Add Unit Successfully',
      keyExisted: 'Name Is Already Existed'
    },
    edit: {
      label: 'Edit',
      success: 'Update Name Successfully'
    },
    delete: {
      label: 'Delete',
      require: 'Please Confirm To Delete'
    },
    add: {
      label: 'Add'
    },
    form: {
      action: 'Action',
      key: {
        label: 'Code',
        placeholder: 'Input Code Of Name',
        error: 'Please Input Code Of Name'
      },
      name: {
        label: 'Name',
        placeholder: 'Input Name',
        error: 'Please input Name'
      },
      numericalOrder: {
        label: 'Numerical Order',
        placeholder: 'Numerical Order'
      }
    }
  },
  configWQI: {
    breadCrumb: 'Config WQI, AQI',
    stationAuto: 'Station Auto',
    stationFixed: 'Staion Fixed',
    stationName: 'Station Name',
    allow: 'Allow caculate',
    stationType: 'Station Type',
    success: 'Update success !',
    error: 'Error!',
    unckecked: 'unchecked'
  },
  ftpTranfer: {
    allowFtpTranfer: 'Send FTP',
    stationName: 'Station Name',
    measureTranfer: 'Measure Tranfer',
    ftpInfo: 'FTP Info',
    ftpConfig: 'Config Info FTP',
    configTranferFTP: 'Config gen file TXT',
    success: 'Update success',
    error: 'Error..!',
    save: 'Save',
    cancel: 'Cancel',
    timeStart: 'Time Start',
    breadCrumb: 'Config sent file TXT to CEM',
    formInFoFTP: {
      ipAddress: {
        title: 'IP Address',
        addonBefore: 'ftp://',
        message: 'Please input ip address'
      },
      port: {
        title: 'Ex: 21',
        addonBefore: 'Port:',
        message: 'Please input port'
      },
      user: {
        title: 'UserName',
        addonBefore: 'UserName: ',
        message: 'Please input username'
      },
      pass: {
        title: 'Pass Word',
        addonBefore: 'Pass:',
        message: 'Please input pass word'
      },
      fileName: {
        name: 'File Name FTP',
        title: 'File Name',
        addonBefore: 'File Name:',
        message: 'Please input file name'
      }
    },
    summary: 'Summary',
    history: 'History tranfer',
    status: {
      title: 'Tranfer status',
      success: 'Tranfer success',
      failed: 'Tranfer failed'
    },
    tryUploadFile: 'Try upload file'
  },
  stationFixedManager: {
    list: {
      title: 'Fixed Station'
    }
  },
  stationAutoManager: {
    list: {
      title: 'Station',
      ftpInfo: 'FTP Info',
      ftpFile: 'FTP File',
      restore: 'Restore',
      remove: 'Remove',
      action: 'Action',
      createdAt: 'Created At',
      config: {
        title: 'Connection configuration',
      },
      notification: {
        title: 'Configure to Send Notifications'
      },
      sampling: {
        title: 'Sampling configuration'
      },
      actions: {
        ftpFolder: 'FTP Folder',
        fileMapping: 'File Mapping',
      }
    },
    create: {
      label: 'Create',
      success: 'Add Station Name Successfully',
      keyExisted: 'Station Name Is Already Existed'
    },
    edit: {
      label: 'Edit',
      success: 'Update Station Name Successfully'
    },
    delete: {
      label: 'Delete',
      require: 'Please Confirm To Delete'
    },
    add: {
      label: 'Add'
    },
    addMeasuring: {
      label: 'Add Measuring',
      error: 'Measuring have at least 1'
    },
    form: {
      key: {
        label: 'Code',
        placeholder: 'Input Code Of Station Name',
        error: 'Please Input Code Of Station Name'
      },
      name: {
        label: 'Name',
        placeholder: 'Input Station Name',
        error: 'Please input Station Name',
        error_length_max: 'Please input no more than 25 characters'
      },
      stationType: {
        label: 'Type',
        placeholder: 'Input Type Of Station',
        error: 'Please Choose Type Of Station'
      },
      address: {
        label: 'Address',
        placeholder: 'Address'
      },
      qcvn: {
        label: 'Standards VN',
        placeholder: 'Standards VN',
        error: 'Please Choose Type Of Standards VN'
      },
      province: {
        label: 'Site',
        placeholder: 'Site',
        error: 'Please Choose Site'
      },
      frequency: {
        label: 'Frequency (m/t)',
        placeholder: 'minutes/time',
        error: 'Please Choose Frequency',
        description:'Note: Used for statistics of data receiving rate and sending alerts'
      },
      dayOfOperation: {
        label: 'Actived At',
        placeholder: 'Actived At',
        error: 'Please Choose Actived At'
      },
      note: {
        label: 'Note',
        placeholder: 'Note',
        error: 'Please Choose Note'
      },
      long: {
        label: 'Longitude',
        placeholder: 'Input longitude',
        error: 'Please Input Longitude'
      },
      lat: {
        label: 'Latitude',
        placeholder: 'Input Latitude',
        error: 'Please Input Latitude'
      },
      emails: {
        label: 'Email Address',
        placeholder: 'Input Email Address',
        error: 'Please Input Email Address',
        description:
          'Note: When data have the problem, in addition to the accounts being managed, the system send additional emails to these addresses.'
      },
      image: {
        label: 'Avata'
      },
      phones: {
        label: 'Phone Number',
        placeholder: 'Input Phone Number',
        error: 'Please Input Phone Number'
      },
      range: {
        label: 'Range'
      },
      measuringKey: {
        label: 'Parameter code',
        placeholder: 'Input Parameter Code',
        error: 'Please Input Parameter Code'
      },
      measuringName: {
        label: 'Parameter Name',
        placeholder: 'Input Parameter Name',
        error: 'Please Input Parameter Name'
      },
      measuringUnit: {
        label: 'Parameter Unit',
        placeholder: 'Input Parameter Unit',
        error: 'Please Input Parameter Unit'
      },
      measuringMinLimit: {
        label: 'Min Limit',
        placeholder: 'Input Min Limit',
        error: 'Please Input Min Limit'
      },
      measuringMaxLimit: {
        label: 'Max Limit',
        placeholder: 'Input Max Limit',
        error: 'Please Input Max Limit'
      },
      measuringMinRange: {
        label: 'Min Range',
        placeholder: 'Input Min Range',
        error: 'Please Input Min Range'
      },
      measuringMaxRange: {
        label: 'Max Range',
        placeholder: 'Input Max Range',
        error: 'Please Input Max Range'
      },
      options: {
        isAllowWarning: 'Allow Warning',
        isAllowRemote: 'Allow Remote'
      },
      mapLocation: {
        label: 'Map Location',
        placeholder: 'Map Location'
      },
      error: 'Error',
      require: 'Please Enter Value'
    },
    range: {
      label: 'Station Range',
      min: 'Min',
      max: 'Max'
    },
    config: {
      label: 'Config',
      extensionFile: 'Extension File',
      fileName: {
        label: 'File Name',
        placeholder: 'File Name'
      },
      path: {
        label: 'Path',
        placeholder: 'Path'
      },
      measuringSrc: {
        label: 'Source Of Parameter',
        placeholder: 'Source Of Parameter',
        error: 'Please Enter Source Of Parameter'
      },
      measuringDes: {
        label: 'Destination Of Parameter',
        placeholder: 'Destination Of Parameter',
        error: 'Please Enter Destination Of Parameter'
      },
      ratio: {
        label: 'Ratio',
        placeholder: 'Ratio',
        error: 'Please Enter Ratio'
      },
      message: {
        success: 'Update station auto config success!',
        error: 'Update station auto config fail!'
      },
      buttonLoadSourceParameter: 'Load Source Parameter',
      errorLoadFile: 'Load file fail with path'
    },
    options: {
      userRole: {
        stationManager: 'Station Manager',
        allowSendWarning: 'Send Notification',
        sms: 'SMS',
        email: 'Email'
      },
      calibration: {
        title: 'Equipment calibration'
      },
      allowSendWarning: {
        label: 'Send Notification',
        placeholder: 'Allow Send Warning'
      },
      allowApprove: {
        label: 'Allow Config Auto Approve Data',
        note: ' *Note: Config Auto Approve Data',
        parameters: 'Parameter Name',
        rules: 'Rules',
        zero: 'Zero',
        negative: 'Negative',
        outOfRange: 'Out of Range',
        deviceStatus: 'Status Devices',
        error: 'Please input range'
      },
      outOfRangeConfig: {
        title: 'Time Config',
        minRange: 'Min',
        maxRange: 'Max',
        to: 'To',
        from: 'From',
        note: '* Note',
        warning: 'Please chose time',
        timeConfig: 'Chose time',
        placeholderTimeFrom: 'From (hours)',
        placeholderTimeTo: 'To (hours)',
        btnCancel: 'Cancel',
        btnSave: 'Save',
        selectTile: 'Repeat',
        placeholderSelect: 'Options',
        daily: 'Daily',
        monday: 'Every monday',
        tuesday: 'Every tuesday',
        wednesday: 'Every wednesday',
        thursday: 'Every thursday',
        friday: 'Every friday',
        saturday: 'Every saturday',
        sunday: 'Every sunday'
      },
      allowSampling: {
        label: 'Allow Sampling',
        placeholder: 'Allow Sampling'
      },
      apiAddress: {
        label: 'API Address',
        placeholder: 'Allow API Address'
      },
      allowCamera: {
        label: 'Allow Camera',
        placeholder: 'Allow Camera',
        add: 'Add'
      },
      name: {
        label: 'Name',
        placeholder: 'Name'
      },
      RTSP: {
        label: 'RTSP URL',
        placeholder: 'RTSP URL',
        error: 'Please enter RTSP URL'
      }
    },
    header: {
      option: 'Options',
      dataLogger: 'DataLogger',
      approve: 'Check Data'
    },
    upload: {
      label: 'Upload',
      error: 'Upload Image Failed'
    },
    uploadFile: {
      label: 'Upload File',
      error: 'File Upload Failed.',
      success: 'File Uploaded Successfully',
      status: {
        uploading: 'Uploading ...',
        finish: 'Done'
      }
    },
    ftpFile: {
      auto: 'Auto',
      choosePath: 'Choose Path',
      titleConfigFTP: 'Config Info FTP',
      folderName: 'Name',
      updateAt: 'CreateAt',
      fileName: 'File Name',
      kind: 'Kind',
      modifiedDate: 'Modified Date',
      size: 'Size',
      NOT_EXIST_FTP:
        'This station does not have FTP directory or FTP directory has changed',
      buttonCreateFTP: 'Click me to create FTP Folder',
      createFTPSuccess: 'Create FTP folder successfully',
      updateFTPSuccess: 'Update FTP folder successfully',
      headerName: 'FTP Info: ',
      addressLabel: 'Address ftp:',
      usernameLabel: 'Username:',
      passwordLabel: 'Password:'
    }
  },
  parameterManager: {
    breadcrumb: {
      base: 'Parameters',
      create: 'Create',
      edit: 'Edit'
    }
  },
  cameraManager: {
    breadcrumb: {
      camera: 'Camera'
    }
  },
  userManager: {
    breadcrumb: {
      list: 'Users',
      rule: 'Assign Role',
      create: 'Create',
      edit: 'Edit'
    },
    form: {
      placeholder: {
        selectUser: 'Select User',
        selectRoleGroup: 'Select Role'
      },
      email: {
        label: 'Email Address',
        placeholder: 'Email Address',
        error: 'The Input Email Address Is Not Valid'
      },
      password: {
        label: 'Password',
        placeholder: 'Password'
      },
      confirmPassword: {
        label: 'Confirm Password',
        placeholder: 'Confirm Password',
        message: 'Please Confirm Your Password!'
      },
      firstName: {
        label: 'First Name',
        placeholder: 'First Name'
      },
      lastName: {
        label: 'Last Name',
        placeholder: 'Last Name'
      },
      country: {
        label: 'Country',
        placeholder: 'Select Country'
      },
      organization: {
        label: 'Organization',
        placeholder: 'Select Organization'
      },
      phone: {
        label: 'Phone',
        placeholder: 'Phone'
      },
      isAdmin: {
        label: 'Admin Role'
      }
    },
    list: {
      enableAccount: 'Enable Account',
      disableAccount: 'Disable Account',
      warning:'You Cannot Disable Your Own Account',
      confirmEnableAccount: 'Do You Want To {0} These Accounts?',
      enable: 'Enable',
      disable: 'Disable',
      deactivate: 'Deactivate',
      action: 'Action',
      email: 'Email',
      country: 'Country',
      login: 'Login',
      status: 'Status',
      roleAssign: 'Assign Role',
      roleName: 'Role Name',
      createdAt: 'Created At',
      setPassword: 'Set Password',
      setPasswordSuccess: 'Update Password Successfully',
      setPasswordFailure: 'Update Password Failure'
    },
    roleAssign: {
      role: 'Role',
      name: 'Role Name',
      nameStation: 'Management Stations',
      success: 'Update Rule User Successfully',
      error: 'Update Rule User Failed',
      address: 'Address',
      isAdmin: 'Admin Role'
    }
  },
  roleManager: {
    breadcrumb: {
      list: 'Roles',
      create: 'Create',
      edit: 'Edit'
    },
    tableHeader: {
      menu: 'Module',
      action: 'Action',
      stt:'#'
    },
    form: {
      name: {
        label: 'Name',
        placeholder: 'Input Name',
        error: 'Please Input Name'
      },
      description: {
        label: 'Description',
        placeholder: 'Input Description',
        error: 'Please Input Description'
      },
    },
    rule: {
      label: 'Rule',
      orderby: {
        label: '#',
        placeholder: '#',
      },
      menu: {
        label: 'menu',
        placeholder: 'menu'
      },
      action: {
        label: 'action',
        placeholder: 'action',
        package: 'Package'
      },
      dashboard: {
        name: 'Dashboard'
      },
      monitoring: {
        name: 'Real-time Monitoring'
      },
      map: {
        name: 'Map'
      },
      camera: {
        name: 'Camera'
      },
      dataSearch: {
        name: 'History Data'
      },
      avgSearch: {
        name: 'Average Data'
      },
      qaqc: {
        name: 'Check Data'
      },
      qaqcConfig: {
        name: 'Sharing Configurations'
      },
      ftpTransfer: {
        name: 'FTP Transfer Configurations'
      },
      aqiMap: {
        name: 'AQI Map'
      },
      aqiSearchData: { name: 'AQI Historical' },
      wqiMap: { name: 'WQI Map ' },
      wqiSearchData: { name: 'WQI Historical' },
      configWQI: { name: 'AQI & WQI Configurations' },
      mapStationFixed: { name: 'Map Fixed Station' },
      dataSearchFixed: { name: 'Fixed Data Search' },
      stationFixed: { name: 'Fixed Station' },
      per_received_data: { name: 'Percent of Received Data' },
      dataExceeded: { name: 'Exceeded Data' },
      stationAuto: { name: 'Station' },
      measuring: { name: 'Parameter' },
      stationType: { name: 'Type of Station' },
      province: { name: 'Site' },
      qcvn: { name: 'Standard' },
      role: { name: 'Role' },
      user: { name: 'User' },
      report: { name: 'Report' },
      actions: {
        role:'Role Assignment',
        enableAccount:'Enable/Disable Account',
        config: 'Config',
        download: 'Download',
        import: 'Import',
        wqi_export: 'Export',
        aqi_export: 'Export',
        isTransfer: 'Edit Send FTP Station',
        updateFTP: 'Edit Info FTP',
        publicStation: 'Edit Publish Station',
        view: 'Xem',
        camera: 'Camera',
        control: 'Sampling',
        chart: 'Chart',
        map: 'Map',
        images: 'Images',
        infoStation: 'Station Information	',
        reviewStation: 'Review Station',
        create: 'Create',
        edit: 'Edit',
        delete: 'Delete',
        export: 'Export',
        manualapprove: 'Manual Approve',
        unapprove: 'Unapprove',
        approve: 'Approve',
        restore: 'Restore',
        remove: 'Remove'
      }
    },
  },
  subscriptionStatus: {
    breadcrumb: {
      base: 'Subscription Status'
    },
    Renew: 'Renew',
    renewAt: 'Renew At',
    currentSubscription: 'Current Subscription',
    subscriptionHistory: 'Subscription History',
    expiredAt: 'Expired At',
    totalUsers: 'Total No. Of Users',
    totalStation: 'Total No. Of Station'
  },
  profileUser: {
    title: 'User Profile',
    success: 'Change Information Successfully',
    viewProfile: 'View Profile',
    configStation: 'Configure to Receive Notifications',
    security: 'Security',
    logOut: 'Log Out',
    changePassword: 'Change Password',
    avatar: 'Avatar',
    email: 'Email',
    LastName: 'Last Name',
    FirstName: 'First Name',
    Birthday: 'Birthday',
    Phone: 'Phone',
    upload: 'Upload',
    imageUpload: {
      success: 'Done',
      error: 'Upload Image Failed'
    },
    user: 'User Info',
    organization: 'Organization Info'
  },
  configStation: {
    name: 'Station Name',
    breadCrumb: 'Configure to Receive Notifications',
    warningStatus: 'Receive Notifications',
    showStation: 'Show Station',
    numericalOrder: 'Numerical Order',
    action: 'Action',
    messageUpdate: {
      success: 'Update successfully!',
      error: 'Update failure!'
    }
  },
  changePassword: {
    breadcrumb: {
      changePassword: 'Change password',
      profileUser: 'Profile',
      security: 'Security Setting'
    },
    form: {
      oldPassword: {
        label: 'Current Password',
        error: 'Please Input Your Current Password'
      },
      newPassword: {
        label: 'New Password',
        error: 'Please Input New Password'
      },
      newPasswordConfirmation: {
        label: 'Password Confirmation',
        error: 'Please Input New Password One More Time',
        error1: 'Passwords Are Not Matched'
      },
      Success: 'Change Password Successfully',
      compare: 'Two Passwords That You Enter Is Inconsistent',
      savePassword: 'Save Password'
    }
  },
  resetPassword: {
    key: 'I Forgot My Password',
    key2:
      "Enter your email address and we'll send you an email with instruction to reset your password",
    key3: 'Reset Password',
    key4: 'Resend Code',
    key5: 'Confirm',
    key6: 'Send Code'
  },
  security: {
    label: 'Two-Factor Authentication',
    enable2FA: 'Enable 2FA Authentication',
    disable2FA: 'Disable 2FA Authentication',
    confirmPasswordLabel: "To continue, first verify it's you",
    confirmPasswordError: "Password not match",
    enterPassword: 'Enter your password',
    confirm: 'Confirm',
    note:
      'If you turn on Two-Factor Authentication feature, The system will send the verification code to your email address or phone number every time you sign in',
    success: 'Success',
    failure: 'Save failure',
    message: {
      userUse: 'You are using 2-layer authentication with {{=it.type}}',
      code:
        'Your verification code has been sent to: {{=it.phone}} (will expire after {{=it.expired}})',
      info: `Select authentication method when logging in:`
    },
    step1: 'Enter code',
    step2: 'Loading',
    step3: 'Done',
    send: 'Send',
    use: {
      email: 'Use Email',
      sms: 'Use SMS'
    }
  },
  login: {
    title: 'Login',
    twoFactorAlert:
      'Two-Factor Authentication - Your verification code will be sent to {{=it.email}}!',
    form: {
      email: {
        label: 'Email Address',
        placeholder: 'user@example.com'
      },
      password: {
        label: 'Password',
        placeholder: '********'
      },
      twoFactor: {
        label: 'Verification Code',
        placeholder: 'xxxx'
      },
      buttonLogin: 'Login',
      buttonTwoFactor: 'Verify'
    },
    errors: {
      emailOrPasswordIncorrect: 'The email or password is incorrect.',
      accountDisable: 'Your account is disabled',
      accountDelete: 'Your account is delete',
      accountNotActivated: 'Your account is not activated.',
      codeNotEqual: 'Authentication code is incorrect.',
      organizationNotExist: 'Your organization is not exist.'
    }
  },
  warningLevels: {
    title: 'Warning Levels',
    good: 'Good',
    exceedTendency: 'Tend To Exceed',
    exceedPreparing: 'Tend To Exceed',
    exceed: 'Exceeded',
    lossData: 'Lost Connection',
    sensorError: 'Sensor Error'
  },
  addon: {
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    reset: 'Reset',
    remove: 'Remove',
    restore: 'Restore',
    sendRequest: 'Send Request',
    onSave: {
      add: {
        success: 'Added Successfully',
        error: 'Add Error'
      },
      update: {
        success: 'Updated Successfully',
        error: 'Update Error'
      }
    },
    onDelete: {
      success: 'Deleted Successfully',
      error: 'Delete Error',
      warning: 'You cannot delete your own account'
    },
    onRestore: {
      success: 'Restored Successfully',
      error: 'Restore Error'
    },
    search: 'Search',
    error: 'Something Went Wrong!!!',
    warning: 'Warning',
    refresh: 'Refresh',
    cancel: 'Cancel',
    ok: 'Ok'
  },
  success: {
    text: 'Success'
  },
  error: {
    text: 'Errors',
    warningText: 'Warning',
    require: 'Require',
    email: 'Invalid Email Address',
    nullValue: 'Value is not available',
    monitoring: {
      sampling: {
        resetTitle: 'Confirm',
        resetSubtitle: 'Do you want to reset sampled bottle to zero?',
        updateScheduleTitle: 'Confirm',
        updateScheduleSubtitle:
          'The number of bottles you want to get is invalid or the start time is less than 5 minutes compared to the current time',
        takeSampling: `
          <div style="text-align: left">
          <p>Unable to connect to the control device, please check the information:</p>
            <p style="margin-left: 20px">1. Configuration information with control device</p>
            <p style="margin-left: 20px">2. Operation status of control device</p>
            <p style="margin-left: 20px">3. Network signal to control device</p>
          </div>  
        `
      }
    }
  },
  modal: {
    confirm: {
      title: 'Confirm',
      monitoring: {
        sampling: {
          cancelSchedule:
            'Are you sure you want to Cancel automatically sampling?'
        }
      }
    }
  },
  alert: {
    error: {
      monitoring: {
        saveSampingConfig: 'Please enter all information before Saving'
      }
    }
  },
  form: {
    save: 'Save',
    update: 'Update'
  },
  menuApp: {
    dashboard: 'Dashboard',

    monitoringSub: 'Data Monitoring',
    monitoring: {
      base: 'Real-time Monitoring',
      map: 'Map',
      camera: 'Camera',
      historyData: 'History Data',
      avgData: 'Average Data',
      report: 'Reports'
    },

    processDataSub: 'Data Processing',
    processData: {
      approveData: 'Check Data',
      config: 'Config'
    },

    shareDataSub: 'Sharing Data',
    shareData: {
      shareConfig: 'Sharing Configurations',
      ftpConfig: 'FTP Transfer Configurations'
    },

    advanceSub: 'Advanced',
    advance: {
      aqiMap: 'AQI Map',
      aqiStatistic: 'AQI Historical',
      wqiMap: 'WQI Map',
      wqiStatistic: 'WQI Historical',
      config: 'AQI & WQI Configurations'
    },

    configSub: 'Settings',
    config: {
      stationAuto: 'Station',
      stationAutoConnection: 'Connection configuration',
      sendNotification: 'Configure to Send Notifications',
      sampling: 'Sampling configuration',
      parameter: 'Parameter',
      stationType: 'Type of Station',
      site: 'Site',
      standard: 'Standard',
      role: 'Role',
      user: 'User'
    },

    camera: 'Camera',
    map: 'Map',
    data: 'Data',
    dataSearch: 'Data Search',
    dataSearchFixed: 'Fixed Data Search',
    avgData: 'Average Data',
    manage: 'Manage',
    measuring: 'Parameter',
    stationType: 'Type Of Station',
    stationAuto: 'Station Name',
    stationFixed: 'Fixed Station',
    adminManagement: 'Administration',
    user: 'User',
    role: 'Role',
    subscription: 'Subscription',
    support: 'Support',
    province: 'Management',
    ftpTranfer: 'FTP Tranfer',
    publishShare: 'publish & Sharing',
    configWQI: 'Config WQI, AQI',
    groupStatistic: 'Statistic',
    mapFixed: 'Map'
  },
  cameraControl: {
    selectStationPlaceholder: 'Input Station Name'
  },
  support: {
    breadcrumb: {
      base: 'Support'
    },
    form: {
      type: {
        label: 'Type',
        error: 'Please select type'
      },
      title: {
        label: 'Title',
        error: 'Please input title'
      },
      content: {
        label: 'Content',
        error: 'Please input content'
      },
      upload: {
        label: 'Upload',
        buttonLabel: 'Click to Upload',
        error: 'Error'
      }
    }
  },
  documents: {
    label: 'Documents helpdesk',
    guide1: 'Guide install 1',
    guide2: 'Guide install 2',
    develop: {
      title: 'This function is developing',
      process: 'We will send newsletter when we complete'
    }
  },
  statistic: {
    exceeded: 'Exceeded',
    perRecData: 'Percent Of Received Data',
    perRecDataFrom: {
      breadCrumb: 'Percent Of Received Data',
      time: 'Thời gian',
      totalFile: 'Total file/day',
      totalFileReceivedAt: 'Total file received',
      perFileReceivedAt: 'Ratio file received (%)'
    },
    exceededFrom: {
      breadCrumb: 'Statistics of the number of passes/days',
      time: 'Thời gian',
      totalFile: 'Total file/day',
      totalFileReceivedAt: 'Total file received',
      perFileReceivedAt: 'Ratio file received (%)'
    },
    aqi: {
      menuApp: 'AQI',
      breadCrumb: 'AQI hours - days',
      selectMonths: 'Select months',
      time: 'Time',
      day: 'Day',
      title: 'AQI By Hours'
    },
    wqi: {
      menuApp: 'WQI',
      breadCrumb: 'WQI',
      selectMonths: 'Select months',
      time: 'Time',
      day: 'Day',
      title: 'WQI By Hours'
    }
  },
  pageInfo: {
    header: 'Information',
    body1:'This is a function of the Advanced version, please contact us for more information:',
    body2: 'Email: sales@vietan-software.com'
  },
  stationStatus: {
    good: 'Good',
    lostSignal: 'Lost Signal',
    notConnected: 'Chưa kết nối',
    connecting: 'Connecting',
    connected: 'Connected',
    exceeded: 'Exceeded',
    exceededPreparing: 'Almost Exceed',
    exceededTendency: 'Tend To Exceed',
  },
  actions: {
    "gotoMonitoring": "Go to Real-time Monitoring Page",
    "viewDataAroundThisTime": "View data around this time"
  },
  network: {
    sampling: {
      lostConnection: "Unable to connect to the sampling service, please contact the administrator!"
    },
    camera: {
      lostConnection: "Can't connect with Camera, Please check the connection!"
    },
    qaqc: {
      lostConnection: "Unable to connect to the QAQC service, please contact the administrator!"
    }
  },
  serverResponse: {
    error: {
      VersionError: "Data has been updated by other users, please refresh!"
    }
  },
  confirm: {
    msg: {
      restore: 'Do you want to restore this item?',
      delete: 'Do you want to delete this item?'
    }
  }
}

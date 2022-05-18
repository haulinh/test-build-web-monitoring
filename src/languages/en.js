export default {
  languageSetup: {
    setup: 'Language setup',
    warningContent:
      '<span>"{{=it.lang}}"</span> will be applied for remaning languages',
  },
  notificationFreq: {
    only1: 'Once only',
    _5Min: 'Every 5 minutes',
    _15Min: 'Every 15 minutes',
    _30Min: 'Every 30 minutes',
    _every1Hour: 'Every 1 hour',
    _every2Hour: 'Every 2 hours',
    _every1Day: 'Every day',
    _every2Day: 'Every 2 days',
  },
  global: {
    disable: 'Disable',
    enable: 'Enable',
    cancel: 'Cancel',
    submit: 'Submit',
    verify: 'Verify',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    phoneNumber: 'Phone number',
    email: 'Email',
    required: 'Required',
    invalidEmail: 'Invalid email',
    save: 'Save',
    send: 'Send',
    unknownError: 'Unknown error, try again after',
    password: 'Password',
    noPermission: "You don't have permissions",
    saveSuccess: 'Save successfully',
    all: 'All',
    upload: 'Upload',
    parameter: 'Parameter',
    example: 'Example',
    copySuccess: 'Copy successfully',
    loading: 'Loading',
    back: 'Back',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    leave: 'Agree',
    leaveConfirm: {
      title: 'Exit session',
      content:
        'Exit this session. Are you sure you want to exit the session without saving information?',
    },
  },
  rules: {
    required: 'Required',
    requiredName: 'Please enter name',
    requiredRtsp: 'Please enter RTSP address',
    requiredEmail: 'Email is required',
    requiredPhone: 'Phone number is required',
    requiredField: '{{=it.field}} is required',
    inValidField: '{{=it.field}} is invalid',
    max32: 'No more than 32 characters',
    max64: 'No more than 64 characters',
    max256: 'No more than 256 characters',
    max512: 'No more 512 characters',
  },
  errors: {
    forbidden: 'Forbidden',
    esms: {
      100: 'Send successfully',
      99: 'Unknown error, try again after',
      101: 'Incorrect api key or secret key',
      102: 'The account is locked',
      103: 'Account balance is not enough to send messages',
      104: 'Brandname code is incorrect',
    },
    mailGun: {
      401: 'Unauthorized - No valid API key provided',
      404: 'Not Found - The requested item doesn’t exist',
    },
  },
  empty: {
    camera: {
      description: 'Camera not found',
      action: 'Camera configuration',
      errorAuth: 'Authentication error',
      errorNetword: "Can't connect to camera server, please try again",
      errorUnavailable: "Can't connect to camera server, please try again",
      errorInvalidRtsp: 'Invalid Rtsp',
      timeout: "Can't connect to camera server, please try again",
    },
    wqi: {
      description: 'Station not found',
      action: 'WQI configuration',
    },
  },
  notification: {
    label: 'Notifications',
    removeAll: 'Remove all notifications',
    toolTipEnable: 'Receive all realtime notifications from iLotusLand',
    markAll: 'Mark all as read',
    delele: 'Delete this message',
    tickRead: 'Mark as read',
    tickUnRead: 'Mark unread',
    pushNotification: 'Push notifications',
  },
  contact: {
    phone: 'Phone',
    email: 'Email',
  },
  unit: {
    time: {
      second: 'second',
      minute: 'minute',
      hour: 'hour',
    },
  },
  chart: {
    all: 'All',
    time: 'Time',
    from: 'From',
    to: 'To',
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
      name: 'Station Name',
      time: 'Date time',
      dataStatus: 'Status',
    },
    chartRatio: {
      title: 'Data receiving rate',
      dataByDate: 'The {{=it.day}}-day {{=it.unit}} data rate',
      received: 'Recieved Data',
      notReceived: `Not Recieved`,
      byDay: '{{=it.day}} days',
    },
    chartStatus: {
      title: 'Connection status of the station',
      titleByUnit: 'Rate of receiving data of {{=it.unit}} unit',
      activate: 'Connecting',
      inactive: `Inactive`,
      dataLoss: `Disconnected`,
      stations: 'stations',
      max: 'Maximum: {{=it.max}}',
      min: 'Minimum: {{=it.min}}',
    },
    activeStationPer: 'Station Active ({{=it.good}}/{{=it.total}})',
    unit: 'Unit',
    total: 'Total ({{=it.total}})',
    newNotification: 'New Notification',
    status: {
      disconnected: 'Lost connection',
      exceeded: 'Exceeded',
      exceededPreparing: 'Tend to exceed',
      good: 'Good',
    },
    managementArea: 'Management Area',
    statusDescription: {
      disconnected: 'Cannot connect to the device or no data is available.',
      good: 'The data value is transmitted within the allowed threshold.',
      exceededPreparing:
        'The data value transmitted is about to exceed the threshold.',
      exceeded: 'The transmitted data value exceeds the threshold set.',
      maintenance:
        'The device is calibrating, the transmitted value may not be correct.',
      sensorError:
        'The device is faulty, the transmitted value may not be correct.',
      goodDevice: 'The device is in the normal state.',
    },
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
    noData: 'No Data',
    withoutLimit: 'Without Limit',
    deviceStatus: {
      dataloss: 'Lost connection',
      sensorError: 'Device error',
      maintenance: 'Calibration',
      sensorNormal: 'Good',
      normal: 'Normal',
      broken: 'Broken',
      good: 'Good',
    },
    statusResult: 'Monitoring results',
    note: 'Note',
    actions: {
      sampling: 'Sampling',
      camera: 'Camera',
      chart: 'Chart',
      map: 'Map',
      images: 'Station Photos',
      stationInfo: 'Station Information',
      reviewStation: 'Station Reviews',
      more: {
        label: 'Link',
        historyData: 'History Data',
        averageData: 'History Average Data',
        checkData: 'Check Data',
        config: 'Configure to Send Notifications',
      },
    },
    moreContent: {
      sampling: {
        error: {
          duplicateTagName: 'Duplicate tagname',
        },
        tabs: {
          sampling: 'Sampling',
          history: 'History',
          config: 'Config',
        },
        content: {
          reset: 'Reset',
          totalBottles: 'Total bottles:',
          sampledBottles: 'Sampled bottles:',
          methodSampling: 'Method Sampling',
          typeOfSampling: 'Action',
          immediatelySampling: 'Immediately Sampling',
          scheduleSampling: 'Schedule Sampling',
          bottlesNeedToTake: 'Bottles need to take:',
          frequency: 'Frequency (minutes):',
          timeStartSampling: 'Time start sampling:',
          dateStartSampling: 'Date start sampling:',
          takeSample: 'Take Sample',
          commandSent: 'Sending command',
          takingSample: 'Sampling...',
          takeSampleExceeded:
            'Activate sampling when the threshold is exceeded',
          cancelTakeSampleExceeded:
            'Activated sampling upon threshold (Click to cancel)',
          active: 'Active',
          actived: 'Actived (Click to cancel Sampling by Scheduled)',
          activeOverRange: 'Active Take sample when data over-range',
          activedOverRange:
            'Actived Take sample when data over-range (Click to Cancel)',
          history: {
            stt: 'No.',
            bottleNo: 'Bottle No',
            dateTime: 'Date time',
            typeOfSampling: 'Action',
            activedUser: 'Actived User',
            result: 'Result',
            manual: 'Immediately Sampling',
            exceeded: 'Take sampling when exceeded',
            automatic: 'Automatic Sampling',
            cancel_schedule: 'Cancel Sampling By Scheduled',
            active_schedule: 'Active Sampling By Scheduled',
            cancel_exceeded: 'Cancel Sampling By Exceeded',
            active_exceeded: 'Active Sampling By Exceeded',
            config: 'Modify Configuration',
            reset_bottles: 'Reset Sampled Bottles',
            success: 'success',
            failed: 'failed',
          },
          config: {
            totalBottles: 'Total bottles:',
            controlTagName: 'Controlling Tag name:',
            timeToTakeOneBottle: 'Time to take one bottle (minutes):',
            save: 'Save',
            generalConfig: 'General config',
            exceededConfig: 'Configure when threshold sampling',
          },
        },
      },
      chart: {
        tab: {
          avgHour: 'Hourly',
          avgDay: 'Daily',
        },
        content: {
          minLimit: 'Minimum',
          maxLimit: 'Maximum',
          to: 'To',
          from: 'From',
        },
      },
    },
    exceeded: {
      table: {
        parameter: 'Parameters',
        active: 'Active',
        operator: 'Operator',
        value: 'Value',
        standrandValue: 'Standard value',
        greaterThan: 'greate than',
        lessThan: 'less than',
        notSetup: 'Not setup',
        invalidValue: 'Invalid valud',
        requiredInput: 'Please input value',
      },
      numRecord: 'num record',
      numRecordExceed:
        'Number of records exceeding the threshold continuously to be sampled',
    },
  },
  aqi: {
    title: 'Air Quality Index',
    paramsTitle: 'The {{= it.day}}-day AQI value of each parameter',
  },
  aqiConfigCalculation: {
    pageName: 'Configure to AQI calculation',
    tab1: 'Prediction threshold',
    tab2: 'BPi value table',
    tab3: 'Calculation parameters',
    add: 'Add',
    required1D_1H: 'Enter at least AVG Date or AVG Hour',
    required: 'Please input value',
    compareToMax: 'Minimum value must be less than maximum',
    compareToMin: 'The maximum value must be greater than the minimum',
    collevel: 'Level',
    colValue: 'Value',
    colLevel: 'Level Name',
    colMin: 'Min',
    colMax: 'Max',
    colColor: 'Color',
    colBatBuoc: 'Required',
    colBackgroundColor: 'Background Color',
    colDescription: 'Description',
    colMeasureKey: 'Measure Key',
    colMeasure: 'Measure',
    colAvg1H: 'Average 1 hour',
    colAvg8H: 'Average 8 hour',
    colAvg1D: 'Average 1 day',
    colUnit: 'Unit',
    phuongPhapTinh: 'AQI calculation method',
    cauHinh: 'Configuration of calculation',
    taiLieu: 'Documentation on calculations',
    config: 'Configuration',
    view: 'View',
    error: {
      MEASURE_KEY_DUPLICATE: 'Duplicate Measure Key',
    },
  },
  wqi: {
    title: 'Water Quality Index',
    move: 'Move',
    reference:
      'You need to navigate to the WQI Calculation page to select the WQI calculation formula',
    form: {
      wqiKey: {
        label: 'Select WQI',
        placeholder: 'WQI',
        require: 'Please Choose WQI',
      },
    },
    wqi_hour: {
      header: 'REPORT ON CALCULATION OF WQI BY HOURS',
      title:
        'The statistics for the WQI hour math results by the period from {{= it.fromDate}} to {{= it.toDate}}',
    },
    wqi_day: {
      header: 'REPORT ON CALCULATION OF WQI BY DAY',
      title:
        'The statistics for the WQI day math results by the period from {{= it.fromDate}} to {{= it.toDate}}',
    },
  },
  wqiConfigCalculation: {
    pageName: 'Configure to WQI calculation',
    tab1: 'Prediction threshold',
    tab2: 'BPi value table',
    tab3: 'Calculation parameters',
    tab4: 'Configure parameter Groups',
    add: 'Add',
    required1D_1H: 'Enter at least AVG Date or AVG Hour',
    required: 'Please input value',
    compareToMax: 'Minimum value must be less than maximum',
    compareToMin: 'The maximum value must be greater than the minimum',
    collevel: 'Level',
    colValue: 'Value',
    colLevel: 'Level Name',
    colOperate: 'Operate',
    colMin: 'Min',
    colMax: 'Max',
    colMin2: 'Min',
    colMax2: 'Max',
    colColor: 'Color',
    colBatBuoc: 'Required',
    colBelongTemp: 'Belong Temp',
    colBackgroundColor: 'Background Color',
    colDescription: 'Description',
    colMeasureKey: 'Measure Key',
    colMeasure: 'Measure',
    colAvg1H: 'Average 1 hour',
    colAvg8H: 'Average 8 hour',
    colAvg1D: 'Average 1 day',
    colUnit: 'Unit',
    colGroupParam: 'Parameter group',
    valWeightParam: 'Weighted',
    valMinimumNumber: 'Minimum number of parameters for each group',
    colGroupI: 'Group I',
    colGroupII: 'Group II',
    colGroupIII: 'Group III',
    colGroupIV: 'Group IV',
    colGroupV: 'Group V',
    phuongPhapTinh: 'WQI calculation method',
    cauHinh: 'Configuration of calculation',
    taiLieu: 'Documentation on calculations',
    config: 'Configuration',
    view: 'View',
    error: {
      MEASURE_KEY_DUPLICATE: 'Duplicate Measure Key',
    },
  },
  qaqc: {
    configPublish: {
      title: 'Publish Configuration',
      stationName: 'Station Name',
      publish: 'Publish',
      measurePublish: 'Measuring Publish',
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
      deviceError: 'Sensor error',
      deviceCalibration: 'Sensor Calibration',
      isZero: 'Is Zero',
      deviceStatus: 'Device Status',
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
    timeRange: 'Time Range',
    valueRange: 'Value Condition',
    ok: 'OK',
    province: {
      label: 'Select Site',
      placeholder: 'Select Site',
    },
    notEmpty: '{{=it.value}} is required!',
    pageInfo: '{{=it.from}}-{{=it.to}} of {{it.total}} items',
    msg: {
      confirmUnApprove: 'Do you want to cancel the selected approval?',
      success: 'Saved Successfully',
      failure: 'Save failure',
    },
    date: {
      from: 'From Date',
      to: 'To Date',
    },
    outOfRange: 'Out of range',
  },
  qaqcConfig: {
    title: 'Data Processing',
    beyondMeasuringRange: 'Out Of Range',
    deviceError: 'Device Error',
    deviceCalibration: 'Device Calibration',
    zero: 'Zero Value',
    negative: 'Negative Value',
    timeRange: 'Time Range',
    valueRange: 'Value Condition',
    basic: {
      title: 'Basic Filter',
      useBasicConfig: 'Zero Value, Negative And Repeat',
      repeat: 'Repeat',
      tooltipRepeat: 'Set to remove value based on number of repetitions',
      placeholderRepeat: 'Number of repetitions',
      removeValues: 'Remove Values:',
      error: {
        repeat: 'Please set the number of repetitions greater than 1',
      },
    },
    advanced: {
      title: 'Advanced Filter',
      tab: {
        time: 'Filter By Time Range',
        value: 'Filter By Value Condition',
      },
      placeholder: {
        stationType: 'Choose Type Of Station',
        station: 'Choose Station',
      },
      button: {
        reset: 'Reset',
        create: 'Create',
        delete: 'Delete Filter',
        update: 'Update',
        cancel: 'Cancel',
        continueCreate: 'Continue Creating',
        continueEdit: 'Continue Editing',
        close: 'Close',
      },
      message: {
        create: {
          success: 'Create Successfully',
          error: 'Create Unsuccessfully',
        },
        update: {
          success: 'Update Successfully',
          error: 'Update Unsuccessfully',
        },
        delete: {
          success: 'Delete Successfully',
          error: 'Delete Unsuccessfully',
        },
      },
      modal: {
        create: {
          title: 'Add Filter Condition',
        },
        edit: {
          title: 'Edit Filter Condition',
        },
        delete: {
          title: 'Confirm Filter Deletion',
          message:
            'Be sure to delete the data filter, all data of reports and statistics will no longer apply the filter to calculate',
        },
        cancel: {
          create: {
            title: 'Cancel Creating',
            message: `Filter data has not been created. If the window is closed, the filter's data entered will not be saved.`,
          },
          edit: {
            title: 'Cancel Editing',
            message:
              'Filter data has not been saved. If the window is closed, the filter edits entered will not be saved.',
          },
        },
      },
      label: {
        stationType: 'Types Of Station',
        station: 'Station Name',
      },
      conditionFilter: {
        toggle: 'Value Condition Filter',
        table: {
          title: {
            conditionName: `Condition's Name`,
            applicableStation: 'Applicable Station',
            conditionParameter: 'Condition Parameter',
            excludeParameter: 'Exclude Parameters',
          },
          footer: 'Add Filter Condition',
        },
        form: {
          label: {
            filterName: 'Name Of Filter',
          },
          placeholder: {
            filterName: 'Name Of Filter',
            conditionParameter: 'Choose parameter',
            excludeParameter: 'Choose parameters which will be exclude',
          },
          error: {
            filterName: 'Please type name of filter',
            stationType: 'Please choose type of station',
            station: 'Please choose station',
            conditionParameter: 'Please choose parameter',
            value: 'Please type value',
            excludeParameter: 'Please choose at least one parameter',
            maxInput: 'No more than 64 characters',
            whitespace: 'Please type data',
          },
          table: {
            title: {
              conditionParameter: 'Condition Parameter',
              excludeParameter: 'Exclude Parameters',
            },
            footer: 'Add Filter Condition',
          },
        },
      },
      timeFilter: {
        toggle: 'Time Range Filter',
        table: {
          title: {
            station: 'Station Name',
            parameter: 'Parameter',
            status: 'Status',
          },
          footer: 'Add Filter Condition',
          expire: 'Expire',
          inUse: 'In use',
        },
        form: {
          placeholder: {
            startTime: 'Start time',
            endTime: 'End time',
          },
          error: {
            time: 'Please choose time range',
          },
          table: {
            title: {
              parameter: 'Parameters',
              timeRange: 'Time Range',
            },
          },
        },
      },
    },
  },
  controlStation: {
    text: 'Sampling',
    breadcrumb: {
      trigger: 'Sampling',
      history: 'History',
      config: 'Config',
    },
    trigger: {
      triggerSuccess: 'Trigger Succeeded',
      triggerCancel: 'Trigger Cancel Succeeded',
      triggerExceeded: ' Trigger Exceeded',
    },
    config: {
      reset: 'Reset Succeeded',
      success: 'Config Succeeded',
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
    viewMore: 'View More',
    listStep: {
      step1: 'Getting Started',
      step2: 'Sending command',
      step3: 'Sampling',
      step4: 'Success',
    },
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
      stationStatus: 'Station Status',
    },
    menuLeft: {
      stationSearch: 'Search By Station',
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
        detail: 'Detail',
      },
    },
    marker: {
      transmitting: 'Transmitting',
      dataLoss: 'Disconnected',
      notUse: 'Not In Use',
      info: 'Info',
      image: 'Image',
      time: 'Time',
      status: 'Status',
      result: 'Results',
    },
  },
  dataSearchFixed: {
    downloadTemplate: 'Download Template',
    importData: 'Import Data',
    importSuccess: 'Import Data Success',
    importFailed: 'Import Data Failed',
  },
  dataSearchFrom: {
    tooltip:
      'Filter invalid data with standard from Data processing configuration',
    queryType: 'Type of data',
    filterDataBy: 'Filter data by',
    processData: 'Data processing',
    titleText: 'Data Search',
    options: {
      byHours: '{{=it.value}} Hours',
      byHoursDetail: '{{=it.value}} Hours ({{=it.detailHours}})',
      byDay: '{{=it.value}} Days',
      byDayDetail: '{{=it.value}} Days ({{=it.detailDay}})',
      range: 'In range',
    },
    form: {
      other: 'Other',
      all: 'All',
      time: 'Time',
      search: 'Search',
      device: {
        label: 'Device',
        placeholder: 'Select Device',
      },
      stationType: {
        label: 'Types Of Station',
        placeholder: 'Select Types Of Station',
        require: 'Please Choose Types Of Station',
      },
      aqiConfigSelect: {
        label: 'Select AQI',
        placeholder: 'Select AQI',
        require: 'Please Choose AQI',
      },
      stationAuto: {
        label: 'Station Name',
        placeholder: 'Select Station Name',
      },
      fromDate: {
        label: 'Start',
        placeholder: 'Select Starting Date',
      },
      toDate: {
        label: 'End',
        placeholder: 'Select Ending date',
      },
      measuringList: {
        label: 'Parameters',
        placeholder: 'Select Parameter',
        require: 'Choose At Least 1 Parameter',
      },
      isExceeded: {
        label: 'Only Exceeded',
      },
      operator: {
        label: 'Operator',
      },
      value: {
        label: 'Value',
      },
      type: {
        label: 'Type Of Report',
      },
      advanced: {
        label: 'Advanced',
        reset: 'Reset',
      },
      filterDataBy: {
        require: 'Please choose at least 1 condition',
      },
    },
    table: {
      emptyText: 'There Are No Records To Display',
      receivedAt: 'Time Send File',
      time: 'Date Time',
      all: 'All',
      numericalOrder: 'No.',
    },
    tab: {
      data: 'Data',
      chart: 'Chart',
      exportExcel: 'Export To Excel',
      statusExport: 'Exporting...',
      dataProcess: 'Recalculate the Result',
    },
    analyze: {
      max: 'Max',
      maxTime: 'Max Time',
      min: 'Min',
      minTime: 'Min Time',
      avg: 'Average',
      parameters: 'Parameters',
    },
  },
  aqiSearchForm: {
    form: {
      inRange: {
        label: 'In Range',
        error: 'Please Choose In Range',
      },
      from: {
        label: 'Time Frame From',
        error: 'Please Choose Time Frame',
      },
      to: {
        label: 'To',
      },
    },
  },

  avgSearchFrom: {
    titleText: 'AVG data',
    excelMultiple: 'System processing, the report will be send to your email: ',
    error: {
      dataTooMuch:
        'Your data is too large, please consider select shorter time range !',
    },
    form: {
      time: 'Time',
      stationType: {
        label: 'Types Of Station',
        placeholder: 'Select Types Of Station',
        error: 'Please Choose Types Of Station',
      },
      rangesDate: {
        error: 'Please Choose Time',
      },
      stationAuto: {
        label: 'Station Name',
        placeholder: 'Select Station Name',
        error: 'Please Choose Station Name',
      },
      fromDate: {
        label: 'Start',
        placeholder: 'Select Starting Date',
      },
      toDate: {
        label: 'End',
        placeholder: 'Select Ending Date',
      },
      fromMonth: {
        label: 'From Month/Year',
        placeholder: 'Select Month/Year',
        error: 'Please Choose The Time',
      },
      toMonth: {
        label: 'To  Month/Year',
        placeholder: 'Select Month/Year',
        error: 'Please Choose The Time',
        error1: 'The Start Date Is Greater Than The End Date',
        error2: 'Do not exceed the current month',
      },
      measuringList: {
        label: 'Parameters',
        placeholder: 'Select Parameter',
        require: 'Choose At Least 1 Parameter',
      },
      isExceeded: {
        label: 'Only Exceeded Data',
      },
      operator: {
        label: 'Operator',
      },
      value: {
        label: 'Value',
      },
      type: {
        label: 'Average Data',
        error: 'Please Choose Average Data',
      },
      advanced: {
        label: 'Advanced',
      },
    },
    table: {
      view: 'View',
      receivedAt: 'Received At',
      all: 'All',
      emptyText: 'There Are No Records To Display',
      header1: 'Station Name',
      header2: 'Frequency of data transmission  (minutes/times)',
      header3: 'Total records by design',
      header4: 'Total records by the fact',
      header5: 'Percentage of received data (%)',
      header6: 'The starting date of data transmission',
      header7: 'Day/Month',
      header8: 'Hours',
      header9: 'Percentage of exceeded data (%)',
      title: 'REPORT THE PERCENTAGE OF OBTAINED DATA',
      titleMonitoring: 'REPORT THE PERCENTAGE OF MONITORING DATA',
      descriptionRatioMonth:
        'Statistics about the Percentage of data obtained of stations from {{=it.from}} to {{=it.to}}',
      descriptionRatioDate:
        'Statistics about the Percentage of data obtained of stations from {{=it.from}} to {{=it.to}}',
      descriptionRatioMonitoringMonth:
        'Statistics about the percentage of monitoring data from {{=it.from}} to {{=it.to}}',
      descriptionRatioMonitoringDate:
        'Statistics about the percentage of monitoring data from {{=it.from}} to {{=it.to}}',
      title2: 'REPORT THE RESULTS OF 24-HOUR AVERAGE MONITORING',
      description2:
        'Statistics about Results of 24-hour average monitoring of {{=it.stationName}} station in {{=it.monthYear}}',
      title3: 'REPORT THE RESULTS OF AVERAGE MAXIMUM 1 HOUR OF THE DAY',
      description3:
        'Statistics about Results of Average maximum 1 hour of the day of {{=it.stationName}} station in {{=it.monthYear}}',
      title4: 'REPORT THE PERCENTAGE OF EXCEEDED DATA',
      description4:
        'Statistics about the percentage of exceeded of {{=it.fromMonth}} station in {{=it.toMonth}}',
      title5: 'REPORT THE RESULTS OF AVERAGE MAXIMUM 8 HOUR OF THE DAY',
      description5:
        'Statistics about Results of Average maximum 8 hour of the day of {{=it.stationName}} station in {{=it.monthYear}}',
      descriptionStatusData:
        'The statistics for the average observation results time from {{=it.from}} to {{=it.to}}',
      title6: 'REPORT THE RESULTS OF 1-HOUR AVERAGE MONITORING',
      description6:
        'Statistics about Results of 1-hour average monitoring of {{=it.stationName}} station in {{=it.dayFormat}}',
    },
    selectTimeRange: {
      startTime: 'Start Time',
      endTime: 'End Time',
      minute: 'Minute',
      hour: 'Hour',
      day: 'Day',
      month: 'Month',
      year: 'Year',
      errorMonth: 'Please Choose The Month',
      errorDay: 'Please Choose The Day',
      error: 'Please Choose The Time',
    },
    tab: {
      data: 'Data',
      chart: 'Chart',
      exportExcel: 'Export To Excel',
      exportExcelAll: 'Export all via email',
      statusExport: 'Exporting ...',
    },
    search: {
      subMenuAvgData: {
        title: 'Avg data',
        dataSearch: 'Data search',
        placeholderSearch: 'Enter the filter name ...',
        confirm: {
          title: 'Are you sure delete this filter?',
          yes: 'Yes',
          no: 'No',
        },
      },
      subMenuFilters: 'Filters',
    },
    stationForm: {
      length: 'Station list ({{=it.stationLength}} station)',
    },
    filterForm: {
      title: 'Save filter',
      description:
        'The data selected by the fields created by you will be stored when you name this filter.',
      name: {
        label: 'Name',
        placeholder: 'Name of filter',
        isEmpty: 'Please type name of filter',
        isExist: 'Name is exist',
      },
    },
  },
  dataSearchFilterForm: {
    titleText: 'Data Search Filter',
    update: {
      label: 'Update',
      success: 'Update successfully',
    },
    create: {
      label: 'Create new filter',
      success: 'Create new filter successfully',
      nameIsExist: 'Filter name is exist',
    },
    form: {
      time: 'Time',
      name: {
        label: 'Filter name',
        placeholder: 'Enter the filter name',
      },
      stationType: {
        label: 'Types Of Station',
        placeholder: 'Select Types Of Station',
        error: 'Please Choose Types Of Station',
      },
      rangesDate: {
        error: 'Please Choose Time',
      },
      stationAuto: {
        label: 'Station Name',
        placeholder: 'Select Station Name',
        error: 'Please Choose Station Name',
      },
      fromDate: {
        label: 'Start',
        placeholder: 'Select Starting Date',
      },
      toDate: {
        label: 'End',
        placeholder: 'Select Ending Date',
      },
      fromMonth: {
        label: 'From Month/Year',
        placeholder: 'Select Month/Year',
        error: 'Please Choose The Time',
      },
      toMonth: {
        label: 'To  Month/Year',
        placeholder: 'Select Month/Year',
        error: 'Please Choose The Time',
        error1: 'The Start Date Is Greater Than The End Date',
        error2: 'Do not exceed the current month',
      },
      measuringList: {
        label: 'Parameters',
        placeholder: 'Select Parameter',
        require: 'Choose At Least 1 Parameter',
      },
      province: {
        label: 'Province',
        placeholder: 'Select Province',
        require: 'Choose At Least 1 Province',
      },
      standardKey: {
        label: 'Standards VN',
        placeholder: 'Standards VN',
      },
      stationStatus: {
        label: 'Station status',
        placeholder: 'Select station status',
        require: 'Choose At Least 1 station status',
      },
      dataStatus: {
        label: 'Data status',
        placeholder: 'Select data status',
        require: 'Choose At Least 1 data status',
      },
      frequent: {
        label: 'Frequency(minutes/time)',
        placeholder: 'minutes/time',
        require: 'Please type frequency',
      },
      stationKey: {
        label: 'Station code',
        placeholder: 'Please type station code',
        require: 'Please type frequency',
      },
      isExceeded: {
        label: 'Only Exceeded Data',
      },
      operator: {
        label: 'Operator',
      },
      value: {
        label: 'Value',
      },
      type: {
        label: 'Average Data',
        error: 'Please Choose Average Data',
      },
      advanced: {
        label: 'Advanced',
      },
      activatedAt: {
        label: 'Activated At',
        placeholder: 'Select an Activated date',
      },
      typeSampling: {
        label: 'Form of sampling',
        placeholder: 'Select form',
      },
    },
    table: {
      heading: 'Data results',
      receivedAt: 'Received At',
      all: 'All',
      emptyText: 'There Are No Records To Display',
      header1: 'Station Name',
      header2: 'Frequency of data transmission  (minutes/times)',
      header3: 'Total records by design',
      header4: 'Total records by the fact',
      header5: 'Percentage of received data (%)',
      header6: 'The starting date of data transmission',
      header7: 'Day/Month',
      header8: 'Hours',
      header9: 'Percentage of exceeded data (%)',
      title: 'REPORT THE PERCENTAGE OF OBTAINED DATA',
      description:
        'Statistics about the Percentage of data obtained of stations from {{=it.fromMonth}} to {{=it.toMonth}}',
      title2: 'REPORT THE RESULTS OF 24-HOUR AVERAGE MONITORING',
      description2:
        'Statistics about Results of 24-hour average monitoring of {{=it.stationName}} station in {{=it.monthYear}}',
      title3: 'REPORT THE RESULTS OF 1-HOUR AVERAGE MONITORING',
      description3:
        'Statistics about Results of 1-hour average monitoring of {{=it.stationName}} in {{=it.monthYear}}',
      title4: 'REPORT THE PERCENTAGE OF EXCEEDED DATA',
      description4:
        'Statistics about the percentage of exceeded of {{=it.fromMonth}} station in {{=it.toMonth}}',
      title5: 'REPORT THE RESULTS OF 8-HOUR AVERAGE MONITORING',
      description5:
        'Statistics about Results of 8-hour average monitoring of {{=it.stationName}} station in {{=it.monthYear}}',
    },
    selectTimeRange: {
      minute: 'Minute',
      hour: 'Hour',
      day: 'Day',
      month: 'Month',
      year: 'Year',
      errorMonth: 'Please Choose The Month',
      errorDay: 'Please Choose The Day',
      error: 'Please Choose The Time',
    },
    tab: {
      data: 'Data',
      chart: 'Chart',
      exportExcel: 'Export To Excel',
      statusExport: 'Exporting ...',
    },
    tooltip: {
      addCondition: 'Add conditions for the filter',
      listStation: 'List of stations that meet the above filter conditions',
      save: 'Save the newly created filter',
      update: 'Update override filter in progress',
      saveNew: 'Save as new filter from changed original filter',
      reset: 'Return to the currently open filter setting',
      searchData: 'Search the AVG data of the retrieved Station',
      configQAQC: 'Config QAQC for each Station type',
      view: 'Turning off / on allows to retrieve AVG data',
      searchStation: 'Search for stations in the list',
      searchFilter: 'Search for filters that have been created',
    },
    filterDropdown: {
      search: 'Search',
      reset: 'Reset',
    },
  },
  measuringManager: {
    list: {
      title: 'Parameters',
    },
    create: {
      success: 'Add Parameter Successfully',
      keyExisted: 'Parameter Is Already Existed',
    },
    edit: {
      label: 'Edit',
      success: 'Update Parameter Successfully',
    },
    delete: {
      label: 'Delete',
    },
    form: {
      key: {
        label: 'Code',
        placeholder: 'Input Parameter Code',
        error: 'Please Input Parameter Code',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      name: {
        label: 'Name',
        placeholder: 'Input Parameter Name',
        error: 'Please Input Parameter Name',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      unit: {
        label: 'Unit',
        placeholder: 'Input Unit Of Parameter',
      },
      numericalOrder: {
        label: 'Numerical Order',
        placeholder: 'Numerical Order',
        error: 'Please input numerical order',
      },
      action: {
        label: 'Action',
      },
      error: 'Error',
      errorDeleteMeasuring: `The Action Can't Be Completed Because There Are Stations Has This Measuring`,
    },
  },
  stationTypeManager: {
    type: {
      auto: 'Auto',
      periodic: 'Periodic',
    },
    list: {
      title: 'Types Of Station',
    },
    create: {
      label: 'Create',
      success: 'Add New Types Of Station Successfully',
      keyExisted: 'Types Of Station Is Already Existed',
    },
    edit: {
      label: 'Edit',
      success: 'Update Types Of Station Successfully',
    },
    delete: {
      label: 'Delete',
    },
    form: {
      key: {
        label: 'Code',
        placeholder: 'Input Code of Types Of Station',
        error: 'Please Input Code of Types Of Station',
        existError: 'Code of Types Of Station is exist',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      name: {
        label: 'Name',
        placeholder: 'Input Name of Types Of Station',
        error: 'Please Name of Types Of Station',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      icon: {
        label: 'Icon',
        placeholder: 'Choose Icon',
      },
      mode: {
        label: 'Mode',
        error: 'Please choose mode',
      },
      action: {
        label: 'Action',
      },
      error: 'Error',
      errorDeleteStationType: `The Action Can't Be Completed Because There Are Points Or Phases In This Types Of Station`,
      color: {
        label: 'Color',
        placeholder: 'Choose Color',
      },
      numericalOrder: {
        label: 'Numerical Order',
        placeholder: 'Numerical Order',
        error: 'Please Input Numerical Order',
      },
    },
  },
  stationFixedPhase: {
    list: {
      title: 'Monitoring wave',
    },
    create: {
      label: 'Create',
      success: 'Add New Monitoring Success',
      keyExisted: 'Monitoring already exists',
    },
    edit: {
      label: 'Edit',
      success: 'Successful Monitoring Update',
    },
    delete: {
      label: 'Delete',
    },
    form: {
      key: {
        label: 'Monitoring batch code',
        placeholder: 'Monitoring batch code',
        required: 'Please enter code',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      name: {
        label: 'Name of the survey',
        placeholder: 'Name of survey',
        required: 'Please enter monitoring batch',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      stationType: {
        label: 'Station type',
        placeholder: 'Station type',
        required: 'Please select station type',
      },
    },
  },
  stationFixedPoint: {
    list: {
      title: 'Monitoring point',
      restore: 'Restore',
      remove: 'Removed',
    },
    create: {
      label: 'Create',
      success: 'Successfully added new multiple scores',
      keyExisted: 'Monitoring point already exists',
    },
    edit: {
      label: 'Edit',
      success: 'Successful monitoring session updated',
    },
    delete: {
      label: 'Delete',
      require: 'Are you sure you delete the data?',
    },
    disable: {
      label: 'Disable',
      require: 'Are you sure you want to disable?',
    },
    form: {
      panel1: 'Point Information',
      measuringForm: {
        key: 'Parameter code',
        name: 'Parameter name',
        nameMeasuring: 'Charged pollution parameters',
        addMeasuring: 'Add parameters',
        qcvn: 'Limit over threshold',
        tendToExceed: 'Prepare to pass',
        qcvnMin: 'Minimum limit',
        qcvnMax: 'Maximum limit',
      },
      key: {
        label: 'Score code',
        placeholder: 'Grade code',
        required: 'Please enter code',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      name: {
        label: 'Point name',
        placeholder: 'Monitoring point name',
        required: 'Please enter name of monitoring point',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      address: {
        label: 'Address',
        placeholder: 'Address',
        max: 'No more than 256 characters',
      },
      stationType: {
        label: 'Station type',
        placeholder: 'Station type',
        required: 'Please select station type',
      },
      qcvn: {
        label: 'Regulation',
        placeholder: 'Norms',
      },
      lat: {
        label: 'Latitude',
        placeholder: 'Latitude',
        required: 'Please enter latitude',
        format: 'Latitude (-90 <= x <= 90)',
      },
      long: {
        label: 'Longitude',
        placeholder: 'Longitude',
        required: 'Please enter longitude',
        format: 'Longitude (-180 <= x <= 180)',
      },
      latVn2000: {
        label: 'Latitude (VN2000)',
        placeholder: 'Latitude (VN2000)',
        required: 'Please enter longitude (VN2000)',
        format: 'Vĩ độ (-90<=x<=90)',
      },
      longVn2000: {
        label: 'Longitude (VN2000)',
        placeholder: 'Longitude (VN2000)',
        format: 'Kinh độ (-180<=x<=180)',
      },
      position: {
        label: 'Station location',
        placeholder: 'Station location',
        max: 'No more than 64 characters',
      },
      provinceId: {
        label: 'Monitoring unit',
        placeholder: 'Monitoring unit',
      },
      website: {
        label: 'Website',
        placeholder: 'Website',
      },
      yearOperate: {
        label: 'Year of operation',
        placeholder: 'Year of operation',
      },
      userResponsible: {
        label: 'Manager',
        placeholder: 'The manager',
      },
      phoneResponsible: {
        label: 'Telephone number',
        placeholder: 'Phone number',
      },
      userSupervisor: {
        label: 'Operator',
        placeholder: 'Operator',
      },
      phoneSupervisor: {
        label: 'Telephone number',
        placeholder: 'Phone number',
      },
      purposeUsed: {
        label: 'Intended use',
        placeholder: 'Intended use',
      },
      irrigationArea: {
        label: 'Irrigation purpose',
        placeholder: 'Purpose of watering',
      },
      lakeCapacity: {
        label: 'Lake capacity',
        placeholder: 'Lake capacity',
      },
      catchmentArea: {
        label: 'Catchment area',
        placeholder: 'Catchment area',
      },
      note: {
        label: 'Note',
        placeholder: 'Note',
      },
      measuringList: {
        required: 'Please enter parameters',
        validate1: '[Limit over threshold: Min >= Max]',
        validate2: '[Preparing to exceed the threshold: Min> Max]',
        validate3: '[Limit Exceeds: Min Exceeds> Min Prepare To Pass]',
        validate4: '[Limit Exceeds: Max Exceeds <Max Prepare To Pass]',
      },
    },
    importPoint: {
      title: 'Enter a list of monitoring points',
      requiredField: {
        key: 'Key',
        name: 'name',
        stationType: 'Station type key',
        lat: 'latitude',
        lng: 'longitude',
      },
      errors: {
        duplicateData: 'Duplicate data',
        requireField: 'Require field',
        invalidDataSheet: 'Invalid data sheet',
        invalidName: 'Invalid name',
        invalidLatitude: 'Invalid latitude',
        invalidLongitude: 'Invalid longitude',
        invalidAddress: 'Invalid address',
        qcvnKeyNotExist: 'Qcvn key not exist',
        stationTypeKeyNotExist: 'Station type key not exist',
        measureKeyNotExist: 'Measure key not exist',
        noData: 'There is no data',
        invalidStationType: 'Invalid station type',
        invalidKey: 'Invalid key',
        duplicateMeasure: 'Duplicate measures',
        requireOneMeasureParamerter: 'Require one measure parameter',
      },
    },
  },
  qcvn: {
    list: {
      title: 'Standards Filter',
    },
    create: {
      label: 'Create',
      success: 'Add Standard Filter Successfully',
      keyExisted: 'Standard Filter is already existed',
    },
    edit: {
      label: 'Edit',
      success: 'Update Standard Filter Successfully',
      expiredBeforeBegin:
        'The expiration date must be greater than the effective date',
    },
    delete: {
      label: 'Delete',
    },
    form: {
      measuringList: {
        required: 'Please enter parameters',
        validate1: '[Limit over threshold: Min>= Max]',
        validate2: '[Preparing to exceed the threshold: Min> Max]',
        validate3: '[Limit Exceeds: Min Exceeds> Min Prepare To Pass]',
        validate4: '[Limit Exceeds: Max Exceeds <Max Prepare To Pass]',
      },
      key: {
        label: 'Code',
        placeholder: 'Input Standard Filter Code',
        required: 'Please Enter Code QCVN',
        pattern: 'No Special Characters Are Allowed',
        max: 'No ore than 64 characters',
      },
      name: {
        label: 'Name',
        placeholder: 'Input Standard Filter',
        required: 'Please input standard filter',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      unit: {
        label: 'Unit',
        placeholder: 'Input Unit Of Parameter',
      },
      begin: {
        label: 'Effective date',
        placeholder: 'Effective date',
        error: 'Please select an effective date',
      },
      expired: {
        label: 'Expiration date',
        placeholder: 'Expiration date',
        isApplying: 'Now',
        stillWork: 'Applying',
      },
      numericalOrder: {
        label: 'Numerical Order',
        placeholder: 'Input Numerical Order',
        error: 'Please Input Numerical Order',
      },
      action: {
        label: 'Action',
      },
      error: 'Error',
    },
    invalid: 'Invalid standard',
  },
  province: {
    list: {
      title: 'Site',
      key: 'Key',
      numericalOrder: 'Numerical Order',
    },
    create: {
      label: 'Create',
      success: 'Add Unit Successfully',
      keyExisted: 'Name Is Already Existed',
    },
    edit: {
      label: 'Edit',
      success: 'Update Name Successfully',
    },
    delete: {
      label: 'Delete',
      require: 'Please Confirm To Delete',
    },
    add: {
      label: 'Add',
    },
    form: {
      action: 'Action',
      key: {
        label: 'Code',
        placeholder: 'Input Code Of Name',
        error: 'Please Input Code Of Name',
        existError: 'Code Of Name is exist',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      name: {
        label: 'Name',
        placeholder: 'Input Name',
        error: 'Please input Name',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      numericalOrder: {
        label: 'Numerical Order',
        placeholder: 'Numerical Order',
        error: 'Please input numerical order',
      },
    },
  },
  configWQI: {
    breadCrumb: 'Select AQI & WQI calculations',
    stationAuto: 'Station Auto',
    stationFixed: 'Station Fixed',
    stationName: 'Station Name',
    allow: 'Allow calculate',
    stationType: 'Station Type',
    success: 'Update success !',
    error: 'Error!',
    unckecked: 'unchecked',
  },
  ftpTranfer: {
    sampleConfiguration: 'FTP Configuration',
    allowFtpTranfer: 'Send FTP',
    stationName: 'Station Name',
    measureTranfer: 'Measure Transfer',
    ftpInfo: 'FTP Info',
    ftpConfig: 'Config Info FTP',
    tranferBonus: 'Additional infusion',
    configTranferFTP: 'Config gen file TXT',
    confirmTitle: 'Are you delete!',
    tranfer: 'Tranfer',
    success: 'Update success',
    error: 'Error..!',
    save: 'Save',
    edit: 'Edit',
    add: 'Create',
    delete: 'Delete',
    cancel: 'Cancel',
    timeStart: 'Time Start',
    breadCrumb: 'Config sent file TXT to CEM',
    formInFoFTP: {
      ipAddress: {
        title: 'IP Address',
        addonBefore: 'ftp://',
        message: 'Please input ip address',
      },
      port: {
        title: 'Ex: 21',
        addonBefore: 'Port:',
        message: 'Please input port',
      },
      user: {
        title: 'UserName',
        addonBefore: 'UserName: ',
        message: 'Please input username',
      },
      pass: {
        title: 'Pass Word',
        addonBefore: 'Pass:',
        message: 'Please input pass word',
      },
      fileName: {
        name: 'File Name FTP',
        title: 'File Name',
        addonBefore: 'File Name:',
        message: 'Please input file name',
      },
    },
    summary: 'Summary',
    history: 'History tranfer',
    status: {
      title: 'Tranfer status',
      success: 'Tranfer success',
      failed: 'Tranfer failed',
      success2: 'Successful transmission setup',
      failed2: 'Not set for file transfer before transmission time',
    },
    tryUploadFile: 'Try upload file',
  },
  page: {
    config: {
      color: {
        button: {
          selectTabData: 'Data status',
          selectTabSensor: 'Sensor status',
        },
        table: {
          column: {
            type: 'Type',
            alternative: 'Alternative',
            color: 'Color',
            backgroundColor: 'Background color',
            desc: 'Description',
          },
        },
      },
    },
  },
  stationFixedManager: {
    list: {
      title: 'Fixed Station',
    },
    label: {
      timeRange: 'Time',
      point: 'Monitoring point',
      attachment: 'Attachments',
    },
    placeholder: {
      timeRange: {
        from: 'Start date',
        to: 'End date',
      },
    },
    button: {
      add: 'Add information',
    },
    table: {
      directInput: 'Direct input',
      excelInput: 'By excel',
      popUp: {
        delete: `Are you sure to delete this row's data?`,
      },
      footer: 'Add data',
      title: {
        phase: 'Phase',
        reportName: 'Report name',
        point: 'Monitoring point',
        typeInput: 'Type of input',
        userInput: 'Created by',
        createTime: 'Create time',
        editTime: 'Edited by',
        dateTime: 'Time sample',
      },
    },
  },
  stationAutoManager: {
    list: {
      title: 'Manage Stations',
      ftpInfo: 'FTP Info',
      ftpFile: 'FTP File',
      restore: 'Restore',
      remove: 'Remove',
      action: 'Action',
      createdAt: 'Created At',
    },
    create: {
      label: 'Create',
      success: 'Add Station Name Successfully',
      keyExisted: 'Station Name Is Already Existed',
    },
    edit: {
      label: 'Edit',
      success: 'Update Station Name Successfully',
    },
    delete: {
      label: 'Delete',
      require: 'Please Confirm To Delete',
    },
    disable: {
      label: 'Disable',
      require: 'Please Confirm To Disable?',
    },
    add: {
      label: 'Add',
    },
    addMeasuring: {
      label: 'Add Measuring',
      error: 'Measuring have at least 1',
    },
    camera: {
      title: 'Station Camera Configuration',
    },
    sampling: {
      title: 'Station Sampling Configuration',
    },
    configConnect: {
      title: 'Station Connect Configuration',
    },
    configNotification: {
      title: 'Push Notifications Configuration',
      tabChanels: 'Notification Chanels',
      tabConfigNotification: 'Frequency of Notifications',
    },
    configStationAuto: {
      tabConfigStationAuto: 'Station Auto Config',
    },
    configAlarm: {
      tabConfigAlarm: 'Alarm Config',
    },
    configColor: {
      title: 'Warning Color Configuration',
    },
    form: {
      panel1: 'Station Information',
      panel2: 'Other Information',
      panel3: 'Monitoring parameters',
      panel4: 'Advanced Parameters',
      website: {
        label: 'Website',
        placeholder: 'Website',
      },
      capacity: {
        label: 'Design capacity',
        placeholder: 'Design capacity',
      },
      career: {
        label: 'Career',
        placeholder: 'Career',
      },
      material: {
        label: 'Main material',
        placeholder: 'Main material',
      },
      userResponsible: {
        label: 'Operators',
        placeholder: 'Operators',
      },
      phoneResponsible: {
        label: 'Phone',
        placeholder: 'Input the phone number responsible person',
      },
      processProduction: {
        label: 'Production process',
        placeholder: 'Production process',
      },
      yearOperate: {
        label: 'Years of Operation',
        placeholder: 'Years of Operation',
      },
      userSupervisor: {
        label: 'Manager',
        placeholder: 'Manager',
      },
      phoneSupervisor: {
        label: 'Phone',
        placeholder: 'Input the Manager phone number',
      },
      key: {
        label: 'Code',
        placeholder: 'Input Code Of Station Name',
        error: 'Please Input Code Of Station Name',
        required: 'Please Input Code Of Station Name',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      name: {
        label: 'Name',
        placeholder: 'Input Station Name',
        required: 'Please input Station Name',
        pattern: 'Not allowed to enter special characters',
        max: 'No more than 64 characters',
      },
      stationType: {
        label: 'Type',
        placeholder: 'Input Types Of Station',
        error: 'Please Choose Types Of Station',
      },
      address: {
        label: 'Address',
        placeholder: 'Address',
      },
      qcvn: {
        label: 'Exceeded Limit',
        placeholder: 'Standards VN',
        error: 'Please Choose Type Of Standards VN',
      },
      tendToExceed: {
        label: 'Tend To Exceed Limit',
      },
      province: {
        label: 'Management Unit',
        placeholder: 'Management Unit',
        error: 'Please Choose Management Unit',
      },
      frequency: {
        label: 'Frequency(m/t)',
        placeholder: 'minutes/time',
        error: 'Please Choose Frequency',
      },
      typeSampling: {
        label: 'Form of sampling',
        placeholder: 'Select form',
      },
      dayOfOperation: {
        label: 'Actived At',
        placeholder: 'Actived At',
        error: 'Please Choose Actived At',
      },
      diameter: {
        label: 'Diameter(m)',
        placeholder: 'Diameter(m)',
      },
      isStopWorking: {
        label: 'Stop working',
        placeholder: 'Stop working',
      },
      note: {
        label: 'Note',
        placeholder: 'Note',
        error: 'Please Choose Note',
      },
      linkStation: {
        label: 'Linking Environmental Monitoring Data',
        placeholder: 'Enviromental Monitoring Point',
        description:
          'Notice: Data binding automatic and fixed to link data to perform calculations',
      },
      long: {
        label: 'Longitude',
        placeholder: 'Input longitude',
        error: 'Please Input Longitude',
      },
      lat: {
        label: 'Latitude',
        placeholder: 'Input Latitude',
        error: 'Please Input Latitude',
      },
      longVn2000: {
        label: 'Longitude (VN2000)',
        placeholder: 'Input longitude (VN2000)',
      },
      latVn2000: {
        label: 'Latitude (VN2000)',
        placeholder: 'Input Latitude (VN2000)',
      },
      connectionStatus: {
        label: 'Connection status',
        time: {
          options: {
            minutes: 'Minutes',
            hours: 'Hours',
            days: 'Days',
            months: 'Months',
            years: 'Years',
          },
        },
        error: 'Please select lost connection time range !!!',
        description:
          'Notice: This configuration supports receiving signals when the connection is lost at the selected time interval',
      },
      emails: {
        label: 'Email Address',
        placeholder: 'Input Email Address',
        error: 'Please Input Email Address',
        description:
          'Note: When data have the problem, in addition to the accounts being managed, the system send additional emails to these addresses.',
      },
      image: {
        label: 'Avata',
      },
      phones: {
        label: 'Phone Number',
        placeholder: 'Input Phone Number',
        error: 'Please Input Phone Number',
      },
      range: {
        label: 'Measuring Device Limit',
      },
      measuringKey: {
        label: 'Parameter Code',
        placeholder: 'Input Parameter Code',
        error: 'Please Input Parameter Code',
      },
      measuringName: {
        label: 'Parameter Name',
        placeholder: 'Input Parameter Name',
        error: 'Please Input Parameter Name',
      },
      measuringUnit: {
        label: 'Parameter Unit',
        placeholder: 'Input Parameter Unit',
        error: 'Please Input Parameter Unit',
      },
      measuringMinLimit: {
        label: 'Min Limit',
        placeholder: 'Input Min Limit',
        error: 'Please Input Min Limit',
      },
      measuringMaxLimit: {
        label: 'Max Limit',
        placeholder: 'Input Max Limit',
        error: 'Please Input Max Limit',
      },
      measuringMinRange: {
        label: 'Min Range',
        placeholder: 'Input Min Range',
        error: 'Please Input Min Range',
      },
      measuringMaxRange: {
        label: 'Max Range',
        placeholder: 'Input Max Range',
        error: 'Please Input Max Range',
      },
      options: {
        isAllowWarning: 'Allow Warning',
        isAllowRemote: 'Allow Remote',
      },
      mapLocation: {
        label: 'Map Location',
        placeholder: 'Map Location',
      },
      error: 'Error',
      require: 'Please Enter Value',
      order: {
        label: 'Order',
        placeholder: 'Order',
      },
      errorMaxTend:
        'Tend To Exceed Max Limit Must Be Less Than Exceeded Max Limit',
      errorMinTend:
        'Tend To Exceed Min Limit Must Be Larger Than Exceeded Min Limit',
      errorMinMax: 'Min Limit Must Be Less Than Max Limit',
      measuringNameCalculate: {
        label: 'Calculation Parameter Name',
        required: 'Please input parameter name',
      },
      functionCalculate: {
        label: 'Calculation Function',
      },
      popConfirm: 'Please Confirm To Delete',
      indexCalculation: 'Index calculation',
      errorAdvancedParameter: "You haven't selected advanced parameters yet",
    },
    range: {
      label: 'Station Range',
      min: 'Min',
      max: 'Max',
    },
    config: {
      label: 'Config',
      extensionFile: 'Extension File',
      fileName: {
        label: 'File Name',
        placeholder: 'File Name',
      },
      path: {
        label: 'Path',
        placeholder: 'Path',
      },
      measuringSrc: {
        label: 'Source Of Parameter',
        placeholder: 'Source Of Parameter',
        error: 'Please Enter Source Of Parameter',
      },
      measuringDes: {
        label: 'Destination Of Parameter',
        placeholder: 'Destination Of Parameter',
        error: 'Please Enter Destination Of Parameter',
      },
      ratio: {
        label: 'Ratio',
        placeholder: 'Ratio',
        error: 'Please Enter Ratio',
      },
      message: {
        success: 'Update station auto config success!',
        error: 'Update station auto config fail!',
      },
      buttonLoadSourceParameter: 'Load Source Parameter',
      errorLoadFile: 'Load file fail with path',
    },
    options: {
      calibration: {
        title: 'Equipment calibration',
      },
      allowSendWarning: {
        label: 'Allow Send Warning',
        placeholder: 'Allow Send Warning',
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
        error: 'Please input range',
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
        sunday: 'Every sunday',
      },
      allowSampling: {
        label: 'Allow Sampling',
        placeholder: 'Allow Sampling',
      },
      apiAddress: {
        label: 'API Address',
        placeholder: 'Allow API Address',
      },
      allowCamera: {
        label: 'Allow Camera',
        placeholder: 'Allow Camera',
        add: 'Add',
      },
      name: {
        label: 'Name',
        placeholder: 'Name',
      },
      RTSP: {
        label: 'RTSP URL',
        placeholder: 'RTSP URL',
        error: 'Please enter RTSP URL',
      },
      userRole: {
        stationManager: 'Station Manager',
        sendNotification: 'Send Notification',
        sms: 'SMS',
        email: 'Email',
      },
    },
    header: {
      option: 'Options',
      dataLogger: 'DataLogger',
      approve: 'Approve Data',
    },
    update: {
      success: 'Update success',
      error: 'Upload failed',
    },
    upload: {
      label: 'Upload',
      error: 'Upload Photo Failed',
    },
    uploadFile: {
      label: 'Upload File',
      error: 'File Upload Failed.',
      errorType: 'You can only upload JPG/PNG file!',
      errorSize: 'Image must smaller than 10MB!',
      errorSpecial: 'Name image must have no special character',
      success: 'File Uploaded Successfully',
      status: {
        uploading: 'Uploading ...',
        finish: 'Done',
      },
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
      passwordLabel: 'Password:',
    },
    image: {
      label: 'Photos of station: {{=it.name}}',
      create: 'Upload photos',
    },
    infoStation: {
      title: 'Station Information',
      edit: 'Edit',
      career: 'Career',
      emptyText: 'Not have data',
      yearOperate: 'Year Operate',
      capacity: 'Capacity',
      processProduction: 'Process Production',
      userResponsible: 'User Responsible',
      userSupervisor: 'User Supervisor',
      material: 'Material',
      website: 'Website',
    },
    limit: {
      station: {
        title: 'Limited subscription',
        content:
          'Your maximum number of stations is {{= it.totalStation}}, you cannot add new stations, please contact or upgrade your usage plan',
        callAction: 'Increase the number of stations, contact',
      },
    },
  },
  parameterManager: {
    breadcrumb: {
      base: 'Parameters',
      create: 'Create',
      edit: 'Edit',
    },
  },
  cameraManager: {
    breadcrumb: {
      camera: 'Camera',
    },
  },
  userManager: {
    breadcrumb: {
      list: 'Users',
      rule: 'Assign Role',
      create: 'Create',
      edit: 'Edit',
    },
    form: {
      placeholder: {
        selectUser: 'Select User',
        selectRoleGroup: 'Select Role',
      },
      email: {
        label: 'Email Address',
        placeholder: 'Email Address',
        error: 'The Input Email Address Is Not Valid',
        errorExist: 'Email Address Is Exist',
      },
      password: {
        label: 'Password',
        placeholder: 'Password',
      },
      confirmPassword: {
        label: 'Confirm Password',
        placeholder: 'Confirm Password',
        message: 'Please Confirm Your Password!',
      },
      firstName: {
        label: 'First Name',
        placeholder: 'First Name',
        error: 'Please input first name',
      },
      lastName: {
        label: 'Last Name',
        placeholder: 'Last Name',
        error: 'Please input last name',
      },
      country: {
        label: 'Country',
        placeholder: 'Select Country',
      },
      organization: {
        label: 'Organization',
        placeholder: 'Select Organization',
      },
      phone: {
        label: 'Phone',
        placeholder: 'Phone',
        empty: 'Please input phone',
        format: 'The phone number not correct',
        errorExist: 'The phone number Is Exist',
      },
      isAdmin: {
        label: 'Admin Role',
      },
    },
    modal: {
      title: 'Limited subscription',
      back: 'Back',
      text:
        'Your maximum number of users is  {{=it.total}}, you cannot add new user. Please contact or upgrade the service pack',
      text1: 'Increase the number of users please contact',
      text2: 'Phone number',
      text3: 'Email',
      callAction: 'Increase the number of users please contact',
    },
    list: {
      enableAccount: 'Enable Account',
      disableAccount: 'Disable Account',
      warning: 'You Cannot Disable Your Own Account',
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
      setPasswordFailure: 'Update Password Failure',
    },
    roleAssign: {
      role: 'Role',
      name: 'Role Name',
      nameStation: 'Management Stations',
      success: 'Update Rule User Successfully',
      error: 'Update Rule User Failed',
      address: 'Address',
      isAdmin: 'Admin Role',
    },
    message: {
      success: 'Register User success!',
    },
  },
  roleManager: {
    create: {
      success: 'Create new role successfully',
      error: 'Failed to create new role',
    },
    breadcrumb: {
      list: 'Roles',
      create: 'Create',
      edit: 'Edit',
    },
    tableHeader: {
      menu: 'Module',
      action: 'Action',
      stt: '#',
    },
    form: {
      name: {
        label: 'Name',
        placeholder: 'Input Name',
        error: 'Please Input Name',
        errorExist: 'Name is exist',
        limit: 'Must be 5 characters or more',
      },
      description: {
        label: 'Description',
        placeholder: 'Input Description',
        error: 'Please Input Description',
      },
    },
    rule: {
      label: 'Rule',
      orderby: {
        label: '#',
        placeholder: '#',
      },
      menu: {
        label: 'Menu',
        placeholder: 'Menu',
      },
      action: {
        label: 'Action',
        placeholder: 'Action',
        package: 'Package',
      },
      dashboard: {
        name: 'Health check',
      },
      dashboard_2: {
        name: 'Monitoring overview',
      },
      monitoring: {
        name: 'Real-time Monitoring',
      },
      monitorByList: {
        name: 'Monitor by list',
      },
      map: {
        name: 'Map',
      },
      camera: {
        name: 'Camera',
      },
      chart: {
        name: 'Data Insights',
      },
      dataSearch: {
        name: 'History Data',
      },
      avgSearch: {
        name: 'Average Data',
      },
      xuLyDuLieu_config: {
        name: 'Data Processing - Config',
      },
      kiemDuyetDuLieu: {
        name: 'Check Data',
      },
      periodicalStation: {
        name: 'Periodic Forecast Station Management',
      },
      periodicalImportStation: {
        name: 'Import Periodic Forecast Data',
      },
      periodicalSeachData: {
        name: 'Search Periodic Forecast Data',
      },
      qaqcConfig: {
        name: 'Sharing Configurations',
      },
      ftpTransfer: {
        name: 'FTP Transfer Configurations',
      },
      shareAPI: {
        name: 'API sharing',
      },
      billing: {
        name: 'Billing',
      },
      tiLeDuLieuThuDuoc: {
        name: 'Percentage of obtained data',
      },
      tiLeDuLieu: {
        name: 'Percentage of data',
      },
      tb24H: {
        name: '24-hour average',
      },
      tb1H: {
        name: '1-hour average monitoring',
      },
      tb1HMax: {
        name: 'Average maximum 1 hour',
      },
      tb8HMax: {
        name: 'Average maximum 8 hour',
      },
      tileDuLieuVuotNguong: {
        name: 'Percentage of exceeded data',
      },
      reportExceed: {
        name: 'Data over the threshold',
      },
      reportFlow: {
        name: 'Emission flow',
      },
      soLanMatKetNoi: {
        name: 'Number of disconnections',
      },
      aqiGio: {
        name: 'AQI - Hour',
      },
      aqiNgay: {
        name: 'AQI - Day',
      },
      wqiGio: {
        name: 'WQI - Hour',
      },
      wqiNgay: {
        name: 'WQI - Day',
      },
      wqiPeriodic: {
        name: 'WQI - Periodic',
      },
      tinhTrangDuLieu: {
        name: 'Status Data',
      },
      aqiMap: {
        name: 'AQI Map',
      },
      wqiMap: {
        name: 'WQI Map',
      },
      configWQI: { name: 'AQI & WQI Configurations' },
      stationFixPhase: {
        name: 'Monitoring batch manager',
      },
      stationFixMap: {
        name: 'Monitoring point map',
      },
      stationFixData: {
        name: 'Lookup monitoring point data',
      },
      stationFix: {
        name: 'Monitoring point management',
      },
      stationFixInput: {
        name: 'Input the monitoring point',
      },
      stationAuto: {
        name: 'Station',
      },
      cauHinhKetNoi: {
        name: 'Station connect configuration',
      },
      cauHinhGuiCanhBao: {
        name: 'Configure to Send Notifications',
      },
      cauHinhLayMau: {
        name: 'Sampling configuration',
      },
      cauHinhTinhToanAQI: {
        name: 'Configure AQI calculation',
      },
      cauHinhTinhToanWQI: {
        name: 'Configure WQI calculation',
      },
      cauHinhCamera: {
        name: 'Camera configuration',
      },
      measuring: { name: 'Parameter' },
      stationType: { name: 'Type of Station' },
      province: { name: 'Site' },
      qcvn: { name: 'Standard' },
      service_config: { name: 'Service configuration' },
      role: { name: 'Role' },
      user: { name: 'User' },
      config_color_noti: {
        name: 'Configure warning color',
      },
      language: {
        name: 'Configure language',
      },
      xem_Nhat_ky: {
        name: 'System Logs',
      },
      mobile_dashboard: {
        name: 'Dashboard Mobile',
      },
      billingConfig: {
        name: 'Billing Config',
      },
      billingReport: {
        name: 'Billing Report',
      },
      incidentManagement: {
        name: 'Incident Management',
      },
      incidentConfigProperties: {
        name: 'Incident Config Properties',
      },
      alarm_management: {
        name: 'Alarm Management',
      },
      alarm_history: {
        name: 'Alarm History',
      },
      actions: {
        role: 'Role Assignment',
        enableAccount: 'Enable/Disable Account',
        config: 'Config',
        download: 'Download',
        import: 'Import',
        wqi_export: 'Export',
        aqi_export: 'Export',
        isTransfer: 'Edit Send FTP Station',
        updateFTP: 'Edit Info FTP',
        publicStation: 'Edit Publish Station',
        view: 'View',
        camera: 'Camera',
        control: 'Sampling',
        chart: 'Chart',
        map: 'Map',
        images: 'Photos',
        infoStation: 'Station Information	',
        reviewStation: 'Review Station',
        create: 'Create',
        edit: 'Edit',
        delete: 'Delete',
        export: 'Export',
        setup: 'Setup',
        manualapprove: 'Manual Approve',
        unapprove: 'Unapprove',
        approve: 'Approve',
        restore: 'Restore',
        remove: 'Remove',
        statistics_device: 'Statistics Device',
        statistics_exceeded_avgDay: 'Exceeded Avg Day',
        pushDuLieu: 'Push data',
        vuotNguongTBNgay: 'Average daily exceed',
        bieuDoAQI: 'AQI chart',
        bieuDoWQI: 'WQI chart',
        bieuDoMatKetNoi: 'Disconnections',
        bieuDoVuotNguong: 'Exceeded',
        thongKeLoaiTram: 'Statistics by station type',
        fTPFloder: 'FTP Floder',
        fileMapping: 'File Mapping',
        updateSelectStation: 'Update selected stations',
      },
    },
  },
  provinceManager: {
    form: {
      errorDeleteProvince: `The Action Can't Be Completed Because There Are Station In This Province`,
    },
  },
  subscriptionStatus: {
    breadcrumb: {
      base: 'Subscription Status',
    },
    Renew: 'Renew',
    renewAt: 'Renew At',
    currentSubscription: 'Current Subscription',
    subscriptionHistory: 'Subscription History',
    expiredAt: 'Expired At',
    totalUsers: 'Total No. Of Users',
    totalStation: 'Total No. Of Station',
  },
  infoLicense: {
    expireWarning: {
      openWarning:
        'The copyright of Ilotusland is about to expire. Please extend within',
      middleWarning: '{{=it.total}} days',
      endWarning: 'so that the proccess of use is not interrupted',
    },
    breadCrumb: 'Subscription Information',
    title1: 'Registered at',
    title2: 'Maximum quantity to use',
    title3: 'Customer Support',
    text1: 'Created at',
    text2: 'Expiration date',
    text3: 'You have {{=it.total}} days to use the product',
    text4: 'Number of stations',
    text5: 'Number of member',
    text6: 'Phone number',
    text7: 'Email',
    dateUnlimited: 'Unlimited',
    extendLicense: 'Extend',
    modal: {
      title: 'Support, renewal of use',
      button: 'Understood',
      body: {
        notification:
          'Please contact the information below for renewal assistance',
        phone: 'Phone:',
        email: 'Email:',
      },
    },
  },
  expLicenseInfo: {
    title: 'We are very sorry',
    subtitle1: ' Your organization expired {{=it.totalDate}}.',
    subtitle2: 'Please extend to continue using',
    text1: 'Phone number',
    text2: 'Renew immediately',
    text3: 'Email',
  },
  profileUser: {
    title: 'User Profile',
    infoLicense: 'Subscription Info',
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
      success: 'Upload Photo Success',
      error: 'Upload Photo Failed',
    },
    user: 'User Info',
    organization: 'Organization Info',
  },
  configStation: {
    name: 'Manage Stations',
    breadCrumb: 'Configure to Receive Notifications',
    warningStatus: 'Receive Notifications',
    showStation: 'Show Station',
    numericalOrder: 'Numerical Order',
    action: 'Action',
    messageUpdate: {
      success: 'Update successfully!',
      error: 'Update failure!',
    },
  },
  configNotify: {
    headerConfirm: 'Update frequency',
    contentConfirm:
      'After updating the frequency, notification system will be reset to initial state. Are you sure want to process ?',
    okBtnText: 'Update',
    cancelBtnText: 'Cancel',
    repeat: 'Repeat',
    headerStatus: {
      DATA_STATUS: 'Data Status',
      DEVICE_STATUS: 'Device Status',
      STATION_STATUS: 'Station Status',
    },
    titleTable: {
      status: 'Status',
      notification: 'Notification',
      frequency: 'Frequency',
    },
    DATA_STATUS: {
      OVERLOAD: 'Exceeded',
      ABOUT_TO_OVERLOAD: 'Tend to exceed',
      COLLECTING: 'Good',
      LOST_CONNECTION: 'Lost connection',
    },
    DEVICE_STATUS: {
      LOST_CONNECTION: 'Lost connection',
      DEVICE_ERROR: 'Device error',
      CALIBRATE: 'Calibration',
      COLLECTING: 'Good',
    },
    STATION_STATUS: {
      ONLINE: 'The station has a signal',
      OFFLINE: 'The station lost the signal',
    },
  },
  changePassword: {
    breadcrumb: {
      changePassword: 'Change password',
      profileUser: 'Profile',
      security: 'Security Setting',
    },
    form: {
      oldPassword: {
        label: 'Current Password',
        error: 'Please Input Your Current Password',
      },
      newPassword: {
        label: 'New Password',
        error: 'Please Input New Password',
      },
      newPasswordConfirmation: {
        label: 'Password Confirmation',
        error: 'Please Input New Password One More Time',
        error1: 'Passwords Are Not Matched',
      },
      Success: 'Change Password Successfully',
      compare: 'Two passwords that you enter is inconsistent',
      savePassword: 'Save Password',
    },
  },
  resetPassword: {
    key: 'Forgot Password',
    key2:
      "Enter your email address and we'll send you an email with instruction to reset your password",
    key3: 'Reset Password',
    key4: 'Resend Code',
    key5: 'Confirm',
    key6: 'Send Code',
  },
  security: {
    label: 'Two-Factor Authentication',
    enable2FA: 'Enable 2FA Authentication',
    disable2FA: 'Disable 2FA Authentication',
    confirmPasswordLabel: "To continue, first verify it's you",
    confirmPasswordError: 'Password not match',
    enterPassword: 'Enter your password',
    confirm: 'Confirm',
    note:
      'If you turn on Two-Factor Authentication feature, The system will send the verification code to your email address or phone number every time you sign in',
    success: 'Success',
    failure: 'Save failure',
    message: {
      userUse: 'You are using 2-layer authentication with {{=it.type}}',
      code_unCorrect: 'The verification code is not correct',
      code:
        'Your verification code has been sent to: {{=it.phone}} (will expire after {{=it.expired}})',
      info: `Select authentication method when logging in:`,
    },
    step1: 'Enter code',
    step2: 'Loading',
    step3: 'Done',
    send: 'Send',
    use: {
      email: 'Use Email',
      sms: 'Use SMS',
    },
  },
  login: {
    title: 'Login to your account',
    twoFactorAlert:
      'Two-Factor Authentication - Your verification code will be sent to {{=it.email}}!',
    form: {
      email: {
        label: 'Email Address',
        placeholder: 'Email',
      },
      password: {
        label: 'Password',
        placeholder: 'Password',
      },
      twoFactor: {
        label: 'Verification Code',
        placeholder: 'xxxx',
      },
      buttonLogin: 'Login',
      loginWithEmail: 'Login with email',
      loginWithPhone: 'Login with phone number',
      buttonTwoFactor: 'Verify',
      refreshOtp: 'Refresh OTP',
      refreshOtpAfter: 'Refresh OTP after {{=it.time}}',
      inputOtp: 'Input {{=it.type}}  sent to {{=it.to}}',
      newPassword: 'New password',
      confirmNewPassword: 'Confirm new password',
    },
    errors: {
      emailOrPasswordIncorrect: 'The email or password is incorrect.',
      accountDisable: 'Your account is disabled',
      accountDelete: 'Your account is delete',
      accountNotActivated: 'Your account is not activated.',
      codeNotEqual: 'Authentication code is incorrect.',
      organizationNotExist: 'Your organization is not exist.',
      wrongOtp: 'Wrong OTP, please try again!',
      emailNotExists: "Email isn't exists",
      phoneNotExists: "Phone number isn't exists",
      phoneMultiExists: 'Your phone number is the same as another account!',
      otpIncorrect: 'Otp incorrect',
      otpVerified: 'Otp verified',
      otpExpired: 'Otp expired',
      notSendOtp: 'Not send otp',
    },
  },
  warningLevels: {
    title: 'Warning Levels',
    good: 'Good',
    exceedTendency: 'Tend To Exceed',
    exceedPreparing: 'Tend to exceed',
    exceed: 'Exceeded',
    lossData: 'Lost connection',
    sensorError: 'Device connected failure',
    collecting: 'Good',
    lostConnection: 'Lost connection',
    overload: 'Overload',
    aboutToOverload: 'About to Overload',
  },
  addon: {
    add: 'Add',
    addMulti: 'Add multiple',
    addCondition: 'Add condition',
    create: 'Create',
    update: 'Update',
    edit: 'Edit',
    edited: 'Edited',
    delete: 'Delete',
    save: 'Save',
    reset: 'Reset',
    remove: 'Remove',
    restore: 'Restore',
    sendRequest: 'Send Request',
    onSave: {
      add: {
        success: 'Added Successfully',
        error: 'Add Error',
        keyExited_error: 'Key Existed',
      },
      update: {
        success: 'Updated Successfully',
        error: 'Update Error',
      },
    },
    onDelete: {
      errorMessage: {
        roleUsed: 'Role is already in use !',
        measuringUsed: 'Measuring is already in use !',
        measuringUsedStationAuto:
          'Measuring is already used in Station Auto configuration !',
        measuringUsedStationFix:
          'Measuring is already used in Station Fix configuration !',
        measuringUsedWqi: 'Measuring is already used to calculate WQI !',
        measuringUsedAqi: 'Measuring is already used to calculate AQI !',
        measuringUsedQcvn: 'Measuring is already used in QCVN configuration !',
        phaseUsed: 'Monitoring is being used to import data!',
        pointUsed: 'The monitoring point is being used for data entry!',
        stationUsed: 'Monitoring station is being used to import data!',
        reportUsed: `The action can't be completed because there are reports using this station`,
      },
      success: 'Deleted Successfully',
      qcvn: {
        qcvnUsed:
          "The action can't be completed because there are stations in this standard",
      },
      error: 'Delete Error',
      warning: 'You cannot delete your own account',
    },
    onDisable: {
      success: 'Disable Successfully',
      error: 'Disable Error',
    },
    onRestore: {
      resetConfirmMsg: 'Do you want to restore?',
      success: 'Restored Successfully',
      error: 'Restore Error',
    },
    search: 'Search',
    searchNotification: 'Search by stations name',
    searchSelect: 'Select conditions',
    error: 'Something Went Wrong!!!',
    warning: 'Warning',
    refresh: 'Refresh',
    cancel: 'Cancel',
    ok: 'Ok',
    no: 'No',
    yes: 'Yes',
    popConfirm: {
      reviewStation: {
        title: 'Are you sure delete this review ?',
      },
      image: {
        title: 'Are you sure delete this image ?',
      },
      attachment: {
        title: 'Do you want to delete this file ?',
      },
    },
  },
  success: {
    text: 'Success',
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
        `,
      },
      saveSampingConfig: 'Please enter all information before Saving',
    },
  },
  modal: {
    confirm: {
      title: 'Confirm',
      monitoring: {
        sampling: {
          cancelSchedule:
            'Are you sure you want to Cancel automatically sampling?',
          cancelExceededSampling:
            'Are you sure you want to Cancel exceeded sampling?',
        },
      },
    },
  },
  form: {
    save: 'Save',
    update: 'Update',
  },
  importDataPoint: {
    headerTitle: 'Enter the monitoring point data',
    description:
      'Add periodic monitoring data by uploading xlsx file with required information.',
    startUpload: 'Start by selecting the input batch',
    phaseLabel: 'Select monitoring phase',
    measuringLabel: 'Order of data input',
    measuringRequired: 'Please select 1 parameter',
    stationTypeLabel: 'Station Type',
    requirements1: `Upload the data containing the monitoring stations in the form below. Make sure the fields are absolutely correct. Data uploaded to the system stored in`,
    requirements2: `Import History`,
    requirements:
      'Upload the data containing the monitoring points in the form below. Make sure the fields are absolutely correct. Data uploaded to the system cannot be removed',
    step1: 'Step 1: Download the sample file and fill in the required fields',
    step2: 'Step 2: Upload the file with all fields filled in',
    downloadText: 'Download sample file',
    uploadText: 'Upload sample file',
    dragAndDrop: 'Drag and drop files here',
    errorTitle: 'Upload failed',
    errorMessage: 'Some data lines are faulty. Please check and try again',
    errorMessageNoData: 'There is no data',
    successTitle: 'Upload successfully',
    successMessage: 'Successfully uploaded {{=it.count}} lines of data',
    line: 'Line',
    duplicateParameter: 'Duplicate parameters',
    duplicateData: 'Duplicate data',
    invalidDataSheet: 'Sheet data is not valid',
    invalidDateTime: 'Invalid date and time',
    invalidParameter: 'Parameter code does not exist',
    pointKeyNotExisted: 'Monitoring Code does not exist',
    parameterNotTypeNumber: 'Wrong format parameter',
    pointAndPhaseNotBelongToStationType:
      'Point and phase monitoring are not the same type of station',
    pointKeyRequired: 'Point code cannot be left empty',
    dateTimeRequired: 'Date and time cannot be left empty',
    selectPhaseError: 'Please select the monitoring batch',
    complexForm: 'Complex template',
    simpleForm: 'Simple template',
    inputForm: 'Choose input form',
  },
  importDataForecast: {
    stationKeyNotExist: 'Monitoring station code does not exist',
    emptyFile: 'Empty File',
    alarmLevelIinvalid: 'Invalid alarm level (I)',
    alarmLevelIIinvalid: 'Invalid alarm level (II)',
    alarmLevelIIIinvalid: 'Invalid alarm level (III)',
    dateInvalid: 'Invalid date',
    hourInvalid: 'Invalid time',
    measureValueInvalid: 'Wrong format parameter value',
    dataTypeInvalid: 'Invalid type of data',
    dataSourceInvalid: 'Invalid data source',
    broadcastDateInvalid: 'Wrong format broadcast date',
    broadcastTimeInvalid: ' Invalid broadcast time',
    realDataInvalid: 'Real data has invalid date',
    invalidDayDataNumber: 'Invalid number of data on the same day',
    forecastDataInvalid: 'Forecast data has invalid date',
    titleConfirm: 'Upload Confirmation',
    confirm1: 'Be sure of the accuracy of the data. Existing data if',
    confirm2: 'the same broadcast date',
    confirm3:
      'as the data in the uploaded file will be changed and cannot be restored.',
  },
  dataPointReport: {
    base: {
      title: 'Search data',
    },
    tab: {
      data: 'Data',
    },
    title: {
      numberOrder: 'No.',
      receivedAt: 'Received At',
      phaseName: 'Phase name',
      pointName: 'Point name',
    },
    button: {
      add: 'Add',
      exportExcel: 'Export Excel',
    },
    optionalInfo: {
      year: 'Year',
      month: 'Month',
      symbol: 'Symbol',
      weather: 'Weather',
      sampler: 'Sampler',
      notes: 'Notes',
      monitoringPlace: 'Monitoring place',
      requirements: 'Requirements',
      method: 'Method',
      chemical: 'Chemical',
      conditions: 'Conditions',
      equipmentlist: 'Equipment list',
      analyst: 'Analyst',
      placeOfAnalysis: 'Place Of Analysis',
      createdAt: 'Data entry date',
    },
    form: {
      label: {
        province: 'Select Site',
        stationType: 'Types Of Station',
        phase: 'Phase',
        point: 'Point',
        time: 'Time',
        exceeded: 'Only Exceeded',
      },
      dataPicker: {
        inRange: 'In Range',
      },
      required: {
        stationType: 'Station type is required',
        phase: 'Phase is required',
        point: 'Point is required',
        range: 'Time is required',
      },
    },
    titleExcel: {
      title: 'Manual monitoring station data from',
      to: 'to',
    },
  },
  menuApp: {
    dashboard: {
      base: 'Dashboard',
      healthcheck: 'Health check',
      overview: 'Overview',
    },

    monitoringSub: 'Data Monitoring',
    monitoring: {
      base: 'Real-time Monitoring',
      map: 'Map',
      mapAQI: 'Map AQI',
      camera: 'Camera',
      chart: 'Chart',
      dataAnalytics: 'Data Insights',
      historyData: 'History Data',
      avgData: 'Average Data',
      report: 'Reports',
    },
    monitoringList: {
      base: 'Real-time Monitoring List',
    },
    stationFixedSub: 'Periodic monitoring',
    stationFixed: {
      base: 'Manage the monitoring phase',
      stationFixed: 'Monitoring point management',
      importData: 'Enter the monitoring point data',
      monitoringData: 'Monitoring data',
      uploadFile: 'Monitoring report management',
      report: 'Search',
      map: 'Map',
    },
    processDataSub: 'Data Processing',
    processData: {
      approveData: 'Check Data',
      config: 'Config',
    },

    shareDataSub: 'Data Sharing',
    shareData: {
      shareConfig: 'Sharing Configurations',
      ftpConfig: 'FTP Transfer Configurations',
      apiSharing: 'Sharing API',
    },

    advanceSub: 'Advanced',
    advance: {
      aqiMap: 'AQI Map',
      aqiStatistic: 'AQI Historical',
      wqiMap: 'WQI Map',
      wqiHour: 'WQI - Hour',
      wqiDay: 'WQI - Day',
      wqiPeriodic: 'WQI - Periodic',
      wqiStatistic: 'WQI Historical',
      config: 'Select AQI & WQI Calculations',
    },

    configSub: 'Settings',
    config: {
      stationAuto: 'Manage Stations',
      stationAutoConnection: 'Station Connect Configuration',
      sendNotification: 'Push Notifications Configuration',
      sampling: 'Station Sampling Configuration',
      configAQI: 'AQI Calculation Configuration',
      configWQI: 'WQI Calculation Configuration',
      camera: 'Station Camera Configuration',
      color: 'Warning Color Configuration',
      parameter: 'Parameters',
      stationType: 'Types of Station',
      site: 'Sites',
      standard: 'Standards Filter',
      role: 'Roles',
      user: 'Users',
      dataLogger: 'System Logs',
      service: 'Service configuration',
      qaqc: 'Data Processing',
      ConfigNotify: {
        titleTable: {
          status: 'Status',
          notification: 'Notification',
          frequency: 'Frequency',
        },
      },
    },

    camera: 'Camera',
    map: 'Map',
    data: 'Data',
    dataSearch: 'Data Search',
    dataSearchFixed: 'Fixed Data Search',
    avgData: 'Average Data',
    manage: 'Manage',
    measuring: 'Parameter',
    stationType: 'Types Of Station',
    stationAuto: 'Manage Stations',
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
    mapFixed: 'Map',
    reportSub: 'Report',
    report: {
      type1: 'Original data',
      type2: '24 hour average',
      type3: 'Average maximum of 1 hour',
      type4: 'Average maximum of 8 hour',
      type5: 'AQI hours / day',
      type6: 'AQI average 24h by parameter',
      type7: 'AQI day by parameter',
      type9: 'Percentage of data',
      type10: 'Percentage of obtained data',
      type11: '1 hour average',
      type12: 'Percentage of exceeded data',
      aqiHour: 'AQI - Hour',
      aqiDay: 'AQI - Day',
      aqi878: 'AQI - 1479',
      status_data: 'Status Data',
      type2_flow: 'Emission Flow',
      status_data_obj: {
        title: 'Report Status Data',
        dateRange: 'Date range',
      },
      type1_exceed: 'Data over the threshold',
      table: {
        header: {
          station: 'Station',
          parameter: 'Parameter',
          dischargeThreshold: 'Discharge Threshold',
          unit: 'Unit',
          minValue: 'Min Value',
          maxValue: 'Max Value',
          value: 'Value',
          time: 'Time',
          averageValue: 'Average Value',
          metricReceived: 'Metric Received',
          totalValue: 'Total Value',
          percentData: 'Percent Data',
          dataExceedsStandard: 'Data Exceeds Standard',
          timeUsuallyExceeds: 'Time Usually Exceeds',
          note: 'Note',
        },
      },
    },
    reportBreadcrum: {
      type1: 'Original data',
      type2: 'Results of 24-hour average monitoring',
      type3: 'Average maximum 1 hour of the day',
      type4: 'Average maximum 8 hour of the day',
      type5: 'AQI hours / day',
      type6: 'AQI average 24h by parameter',
      type7: 'AQI day by parameter',
      type9: 'Percentage of data',
      type10: 'Percentage of obtained data',
      type11: 'Results of 1-hour average monitoring',
      type12: 'Percentage of exceeded data',
      aqiHour: 'AQI - Hour',
      aqiDay: 'AQI - Day',
      wqiHour: 'WQI - Hour',
      wqiDay: 'WQI - Day',
      status_data: 'Status Data',
      type2_flow: 'Emission Flow',
      type1_exceed: 'Exceed Report',
    },
    billing: 'Billing',
    ticket: 'Incident',
    language: 'Languages',
    alarm: 'Alarm',
  },
  tooltipMenuApp: {
    notification: 'Notifications',
    dashboard: 'General monitoring of data status information of stations',
    monitoringSub:
      'Monitoring data of each station in real time and look up data',
    stationFixedSub: 'Periodic monitoring',
    monitoring: {
      base:
        'Real-time monitoring of data for each monitoring point and sampling operations',
      map: 'Monitoring location of monitoring points on the map background',
      camera: 'Monitor all cameras at the monitoring points',
      dataAnalytics: 'Analytics of the data',
      historyData:
        'Look up the original data of the monitoring point by time period',
      avgData:
        'Look up the average data of the monitoring point by time period',
      mapAQI:
        'Monitor the latest hourly air quality index on the map background',
    },
    monitoringList: {
      base:
        'Real-time monitoring of data according to the list of all monitoring points',
    },

    processDataSub: 'Configure to remove invalid data',
    processData: {
      configNew: 'Select the factors that affect the invalid data',
      approveData: 'Look up data after removing invalid data',
    },
    shareData: {
      shareConfig:
        'Select monitoring points and parameters for data publication',
      ftpConfig:
        'Select monitoring points and parameters to transfer to an external folder using FTP',
      shareAPI: 'Manage lists, create new API and share API',
    },
    shareDataSub: 'Configure to share data from the system to the outside',
    reportSub: 'Select the report type to export the results',
    report: {
      type10: 'Statistics on the percentage of observed data received',
      type2:
        'The average of the value of measured during 24-hour (a night day)',
      type11: 'The average of the value of measured during 1-continuous hour',
      type3:
        'Maximum value among the average values ​​of 1 hour in 1 day measured value',
      type4:
        'Maximum value among the average values ​​of 8 hours in 1 day measured value',
      type12: 'Statistics percent data that exceeds the threshold for the day',
      status_data: 'Summary report on status of data at many stations',
      aqi_hour: 'Report the AQI value of each station',
      aqi_day: 'Report AQI day values ​​for multiple stations',
      type1_exceed:
        'Statistics data that exceeds the threshold of monitoring stations by time',
      type2_flow: 'Statistics emission flow of monitoring stations by time',
    },
    advanceSub: 'Advanced functions of the system',
    advance: {
      wqiMap:
        'Monitor the latest hourly surface water quality index on the map background',
      wqiHour: 'Report the WQI value of each station',
      wqiDay: 'Report WQI day values ​​for multiple stations',
      config: 'Select station to calculate AQI or WQI value ',
    },
    configSub:
      'Configure issues related to monitoring points and system administration',
    config: {
      configAQI: 'Configuring and selecting the method to calculate AQI',
      configWQI: 'Configuring and selecting the method to calculate WQI',
      stationAuto: 'Manage lists and create new monitoring points',
      stationAutoConnection:
        'Connection parameters are configured in the txt file and in the system',
      sendNotification:
        'Selection of receiving alerts from the monitoring points',
      sampling: 'Select monitoring points with sampling feature',
      color: '',
      camera: 'Attach and allow the station to display the Camera',
      parameter:
        'Create a new parameter before proceeding to Create a new monitoring point',
      stationType:
        'Create a new type of station before proceeding to Create a new monitoring point',
      site:
        'Create a new Site before proceeding to Create a new monitoring point',
      standard:
        'Create a new Standard before proceeding to Create a new monitoring point',
      role: 'Add new Roles groups to manage in the system',
      user: 'Add new and Assign Roles accounts in the system',
      dataLogger: 'The user history of operations in the system',
      qaqc: 'Configuration of removing invalid data',
    },
    billing: {
      dataLookup: 'Tra cứu dữ liệu',
      incident: 'Quản lý sự cố',
      configProperties: 'Cấu hình thuộc tính',
    },
    language: 'Configure Languages',
    hideMenu: 'Hide menu',
    showMenu: 'Show menu',
  },
  dataLogger: {
    breadcrumb: {
      base: 'System Logs',
    },
    list: {
      emptyView: 'There Are No Records To Display',
      colNo: 'No.',
      colUser: 'Email',
      colTime: 'Date time',
      colAction: 'Action',
      colDevice: 'Device',
      colDetail: 'Detail',
      jsonFile: 'File Json',
      jsonView: 'View Json',
    },
    searchForm: {
      user: 'Select user',
      typeLog: 'Type Log',
      from: 'Select date',
      to: 'Select date',
      download: 'Xuất Excel',
    },
    action: {
      login: 'Login',
      logout: 'Logout',
      add_measuring: 'Add Measuring',
      update_measuring: 'Update Measuring',
      delete_measuring: 'Delete Measuring',
      add_province: 'Add Province',
      update_province: 'Update Province',
      delete_province: 'Delete Province',
      add_qcvn: 'Add Standard Filter',
      update_qcvn: 'Update Standard Filter',
      delete_qcvn: 'Delete Standard Filter',
      add_station_type: 'Add Station Type',
      update_station_type: 'Update Station Type',
      delete_station_type: 'Delete Station Type',
      add_station_auto: 'Add Station Auto',
      update_station_auto: 'Update Station Auto',
      delete_station_auto: 'Delete Station Auto',
      add_role: 'Add Role',
      update_role: 'Update Role',
      delete_role: 'Delete Role',
    },
  },
  cameraControl: {
    station: {
      label: 'Station name',
      placeholder: 'Select station',
    },
    stationType: {
      label: 'Station type',
      placeholder: 'Select station type',
    },
    selectStationPlaceholder: 'Input Station Name',
  },
  support: {
    breadcrumb: {
      base: 'Support',
    },
    form: {
      type: {
        label: 'Type',
        error: 'Please select type',
      },
      title: {
        label: 'Title',
        error: 'Please input title',
      },
      content: {
        label: 'Content',
        error: 'Please input content',
      },
      upload: {
        label: 'Upload',
        buttonLabel: 'Click to Upload',
        error: 'Error',
      },
    },
  },
  documents: {
    label: 'Documents helpdesk',
    guide1: 'Guide install 1',
    guide2: 'Guide install 2',
    develop: {
      title: 'This function is developing',
      process: 'We will send newsletter when we complete',
    },
  },
  statistic: {
    exceeded: 'Exceeded',
    perRecData: 'Percent Of Received Data',
    perRecDataFrom: {
      breadCrumb: 'Percent Of Received Data',
      time: 'Thời gian',
      totalFile: 'Total file/day',
      totalFileReceivedAt: 'Total file received',
      perFileReceivedAt: 'Ratio file received (%)',
    },
    exceededFrom: {
      breadCrumb: 'Statistics of the number of passes/days',
      time: 'Thời gian',
      totalFile: 'Total file/day',
      totalFileReceivedAt: 'Total file received',
      perFileReceivedAt: 'Ratio file received (%)',
    },
    aqi: {
      menuApp: 'AQI',
      breadCrumb: 'AQI hours - days',
      selectMonths: 'Select months',
      time: 'Time',
      day: 'Day',
      title: 'AQI By Hours',
      reportName: 'REPORT ON CALCULATION OF AQI BY HOURS',
      reportName2: 'REPORT ON CALCULATION OF AQI BY DAYS',
      searchName:
        'The statistics for the AQI hour math results by the period from {{= it.fromDate}} to {{= it.toDate}}.',
      searchNameDay:
        'The statistics for the AQI day math results by the period from {{= it.fromDate}} to {{= it.toDate}}.',
    },
    wqi: {
      menuApp: 'WQI',
      breadCrumb: 'WQI',
      selectMonths: 'Select months',
      time: 'Time',
      day: 'Day',
      title: 'WQI By Hours',
    },
  },
  pageInfo: {
    header: 'Information',
    body1:
      'This is a function of the Advanced version, please contact us for more information:',
    body2: 'Email:',
    body3:
      'You need to move to the AQI Calculation page to select the AQI calculation method.',
  },
  stationStatus: {
    good: 'Good',
    lostSignal: 'Lost connection',
    notConnected: 'Not connected yet',
    connecting: 'Connecting',
    connected: 'Connected',
    exceeded: 'Exceeded',
    exceededPreparing: 'Tend to exceed',
    exceededTendency: 'Tend To Exceed',
  },
  actions: {
    gotoMonitoring: 'Go to Real-time Monitoring Page',
    viewDataAroundThisTime: 'View data around this time',
    tryAgain: 'Try again',
    next: 'Move',
  },
  network: {
    sampling: {
      lostConnection:
        'Unable to connect to the sampling service, please contact the administrator!',
      StatusFail: 'Cannot get status, try again',
    },
    camera: {
      lostConnection: "Can't connect with Camera, Please check the connection!",
    },
    qaqc: {
      lostConnection:
        'Unable to connect to the QAQC service, please contact the administrator!',
    },
  },
  serverResponse: {
    error: {
      VersionError: 'Data has been updated by other users, please refresh!',
    },
  },
  confirm: {
    msg: {
      restore: 'Do you want to restore this item?',
      delete: 'Do you want to delete this item?',
      disable: 'Do you want to disable this item?',
    },
  },
  common: {
    station: 'Station',
    device: 'device',
    measure: 'measuring',
    measures: 'measurings',
    measure2: 'measurings:',
    notUse: 'Not In Use',
    deviceStatus: {
      sensorGood: 'the device is in normal state now:',
      sensorError: 'the device connected failure:',
      sensorMaintain: 'the device is in calibration progress:',
      dataExceeded: 'has been exceeded the threshold:',
      dataExceededPrepare: 'tends to exceed the threshold:',
      dataGood: 'Good',
      dataGood2: 'is in normal state now:',
      dataLoss: 'data has not been transferred recently.',
      dataConnected: 'has normal signal now.',
      dataLossMonitoring: 'Lost connection',
      dataExceededMonitoring: 'Exceeded',
      dataExceededPrepareMonitoring: 'Tend to exceed',
      dataGoodMonitoring: 'Good',
      sensorErrorMonitoring: 'Device error',
      sensorMaintainMonitoring: 'Calibration',
      sensorGoodMonitoring: 'Good',
    },
    overview: 'Overview',
    list: 'List',
    statusSensor: 'Sensor Status',
    statusData: 'Data Status',
  },
  apps: {
    title: 'Apps',
    incidents: 'Incidents Communication',
    monitoring: 'Online Monitoring',
    grafana: 'Data visualization',
    ilotusland: 'iLotusLand Monitoring',
    databaseManagement: 'Database management',
    billing: 'Environmental protection fee',
  },
  stationReview: {
    title: 'Station Reviews',
    action: {
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
    },
    form: {
      placeholder: 'Write your review',
    },
  },
  element: {
    rangePicker: {
      startDate: 'Start date',
      endDate: 'End date',
    },
  },
  configService: {
    title: 'Service provider configuration',
    esmsService: 'ESMS Service',
    smsService: 'SMS Service',
    mailGunService: 'MailGun Service',
    testConfiguration: 'Check Configuration',
    customerCare: 'Customer Care',
    advertisement: 'Advertisement',
    phoneNumberReceiveMessage: 'Phone number to receive the message',
    emailAddress: 'Email Address',
    esmsDescription:
      'We will send a sample SMS to your phone number. Please wait 1-3 minutes',
    mailGunDescription:
      'We will send an email to your email address. Please wait 1-3 minutes',
    sendMessageSuccessfully: 'Sent successfully',
    esmsForm: {
      url: {
        label: 'API URL',
        placeholder: 'API URL',
      },
      key: {
        label: 'API Key',
        placeholder: 'ESMS API Key',
      },
      secret: {
        label: 'SECRET Key',
        placeholder: 'ESMS Secret Key',
      },
      smsType: {
        label: 'SMS Type',
        placeholder: 'Sms Type',
      },
      brand: {
        label: 'Brand Name',
        placeholder: 'Brand Name',
      },
    },
    twilioForm: {
      accountSid: {
        label: 'ACCOUNT SID (You could find them in your',
        message: 'ACCOUNT SID',
        placeholder: 'Account SID',
      },
      authToken: {
        label: 'AUTH TOKEN (You could find them in your',
        message: 'AUTH TOKEN',
        placeholder: 'Auth token',
      },
      twilioNumber: {
        label: 'TWILIO NUMBER (You can get one',
        message: 'TWILIO NUMBER',
        placeholder: 'Twilio number',
      },
      smsType: {
        label: 'SMS Type',
        placeholder: 'Sms Type',
      },
      brand: {
        label: 'Brand Name',
        placeholder: 'Brand Name',
      },
    },
    mailGunForm: {
      domain: {
        label: 'Domain',
        placeholder: 'MailGun Domain',
      },
      key: {
        label: 'API Key',
        placeholder: 'MailGun API Key',
      },
      emailFrom: {
        label: 'Email From',
        placeholder: 'Email From',
      },
    },
    changeServiceName: 'Change to {{=it.serviceName}} successful',
  },
  apiSharing: {
    stationManagement: 'Station Management',
    stations: 'Station list',
    averageData: 'Average data per hour',
    dataHistory: 'History data',
    aqi: 'Monitoring station has AQI',
    stationName: 'Station name',
    stationAddress: 'Station address',
    stationTypeKey: 'Key of station type',
    page: 'Number of pages',
    itemPerPage: 'Number item of per page',
    stationAutoKey: 'Key of station auto',
    measuringList: "List measure separated by ','",
    fromDate: 'From Date',
    toDate: 'To Date',
    filterByExceeded: 'Filter data with exceeded status',
    allowedAQI: 'Station key list is allowed to configure AQI',
  },
  dataAnalytics: {
    filterForm: {
      province: {
        label: 'Province',
      },
      stationType: {
        label: 'Station type',
      },
      operator: {
        label: 'Operator',
        avg: 'Average',
        min: 'Min',
        max: 'Max',
        sum: 'Sum',
      },
      time: {
        label: 'Times',
      },
      stationAutoLabel: {
        label: 'Station Auto ({{=it.count}} stations)',
      },
      parameterLabel: {
        label: 'Measure Parameter ({{=it.count}} measures)',
      },
      parameterAdvLabel: {
        label: 'Advance Measure Parameter ({{=it.count}} measures)',
      },
      stationAuto: 'Stations',
      parameter: 'Measure parameter',
    },
    measuredValue: 'Measure value',
    standardViews: 'Display standards',
    standard: 'Standard',
    exportExcel: 'Export excel',
    chartType: {
      column: 'Column',
      line: 'Line',
      table: 'Table',
    },
  },
  dataAverage: {
    form: {
      stationAuto: 'Station Name ({{=it.count}} stations):',
      measuringList: 'Parameters ({{=it.count}} parameters):',
      addCondition: 'Add Filter Condition',
    },
    tooltip: {
      addCondition: 'Add filter conditions for monitoring stations',
      filterData:
        'Filter invalid data with standard before calculating (apply data processing config)',
      standard:
        'Apply the comparison of measure values according to established standards',
    },
    standard: {
      label: 'Display Standards',
      placeholder: 'Selection of the standard of comparison',
    },
    tabs: {
      station: {
        label: 'View Data By Station',
      },
      overview: {
        label: 'View Aggregated Data',
        data: 'Data',
        chart: 'Chart',
      },
    },
  },
  stationFixedDriver: {
    title: {
      search: 'Look up data',
      station: 'Monitoring station',
      importData: 'Import Data',
      historyData: 'Upload history',
      fileName: 'Filename',
      FileSize: 'Size',
      createAt: 'Upload time',
      user: 'Uploader',
      preview: 'Preview',
    },
    success: 'Upload successful',
    error: 'Upload failed',
    deleteSuccess: 'Delete successful',
  },
  wqiStationFix: {
    order: 'No.',
    viewBy: 'View By',
    month: 'Monthly',
    year: 'Annually',
    quarter: 'Quarterly',
    time: 'Time',
    chart: 'Chart',
    table: 'Data',
    exportBtn: 'Export Data',
    fileExport: 'WQI Data',
    requireTime: 'Please Select Time',
    pointName: 'Point Name',
    avgTime: 'Time',
    wqiValue: 'WQI Value',
    wqiLevel: 'WQI Level',
    lat: 'Latitude',
    lng: 'Longitude',
  },
  apiSharingNew: {
    head: {
      apiName: 'API Name',
      dateCreated: 'Create At',
      dateEdited: 'Updated At',
    },
    menu: {
      'data-station-auto': 'Automatic Monitoring Data',
      'data-station-fixed': 'Periodic Monitoring Data',
      weather: 'Weather',
      'data-periodical-forecast': 'Periodic Forecast Data',
    },
    fields: {
      stationFixed: {
        stationKeys: 'Point Name',
      },
      province: 'Site',
      stationType: 'Types Of Station',
      stationAuto: 'Station Auto',
      measuringList: 'Parameters',
      dataType: 'Types Of Data',
      isExceeded: 'Only Exceeded',
      rangeTime: 'Time',
      viewBy: 'View By',
      stationKeys: 'Station Name',
      phaseIds: 'Phase Name',
      cityId: 'Town/City',
      parameterList: 'Parameters',
      days: 'Forecast Days',
      broadcastTime: 'Broadcast Date',
    },
    titleMenu: {
      'data-station-auto-newest-data': 'Latest Data',
      'data-station-auto-history-data': 'History Data',
      'data-station-fixed-newest-data': 'Latest Data',
      'data-station-fixed-history-data': 'History Data',
      'data-station-fixed-newest-wqi': 'Latest WQI Data',
      'data-station-fixed-history-wqi': 'History WQI Data',
      'weather-newest-data': 'Real-time Data',
      'weather-feature': 'Weather Forecast Data',
      'data-periodical-forecast-newest-data': 'Lastest data',
      'data-periodical-forecast-history-data': 'History data',
    },
    detailPage: {
      header: {
        generalInfo: 'General Information',
        condition: 'Conditions',
        querySetting: 'Query Setup',
        parameter: 'Parameters',
      },
      label: {
        apiName: 'API Name',
        apiType: 'Types Of API',
        description: 'Description',
        province: 'Site',
        stationType: 'Types Of Station',
        defaultParameter: 'Default Parameters',
        optionParamter: 'Custom Parameters',
        stationName: 'Station Name',
        parameter: 'Parameters',
        typeData: 'Types Of Data',
        isExceeded: 'Only Exceeded',
        timeLabel: 'Time',
        phase: 'Phase Name',
        point: 'Point Name',
        field: 'Field',
        type: 'Type',
        city: 'Town/City',
        country: 'Country',
        paramenter: 'Parameters',
        days: 'Forecast Days',
        chooseCondition: 'Select Conditions',
        broadcastTime: 'Broadcast Date',
      },
      description: {
        province: 'Province',
        stationType: 'Type Of Station',
        stationAuto: 'Station Code',
        measuringList: 'Measuring Code',
        dataType: 'Data Type',
        isExceeded: 'Exceeded',
        stationKeys: 'Station Code',
        phaseIds: 'Phase Code',
        cityId: 'City Code',
        parameterList: 'Parameter Code',
        days: 'Forecast Days',
        viewBy: 'View by: Monthly, Quarterly or Yearly',
        timeRange: 'Time ranges',
        broadcastTime: 'Broadcast Date',
      },
      table: {
        tt: 'No.',
        time: 'Received At',
        stationName: 'Station Name',
        pointName: 'Point Name',
        phaseName: 'Phase Name',
        timeWeather: 'Time',
        date: 'Date',
        dataType: ' Type Of Data',
        measureValue: 'Mực nước',
        alarmLevelI: 'Alarm Level I (m)',
        alarmLevelII: 'Alarm Level II (m)',
        alarmLevelIII: 'Alarm Level III (m)',
        dataSource: 'Data Source',
        nodata: 'No Data',
        exportData: 'Export Data Excel',
      },
      message: {
        create: 'Create Success',
        edit: 'Edit Success',
        delete: 'Delete Success',
      },
      rules: {
        name: 'Please enter API name',
        max: 'Do not enter more than 64 characters',
        requireChoose: 'Please select at least 1 value',
        requireStation: 'Please select at least 1 value',
        requireBroadcastTime: 'Please select Broadcast Date',
      },
    },
    button: {
      save: 'Save',
      search: 'Search',
      create: 'Create API',
      edit: 'Edit',
      delete: 'Delete',
      nodata: 'No Data',
    },
    tab: {
      configTab: 'API Configuration',
      viewDataTab: 'Data Query',
      list: 'Data List',
      example: 'Example',
    },
    weather: {
      temp: 'Temp',
      rh: 'Moisture',
      wind_spd: 'Wind',
      wind_cdir_full: 'Wind direction',
    },
  },
  periodicalForecast: {
    menu: {
      periodical: 'Periodic Forecast',
      station: 'Station Management',
    },
    toolTipMenu: {
      periodical: 'Monitoring data of periodic forecast and look up data',
      station: 'Manage lists and create new monitoring stations',
      import:
        ' Import data of the monitoring station and look up import history',
      search: ' Look up the monitoring station by time',
    },
    title: {
      search: 'Search Data',
      station: 'Station Management',
      importData: 'Import Data',
      historyData: 'Import History',
      fileName: 'File Name',
      broadcastTime: 'Broadcast Date',
      createdAt: 'Upload Time',
      user: 'Users',
      downloadFile: 'Download',
    },
    label: {
      stationNam: 'Name',
      stationKey: 'Code',
      stationInfo: 'Station Information',
      unit: 'Unit',
    },
    placeholder: {
      stationName: 'Monitoring station name',
      stationKey: 'Code of station name',
      name: 'Station name',
    },
    message: {
      createSuccess: 'Add New Station Successfully',
    },
    export: 'Broadcast data of',
  },
  language: {
    breadcrumbs: {
      base: 'Configure language',
    },
    content: {
      notificationFreq: 'How often to send alerts',
      global: 'Overview',
      rules: 'Type 1 message',
      errors: 'Type 2 message',
      empty: 'Type 3 message',
      notification: 'Send alert',
      contact: 'Information 1',
      unit: 'Unit',
      chart: 'Chart',
      dashboard: 'System Monitor',
      monitoring: 'Online monitoring',
      aqi: 'AQI',
      aqiConfigCalculation: 'Configure AQI Calculation',
      wqi: 'WQI',
      wqiConfigCalculation: 'Configure WQI Calculation',
      qaqc: 'Data Moderation',
      qaqcConfig: 'Data moderation configuration',
      controlStation: 'Control Sampling',
      map: 'Map',
      dataSearchFixed: 'Fixed data search',
      dataSearchFrom: 'Search data',
      aqiSearchForm: 'Search AQI data',
      avgSearchFrom: 'Search for average data',
      dataSearchFilterForm: 'Data Search Filter',
      measuringManager: 'Parameter Management',
      stationTypeManager: 'Manage station type',
      stationFixedPhase: 'Manage periodic monitoring',
      stationFixedPoint: 'Recurring Point Management',
      qcvn: 'Regulation management',
      province: 'Management of management units',
      configWQI: 'Configure WQI',
    },
    tabs: {
      tab1: 'Languages',
      tab2: 'Translation',
    },
    list: {
      emptyView: 'There Are No Records To Display',
      colSTT: 'No.',
      colDevice: 'Device',
      colKey: 'Key',
      colFeature: 'Feature',
      colVI: 'Vietnamese',
      colEN: 'English',
      colTW: 'Taiwan',
      colLanguage: 'Language',
      jsonView: 'View Json',
      colStatus: 'Status',
    },
  },
  billing: {
    title: {
      config: 'Charge Config',
      report: 'Charge Report',
      name:
        'REPORTING ENVIRONMENTAL PROTECTION CHARGES FOR INDUSTRIAL WASTE WATER',
      detail:
        'Statistics are according to {{=it.time}} from date {{=it.from}} to {{=it.to}}',
      reportMonth: 'month {{it.param}}',
      reportQuarter: 'quarter {{it.param}}',
    },
    menu: {
      billingReport: 'Charge Report',
      billingConfig: 'Charge Config',
    },
    option: {
      reportQuarter: 'Report Quarter',
      reportMonth: 'Report Month',
      reportCustom: 'Report Custom',
      quarter: 'Quarter',
      month: 'Month',
    },
    label: {
      key: 'Charge Config Code',
      name: 'Charge Config Name',
      fixedFee: 'Variable Charge (vnd/year)',
      flowKey: 'Flow',
      timeStart: 'Time start',
      timeEnd: 'Time end',
      note: 'Note',
      time: 'Time',
      reportType: 'Types Of Report',
      stationType: 'Types Of Station',
      stationName: 'Station Name',
      billingConfig: 'Set Of Recipes',
    },
    placeholder: {
      key: 'Charge Config Code',
      name: 'Charge Config Name',
      fixedFee: 'Fixed Charge (vnd/year)',
      flowKey: 'Flow',
      timeStart: 'Time Start',
      timeEnd: 'Time End',
      note: 'Note',
      time: 'Time',
    },
    pattern: 'Not allowed to enter special characters',
    max: 'No more than 64 characters',
    max256: 'No more than 256 characters',
    now: 'Now',
    required: {
      key: 'Please Type Code',
      name: 'Please Type Name',
      fixedFee: 'Please Type Fixed Charge',
      flowKey: 'Please choose 1 measure',
      timeStart: 'Please Choose Time Start',
      timeEnd: 'Time End must large than Time Start',
      stationType: 'Please Choose Types Of Station',
      stationName: 'Please Type Station Name',
      billingConfig: 'Please Choose Set Of Recipes',
      time: 'Please Choose Time',
      sameQuarter: 'Please select a time period within 1 quarter',
    },
    table: {
      month: {
        stt: 'No.',
        date: 'Date',
        avgValue: 'Average value of pollution parameter / day (24h)',
        price: 'Cost',
        sumPrice: 'Total Cost (dong)',
        flow: 'Flow (M³/ngày)',
        sum: 'Sum',
      },
      quarter: {
        typeFee: 'Fee',
        month: 'Month',
        amountOfWastewater: 'Amount Of Wastewater',
        price: 'Const',
        totalFee: 'Total amount payments in Quarter',
        debt: 'Unpaid or underpaid fees from the previous quarter',
      },
    },
    button: {
      exportReport: 'Export Report',
    },
  },
  ticket: {
    menu: {
      dataLookup: 'Data Lookup',
      incident: 'Incident Management',
      configProperties: 'Config Properties',
    },
    incidentType: {
      default: 'Other type problem',
      station: 'Incident of monitoring station',
      measure: 'Observation parameter problem',
    },
    modal: {
      title: 'Set up the download report template',
      description:
        'Select and arrange the order for information columns in the report',
      button: {
        cancel: 'Cancel',
        download: 'Download',
      },
    },
    excel: {
      name: 'Incident Name',
      type: 'Incident Type',
      createdAt: 'Input Time',
      province: 'Site',
      stations: 'Station Name',
      measures: 'Parameter',
      status: 'Status',
      timeStart: 'Start Time',
      timeEnd: 'End Time',
    },
    label: {
      dataLookup: {},
      incident: {
        name: 'Instance name',
        incidentType: 'Incident Type',
        description: 'Description',
        stationName: 'Station name',
        provinceName: 'Management unit',
        measure2: 'Relevant parameters',
        measure: 'Parameters',
        time: 'Fault time',
        attachment: 'Attach file',
        confirmDelete: 'Do you want to delete this issue',
        createAt: 'Created at {{=it.time}} date {{=it.date}} ',
        updatedAt: 'Last update {{=it.time}} date {{=it.date}} ',
        detailInfo: 'Details',
        status: 'Status',
      },
      configProperties: {
        name: 'Name',
        type: 'Type',
        order: 'Order in export Excel',
        hidden: 'Show',
        category: 'Add Category',
        switch: {
          hide: 'Hide',
          show: 'Show',
        },
      },
    },
    placeholder: {
      dataLookup: {},
      incident: {
        name: 'Enter problem to solve',
        incidentType: 'Other incident',
        description: 'Enter a description for the problem',
        stationName: 'Select station name',
        measure: 'Parameters',
      },
      configProperties: {
        name: 'Enter name problem',
        type: 'Category',
        order: '1',
      },
    },
    title: {
      dataLookup: {},
      incident: {
        drawer: 'Create new issue',
        report: 'Report_Incident Management_',
      },
      configProperties: {
        drawer: {
          add: 'Create Config',
          edit: 'Edit Config',
        },
      },
    },
    message: {
      incident: {
        createSuccess: 'Create Success',
        notificationSuccess: 'Update Incident Success',
        fileSizeLimit: 'File size exceeds 10MB',
        notificationError: 'Error',
      },
      configProperties: {
        success: 'success',
        error: 'Error',
      },
    },
    required: {
      incident: {
        name: 'Please enter a problem name',
        incidentType: 'Please select incident type',
        description: 'Please enter a description for the problem',
        stationName: 'Please select a monitoring station',
        measure: 'Please select a parameter',
        time: 'Please select a time',
        recipient: 'Please select a recipient',
      },
      configProperties: {
        required: 'Please input value',
        isNumber: 'Please input number',
      },
    },
    button: {
      incident: {
        create: 'Create new problem',
        delete: 'Delete problem',
      },
      configProperties: {
        add: 'Create',
        edit: 'Save',
        del: 'Delete',
      },
    },
  },
  alarm: {
    menu: {
      management: 'Management Config',
      history: 'History Alarm',
    },
    tooltipMenu: {
      management: 'Management Config',
      history: 'History Alarm',
    },
    title: {
      createAlarm: 'Create Alarm',
      chanel: 'Channels',
    },
    popconfirm: {
      title: 'Are you want to delete this alarm',
    },
    suggest: {
      disconnectionTime: 'Time from the lost signal to come to send warning',
    },
    required: {
      disconnectionTime: 'Please type disconnect time',
      station: 'Please choose at least station',
      province: 'Please choose at least province',
      timeEnd: 'End Time must be larger than Start Time',
    },
    label: {
      management: {
        name: 'Alarm Name',
        type: 'Alarm Type',
        disconnectionTime: 'Disconnection Time (minute)',
        repeatConfig: 'Repeat Send',
        station: 'Station',
        measure: 'Measure',
        device: 'Device',
        compare: 'Compare',
        value: 'Value',
        status: 'Status',
        recipient: 'Recipient',
        frequency: 'Frequency',
        deviceStatus: {
          good: '00 (Device Good)',
          error: '02 (Device Error)',
          calibration: '01 (Calibration)',
        },
        addCondition: 'Add Condition +',
        typeCondition: {
          value: 'Value',
          device: 'Device Status',
        },
        standard: 'Standard',
      },
      history: {
        name: 'Alarm Name',
        type: 'Alarm Type',
        station: 'Station',
        time: 'Time',
        province: 'Province',
        status: 'Status',
        timeStart: 'Time Start',
        done: 'Done',
        happening: 'Happening',
        disable: 'Disabled',
        isHappen: 'Active Only',
      },
    },
    placeholder: {
      management: {
        name: 'Type Alarm Name',
        webhook: 'Enter webhook URL',
      },
    },
    message: {
      management: {
        createSuccess: 'Create Alarm Success',
        createError: 'Create Alarm Error',
        updateSuccess: 'Update Alarm Success',
      },
    },
    alarmType: {
      disconnect: {
        label: 'Disconnect',
        value: 'disconnect',
        template: `{{station}} : Name of monitoring station that lost signal,
        {{time}} : Signal loss time of monitoring station`,
      },
      advance: {
        label: 'Advance',
        value: 'advance',
        template: `{{station}} : The name of the monitoring station,
        {{measure}} : The device / The monitoring parameter,
        {{value}} : The value of the parameter,
        {{unit}} : The unit of the parameter,
        {{sign}} : The comparison operator,
        {{config}} : Configurable parameter value,
        {{status}} : The status of the device,
        {{time}} : The time that the condition is meet`,
      },
      exceed: {
        label: 'Exceed',
        value: 'exceed',
        template: `{{station}} : The name of the monitoring station exceeded the threshold,
        {{measure}} : The parameter is exceeded the threshold of the monitoring station,
        {{value}} : The value of the parameter,
        {{unit}} : The unit of the parameter,
        {​​​​​{​​​​​config}​​​​​}​​​​​ : Configurable parameter value,
        {{time}} : The time the parameter was exceeded`,
      },
      device: {
        label: 'Device',
        value: 'device',
        template: `{{station}} : The name of the monitoring station,
        {{measure}} : The device,
        {{status}} : The device's status,
        {{time}} : The time that meet the condition`,
      },
      by_standard: {
        label: 'Standard',
        value: 'by_standard',
      },
      data_level: {
        label: 'Standard',
        value: 'data_level',
      },
    },
    config: {
      alarmDisconnect: 'Disconnect alarm',
      timeDisconnect: 'Time disconnect (minutes)',
      alarmExceed: 'Threshold alarm',
      threshold: 'Threshold',
      thresholdType: 'Threshold Type',
      time: 'Time',
      selectThreshold: 'Select threshold',
      disconnect: 'Disconnect',
      nameThreshold: 'Threshold name',
      add: 'Add',
      save: 'Save',
      require: {
        selectUser: 'Please select at least one user',
        selectThreshold: 'Please select a threshold',
      },
      popConfirmDelete: 'Sure to delete?',
    },
  },
  report: {
    required: {
      time: 'Please choose time',
      station: 'Please choose station',
    },
    placeholder: {
      time: 'Select time',
    },
    qaqc: {
      approveData: 'Data processing',
    },
    exportExcel: 'Export To Excel',
    label: {
      dataRatio: {
        statistic: 'Statistic By',
        type: {
          rangeTime: 'Range Time',
          date: 'Date',
        },
      },
      reportType: 'Types Of Report',
      time: 'Time',
      province: 'Site',
      station: 'Station Name',
    },
    type1_exceed: {
      excel: {
        year: 'Report Percentage Of Value Over Threshold_',
        date: 'Report_Data Over The Threshold_',
      },
      detailTitle: {
        reportYear:
          'Statistics about the percentage of value over the threshold in ',
        reportMonth:
          'Statistics about the percentage of value over the threshold ',
        reportDay: 'Statistics about data over the threshold in ',
      },
      title: {
        year: 'REPORT PERCENTAGE DATA OVER THE THRESHOLD',
        date: 'REPORT DATA OVER THE THRESHOLD BY DAY',
      },
      option: {
        reportYear: 'Report percentage of value over threshold',
        reportDay: 'Report data over the threshold by day',
        year: 'Year',
        day: 'Day',
        month: 'Month',
      },
      table: {
        data_day: 'Statistics For The Day',
        station: 'Station Name',
        param: 'Parameter',
        unit: 'Unit',
        limit: 'Limit Value',
        avg_value: 'Average Value',
        max_value: 'Maximum Value',
        overtime: {
          1: 'Over Threshold For The First Time',
          2: 'Over Threshold For The Second Time',
          3: 'Over Threshold For The Third Time',
        },
        start_time: 'Starting Time',
        process_time: 'Processing Time',
        over_value: 'Over Threshold Value',
        qcvn: 'Technical Regulation',
        permiss_value: 'Permissible Values',
        numday24h:
          'Number of days with 24-hours average exceeding the regulation',
        numday1h: 'Number of days with 1-hour average exceeding the regulation',
        numrecord1h: 'Number of 1-hour average values exceeding the regulation',
        rate:
          'Percentage of 1-hour average values exceeding the regulation (%)',
      },
    },
    type2_flow: {
      title: 'Report of Emission Flow',
      nameFileExel: 'Report_Emission Flow_',
      subTitle: 'Statistics about emission flow',
      dataprocessing: 'Data processing',
      option: {
        reportYear: 'Year Report',
        reportDay: 'Day Report',
        reportMonth: 'Month Report',
        reportRangeYear: 'Multi-Year Report',
        year: 'Year',
        day: 'Day',
        month: 'Month',
        chooseMonth: 'Choose Month',
      },
      by: {
        byDay: 'by day',
        mutipleYear: 'MULTIPLE YEARS',
      },
      range: {
        day: '',
        year: '',
        month: '',
        from: 'from',
        to: 'to',
      },
      required: {
        measure: 'Please select parameter',
      },
      parameter: 'Parameter',
      stationName: 'Station Name',
      diameter: 'Diameter',
      value: 'Value',
      time: 'Time',
    },
    typeRatio: {
      titleExport: 'Report__Percentage Of Obtained Data_',
      notUpdate: 'Not updated',
    },
    typeMonitoring: {
      titleExport: 'Report_Percentage Of Monitoring Data_',
    },
    type2: {
      fileNameExcel: 'Report_24 hour average_',
    },
    statusData: {
      fileNameExcel: 'Report_Status Data_',
    },
    type11: {
      fileNameExcel: 'Report_1 hour average_',
    },
    type10: {
      select: {
        reportType: {
          obtained: 'Report the percentage of obtained data',
          monitoring: 'Report the percentage of monitoring data',
        },
      },
      table: {
        title: {
          measure: 'Parameter',
          valuesByDesign: 'Number of monitoring values by design',
          valuesReceived: 'Number of monitoring values received',
          numberOfError: 'Number of error/abnormal monitoring values',
          percentageReceived: 'Percentage of received data to design value (%)',
          percentageError:
            'Percentage of error/abnormal data to received value (%)',
        },
      },
      nameReport: 'Statistics about the percentage of monitoring data',
    },
  },
  modalExportLang: {
    title: 'Export excel',
    content: 'Select language to export',
    language: {
      en: 'English',
      vi: 'Vietnamese',
      tw: 'Taiwan',
    },
    button: {
      ok: 'Confirm',
      cancel: 'Cancel',
    },
  },
  stationFixedMonitoring: {
    importButton: {
      manual: 'Quick data entry',
      importExcel: 'Upload by form',
    },
    drawer: {
      title: {
        create: 'Import data of monitoring point',
        edit: 'Edit data of monitoring point',
      },
      formBasic: {
        title: 'Basic information',
        nameReport: 'Report name',
        point: 'Monitoring point',
        time: 'Sampling time',
        selectTime: 'Select Time',
        message: {
          nameReport: {
            require: 'Please enter report name',
            max64: 'Do not enter more than 64 characters',
          },
          point: {
            require: 'Please select monitoring point',
          },
          time: 'Please enter select sampling time',
          timeExist: 'Unsuccessful because sample time existed!',
        },
        datePicker: {
          now: 'Now',
          selectTime: 'Select Time',
        },
      },
      formMeasure: {
        title: 'Parameter',
        measure: 'Parameter',
        value: 'Value',
        popupDelete: {
          title: 'Do you want to delete this item?',
        },
        buttonAdd: 'Add parameter',
        message: {
          measure: 'Please select parameters',
          value: 'Please enter the value',
          format: 'Please enter true format',
        },
        hint: {
          text: 'Hint: Pressing <b>tab</b> to go next the cell',
        },
      },
      formOtherInfo: {
        placeholder: 'Enter information',
        title: 'Other information',
        sampler: 'Sampler name',
        monitoringPlace: 'Features of monitoring place',
        requirements: 'Requirements for sampling',
        method: 'Sampling method',
        chemical: 'Color preservatives',
        conditions: 'Sample storage conditions',
        equipmentList: 'List of sampling devices',
        symbol: 'Sample symbol',
        weather: 'Weather features',
        analyst: 'Analyst',
        placeOfAnalysis: 'Place of analysis',
        note: 'Notes',
      },
    },
    updateReportName: {
      success: 'Update report name successfully!',
      error: 'Update report name successfully!',
    },
    popupCreateSuccess: {
      title: 'Create Success',
    },
    popupCreateLogSuccess: {
      title: 'Create information successfully',
    },
    popupEditLogSuccess: {
      title: 'Edit information successfully',
    },
    modalConfirmCancel: {
      content: "The changes you have made, probably won't be saved.",
    },
    button: {
      accept: 'Accept',
      cancel: 'Cancel',
      reset: 'Retype',
      create: 'Create',
      download: 'Download',
      upload: 'Upload',
      update: 'Update',
    },
    importExcel: {
      breadCrumb: 'Import monitoring data',
      nameReport: 'Name report',
      placeholder: 'Enter a name for the report',

      message: 'Please select upload report type',

      note:
        'Note: An identifier for the Report name makes it easier to manage your data',
      desc:
        'Download a sample file to upload a variety of data information to the system.',
      dragger: {
        title: 'Drag and drop your file here',
        desc: 'Support for files .xlsx, .xls',
      },
      notificationUpload: {
        notFile: {
          title: 'Please select File',
          desc: 'Upload files format in .xlsx, .xls ',
        },
        uploadError: {
          title: 'File upload failed',
          desc: 'Some data lines are corrupted. Please check and try again',
        },
        empty: {
          title: 'File upload failed',
          desc: 'File has no data',
        },
        success: {
          title: 'Upload successful',
          desc: 'You have successfully uploaded ',
          desc2: ' data rows.',
        },
      },
    },
    downloadExcel: {
      downloadFile: 'Download the sample file',
      cancel: 'Cancel',

      modal: {
        title: 'Set up the dwnload report template',
        typeReport: {
          title: 'Select report type',
          simpleTitle: 'Simple pattern',
          simpleDesc:
            'Suitable for users to quickly enter data into the system with basic information fields.',
          detailTitle: 'Detailed sample',
          detailDesc:
            'In line with user needs, enter detailed data into the system with detailed information fields.',
        },
        selectStationType: {
          title: 'Station type',
          placeholder: 'Select station type',
          require: 'Please select station type.',
        },
        dragDrop: {
          hint: 'Select and order the values ​​in the report',
        },
        downloadSuccess: 'Download the success report form',
      },
    },
    attachment: {
      message: 'Update report successfully!',
    },
  },

  storageFilter: {
    button: {
      ok: 'Accepct',
      cancel: 'Cancel',
      saveFilter: 'Save filter',
    },
    menu: {
      search: 'Enter the filter name',
      popupConfirm: {
        title: 'Are you sure you want to delete the filter?',
      },
      tooltip: 'Some stations are hidden because you do not have permission',
    },
    modalFilter: {
      title: 'Save filter',
      desc:
        'Filter data by fields created by you will be stored when you name this filter.',
      nameInput: {
        title: 'Filter name',
        placeholder: 'Enter the filter name',
        rules: {
          require: 'Please enter report name',
          max64: 'Do not enter more than 64 characters',
        },
      },
    },
    option: {
      update: {
        title: 'Update filter',
        hint: 'Update old filter based on information fields.',
      },
      create: {
        title: 'Create filter',
        hint: 'Create a new filter based on the information fields.',
      },
    },
    message: {
      updateSuccess: 'Update filter successful',
      saveSuccess: 'Create filter successfully',
      deleteSuccess: 'Delete filter successfully',
    },
  },
}

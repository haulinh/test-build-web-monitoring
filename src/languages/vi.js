export default {
  unit: {
    time: {
      second: 'giây',
      minute: 'phút',
      hour: 'giờ'
    }
  },
  chart: {
    all: 'Tất cả',
    time: 'Thời gian',
    from: 'Từ',
    to: 'Đến'
  },
  dashboard: {
    good: 'Tốt',
    dataLoss: 'Mất kết nối',
    notUse: 'Chưa kết nối',
    connected: 'Đang kết nối',
    exceeded: 'Vượt QCVN',
    exceededPreparing: 'Chuẩn bị vượt',
    exceededTendency: 'Có xu hướng vượt',
    viewInMonitoring: 'Giám sát trực tuyến',
    viewInMap: 'Bản đồ',
    viewMore: 'Xem thêm',
    all: 'Tất cả',
    selectProvince: 'Chọn Đơn vị quản lý',
    tableList: {
      name: 'Tên trạm',
      dataStatus: 'Tình trạng'
    },
    chartRatio: {
      title: 'Biểu đồ tỷ lệ nhận dữ liệu',
      dataByDate: 'Tỉ lệ dữ liệu {{=it.day}} ngày của {{=it.unit}}',
      received: 'Nhận được dữ liệu',
      notReceived: 'Không nhận được dữ liệu',
      byDay: '{{=it.day}} ngày'
    },
    chartStatus: {
      title: 'Biểu đồ tình trạng kết nối',
      titleByUnit: 'Tình trạng kết nối của {{=it.unit}}',
      activate: 'Đang kết nối',
      inactive: `Chưa kết nối`,
      dataLoss: `Mất kết nối`,
      stations: 'trạm',
      max: 'Giới hạn trên: {{=it.max}}',
      min: 'Giới hạn duới: {{=it.min}}'
    },
    activeStationPer: 'Tình trạng kết nối ({{=it.good}}/{{=it.total}})',
    unit: 'Đơn vị'
  },
  monitoring: {
    title: 'Giám sát trực tuyến',
    selectProvince: 'Chọn Đơn vị quản lý',
    selectStationType: 'Chọn loại trạm',
    group: 'Nhóm loại trạm',
    unGroup: 'Bỏ nhóm',
    sortByStationName: 'Sắp xếp theo tên trạm',
    sortByValues: 'Sắp xếp theo tình trạng',
    keywordSearch: 'Nhập tên trạm',
    limit: 'Giới hạn',
    selectGroup: 'Chọn nhóm',
    selectOrder: 'Thứ tự theo',
    dataSearch: 'Tìm kiếm dữ liệu',
    viewInMap: 'Bản đồ',
    sampling: 'Lấy mẫu',
    camera: 'Camera',
    lossAt: 'Mất kết nối lúc',
    notInUse: 'Chưa sử dụng',
    deviceStatus: {
      dataloss: 'Mất tín hiệu',
      sensorError: 'Lỗi thiết bị',
      maintenance: 'Hiệu chuẩn',
      sensorNormal: 'Đang đo',
      normal: 'Đang đo',
      broken: 'Báo lỗi'
    },
    statusResult: 'Kết quả quan trắc',
    note: 'Chú thích',
    actions: {
      sampling: 'Lấy mẫu',
      camera: 'Camera',
      chart: 'Biểu đồ',
      map: 'Bản đồ',
      images: 'Hình ảnh',
      stationInfo: 'Thông tin trạm',
      reviewStation: 'Đánh giá trạm',
      more: {
        label: 'Liên kết',
        historyData: 'Tra cứu số liệu lịch sử',
        averageData: 'Tổng hợp dữ liệu',
        checkData: 'Kiểm duyệt dữ liệu',
        config: 'Cấu hình gửi cảnh báo'
      }
    },
    moreContent: {
      sampling: {
        tabs: {
          sampling: 'Lấy mẫu',
          history: 'Lịch sử',
          config: 'Cấu hình'
        },
        content: {
          totalBottles: 'Tổng số chai:',
          sampledBottles: 'Số chai đã lấy:',
          typeOfSampling: 'Hành động',
          immediatelySampling: 'Thủ công',
          scheduleSampling: 'Tự động',
          bottlesNeedToTake: 'Số chai cần lấy:',
          frequency: 'Chu kỳ lấy mẫu (phút):',
          timeStartSampling: 'Giờ bắt đầu lấy mẫu:',
          dateStartSampling: 'Ngày bắt đầu lấy mẫu:',
          takeSample: 'Lấy mẫu',
          commandSent: 'Đã truyền lệnh',
          takingSample: 'Đang lấy mẫu...',
          active: 'Kích hoạt',
          actived: 'Đã kích hoạt lấy mẫu tự động (Nhấn để hủy hẹn giờ lấy mẫu)',
          activeOverRange: 'Kích hoạt lấy mẫu khi vượt ngưỡng',
          activedOverRange:
            'Đã kích hoạt lấy mẫu khi vượt ngưỡng (Nhấn để hủy)',
          history: {
            stt: 'STT',
            bottleNo: 'Chai số',
            dateTime: 'Thời gian lấy',
            typeOfSampling: 'Hành động',
            activedUser: 'Người kích hoạt',
            result: 'Kết quả lấy mẫu',
            manual: 'Lấy mẫu tức thời',
            cancel_schedule: 'Hủy hẹn giờ lấy mẫu',
            active_schedule: 'Kích hoạt hẹn giờ lấy mẫu',
            config: 'Thay đổi cấu hình',
            reset_bottles: 'Reset số chai đã lấy'
          },
          config: {
            totalBottles: 'Tổng số chai:',
            controlTagName: 'Tag name điều khiển:',
            timeToTakeOneBottle: 'Thời gian lấy mẫu xong 1 chai (phút):',
            save: 'Lưu'
          }
        }
      },
      chart: {
        tab: {
          avgHour: 'Trung bình giờ',
          avgDay: 'Trung bình ngày'
        },
        content: {
          minLimit: 'Giới hạn dưới',
          maxLimit: 'Giới hạn trên',
          to: 'Từ',
          from: 'Đến'
        }
      }
    }
  },
  aqi: {
    title: 'AQI',
    paramsTitle: 'Giá trị AQI {{=it.day}} ngày của từng thông số'
  },
  aqiConfigCalculation: {
    pageName: 'Cấu hình tính toán AQI',
    tab1: 'Ngưỡng mức độ',
    tab2: 'Bảng giá trị BPi',
    tab3: 'Thống số tính toán',
    add: 'Thêm',
    required1D_1H: 'Nhập ít nhất AVG Ngày hoặc AVG Giờ',
    required: 'Vui lòng nhập giá trị',
    collevel: 'Cấp độ',
    colValue: 'Giá trị',
    colLevel: 'Tên mức độ',
    colMin: 'Tối thiểu',
    colMax: 'Tối đa',
    colColor: 'Màu chữ',
    colBackgroundColor: 'Màu nền',
    colDescription: 'Chú thích',
    colMeasureKey: 'Mã thông số',
    colMeasure: 'Thông số',
    colAvg1H: 'Trung bình 1 giờ',
    colAvg8H: 'Trung bình 8 giờ',
    colAvg1D: 'Trung bình 1 ngày',
    colUnit: 'Đơn vị'
  },
  wqi: {
    title: 'WQI'
  },
  wqiConfigCalculation: {
    pageName: 'Cấu hình tính toán WQI',
    tab1: 'Ngưỡng mức độ',
    tab2: 'Bảng giá trị BPi',
    tab3: 'Thông số tính toán',
    tab4: 'Trọng số nhóm thông số',
    add: 'Thêm',
    required1D_1H: 'Nhập ít nhất AVG Ngày hoặc AVG Giờ',
    required: 'Vui lòng nhập giá trị',
    collevel: 'Cấp độ',
    colValue: 'Giá trị',
    colOperate: 'Phép toán',
    colLevel: 'Tên mức độ',
    colMin: 'Cận dưới',
    colMax: 'Cận trên',
    colMin2: 'Tối thiểu',
    colMax2: 'Tối đa',
    colColor: 'Màu chữ',
    colBackgroundColor: 'Màu nền',
    colDescription: 'Chú thích',
    colMeasureKey: 'Mã thông số',
    colMeasure: 'Tên Thông số',
    colAvg1H: 'Trung bình 1 giờ',
    colAvg8H: 'Trung bình 8 giờ',
    colAvg1D: 'Trung bình 1 ngày',
    colUnit: 'Đơn vị',
    colBatBuoc: 'Bắt buộc',
    colBelongTemp: 'Phụ thuộc nhiệt độ',
    colGroupParam: 'Nhóm thông số',
    valWeightParam: 'Trọng số',
    colGroupI: 'Nhóm I',
    colGroupII: 'Nhóm II',
    colGroupIII: 'Nhóm III',
    colGroupIV: 'Nhóm IV',
    colGroupV: 'Nhóm V'
  },
  qaqc: {
    configPublish: {
      title: 'Cấu hình công bố',
      stationName: 'Tên trạm',
      publish: 'Công bố',
      measurePublish: 'Cho phép công bố thông số'
    },
    publish: 'Cho phép công bố',
    title: `QA/QC`,
    removeData: 'Dữ liệu đã loại bỏ',
    approveData: 'Kiểm duyệt dữ liệu',
    config: 'Cấu hình',
    removeDataBy: 'Chỉ kiểm duyệt dữ liệu khác điều kiện sau:',
    approveAll: 'Kiểm duyệt tất cả',
    manualApprove: 'Kiểm duyệt tùy chọn',
    dataFilter: {
      label: 'Lọc dữ liệu theo',
      outOfRange: 'Ngoài dải đo',
      deviceError: 'Thiết bị lỗi',
      deviceCalibration: 'Thiết bị hiệu chuẩn',
      zero: 'Giá trị 0',
      negative: 'Giá trị Âm'
    },
    data: 'Loại dữ liệu',
    approve: 'Kiểm duyệt',
    cancel: 'Hủy bỏ',
    remove: 'Loại bỏ dữ liệu',
    restore: 'Khôi phục',
    allCancel: 'Hủy bỏ tất cả',
    unApprove: 'Hủy kiểm duyệt',
    yetApprove: 'Chưa kiểm duyệt',
    originalData: 'Dữ liệu gốc',
    validData: 'Dữ liệu hợp lệ',
    inValidData: 'Dữ liệu không hợp lệ',
    ok: 'Đồng ý',
    province: {
      label: 'Đơn vị quản lý',
      placeholder: 'Đơn vị quản lý'
    },
    notEmpty: '{{=it.value}} không để trống!',
    pageInfo: '{{=it.from}}-{{=it.to}} của {{it.total}}',
    msg: {
      confirmUnApprove: 'Bạn có muốn huỷ phê duyệt đã chọn?',
      success: 'Lưu thành công',
      failure: 'Lưu thất bại'
    },
    date: {
      from: 'Từ ngày',
      to: 'Đến ngày'
    },
    outOfRange: 'Ngoài vùng đo'
  },
  qaqcConfig: {
    title: 'Cấu hình QAQC',
    beyondMeasuringRange: 'Ngoài dải đo',
    deviceError: 'Thiết bị lỗi',
    deviceCalibration: 'Thiết bị hiệu chuẩn',
    zero: 'Giá trị 0',
    negative: 'Giá trị Âm'
  },
  controlStation: {
    text: 'Điều khiển lấy mẫu',
    breadcrumb: {
      trigger: 'Lấy mẫu',
      history: 'Lịch sử lấy mẫu',
      config: 'Cấu hình'
    },
    trigger: {
      triggerSuccess: 'Kích hoạt thành công',
      triggerCancel: 'Huỷ lấy mẫu thành công',
      triggerExceeded: 'Kích hoạt lấy mẫu vượt'
    },
    config: {
      reset: 'Đặt lại thành công',
      success: 'Cấu hình thành công'
    },
    bottle: 'Chai số',
    handMade: 'Thủ công',
    automatic: 'Tự động',
    total: 'Tổng số chai',
    totalHaveTaken: 'Số chai đã lấy',
    amountToGet: 'Số chai cần lấy',
    timer: 'Hẹn giờ',
    date: 'Ngày',
    typeControl: 'Loại điều khiển',
    orderByBottle: 'Sắp xếp theo chai',
    dateTime: 'Ngày giờ',
    content: 'Nội dung',
    email: 'Email',
    tagName: 'Tên thẻ',
    configTotal: 'Cấu hình tổng số chai',
    cycleSampling: 'Chu kỳ lấy mẫu',
    buttonTrigger: 'Kích hoạt',
    cancelTrigger: 'Huỷ kích hoạt',
    triggerExceeded: 'Kích hoạt lấy mẫu khi vượt ngưỡng',
    cancelTriggerExceeded: 'Huỷ kích hoạt thành công',
    statusSampling: 'Đang lấy mẫu ...',
    viewMore: 'Xem thêm'
  },
  map: {
    mapOverview: 'Tổng quan bản đồ',
    AQI: 'Chất lượng không khí',
    WQI: 'Chất lượng nước',
    menuRight: {
      good: 'Tốt',
      dataLoss: 'Mất kết nối',
      notUse: 'Chưa sử dụng',
      connected: 'Đã kết nối',
      exceeded: 'Vượt QCVN',
      exceededPreparing: 'Chuẩn bị vượt',
      exceededTendency: 'Có xu hướng vượt',
      notify: 'Thông báo',
      noData: 'Không có dữ liệu',
      dataStatus: 'Trạng thái dữ liệu',
      stationStatus: 'Trạng thái trạm'
    },
    menuLeft: {
      stationSearch: 'Tìm kiếm trạm'
    },
    dataTable: {
      measuring: 'Thông số',
      value: 'Giá trị',
      unit: 'Đơn vị',
      statusSensor: 'Trạng thái thiết bị',
      dataLossAt: 'Mất kết nối lúc:',
      dataReceived: 'Dữ liệu lúc:',
      longitude: 'Kinh độ',
      latitude: 'Vĩ độ',
      address: 'Địa chỉ',
      viewMore: {
        sampling: 'Lấy mẫu',
        camera: 'Camera',
        viewData: 'Hiển thị dữ liệu',
        detail: 'Chi tiết'
      }
    },
    marker: {
      transmitting: 'Đang truyền',
      dataLoss: 'Mất kết nối',
      notUse: 'Chưa kết nối',
      info: 'Thông tin',
      image: 'Hình ảnh',
      time: 'Thời gian',
      status: 'Trạng thái',
      result: 'Kết quả'
    }
  },
  dataSearchFixed: {
    downloadTemplate: 'Tải file mẫu',
    importData: 'Nhập dữ liệu từ file',
    importSuccess: 'Nhập dũ liệu thành công!',
    importFailed: 'Nhập dữ liệu không thành công!'
  },
  dataSearchFrom: {
    titleText: 'Tra cứu dữ liệu gốc',
    options: {
      byHours: '{{=it.value}} Giờ',
      byDay: '{{=it.value}} Ngày',
      range: 'Trong khoảng'
    },
    form: {
      all: 'Tất cả',
      time: 'Thời gian',
      stationType: {
        label: 'Loại trạm',
        placeholder: 'Chọn loại trạm',
        require: 'Vui lòng chọn loại trạm'
      },
      stationAuto: {
        label: 'Tên trạm',
        placeholder: 'Chọn tên trạm'
      },
      fromDate: {
        label: 'Bắt đầu',
        placeholder: 'Chọn ngày bắt đầu'
      },
      toDate: {
        label: 'Kết thúc',
        placeholder: 'Chọn ngày kết thúc'
      },
      measuringList: {
        label: 'Thông số',
        placeholder: 'Chọn thông số',
        require: 'Chọn ít nhất 1 thông số'
      },
      isExceeded: {
        label: 'Vượt QCVN'
      },
      operator: {
        label: 'Phép toán'
      },
      value: {
        label: 'Giá trị'
      },
      type: {
        label: 'Loại báo cáo'
      },
      advanced: {
        label: 'Nâng cao',
        reset: 'Đặt lại'
      }
    },
    table: {
      emptyText: 'Không có dữ liệu',
      receivedAt: 'Thời gian Truyền File',
      time: 'Thời gian',
      all: 'Tất cả',
      numericalOrder: 'TT'
    },
    tab: {
      data: 'Dữ liệu',
      chart: 'Biểu đồ',
      exportExcel: 'Xuất dữ liệu excel',
      statusExport: 'Đang xuất dữ liệu...',
      dataProcess: 'Tính lại kết quả'
    },
    analyze: {
      max: 'Giá trị tối đa',
      maxTime: 'Thời gian vượt tối đa',
      min: 'Giá trị tối thiểu',
      minTime: 'Thời gian giảm tối thiểu',
      avg: 'Giá trị trung bình',
      parameters: 'Thông số'
    }
  },
  aqiSearchForm: {
    form: {
      inRange: {
        label: 'Khoảng thời gian',
        error: 'Vui lòng chọn khoảng thời gian'
      },
      from: {
        label: 'Khung giờ từ',
        error: 'Vui lòng chọn khung giờ'
      },
      to: {
        label: 'Đến'
      }
    }
  },

  avgSearchFrom: {
    titleText: 'Tra cứu dữ liệu tổng hợp',
    form: {
      time: 'Thời gian',
      stationType: {
        label: 'Loại trạm',
        placeholder: 'Chọn loại trạm',
        error: 'Vui lòng chọn loại trạm'
      },
      rangesDate: {
        error: 'Vui lòng chọn thời gian'
      },
      stationAuto: {
        label: 'Tên trạm',
        placeholder: 'Chọn tên trạm',
        error: 'Vui lòng chọn tên trạm'
      },
      fromDate: {
        label: 'Bắt đầu',
        placeholder: 'Chọn ngày bắt đầu'
      },
      toDate: {
        label: 'Kết thúc',
        placeholder: 'Chọn ngày kết thúc'
      },
      fromMonth: {
        label: 'Từ tháng/năm',
        placeholder: 'Chọn Tháng/Năm',
        error: 'Vui lòng chọn thời gian'
      },
      toMonth: {
        label: 'Đến  tháng/năm',
        placeholder: 'Chọn Tháng/Năm',
        error: 'Vui lòng chọn thời gian',
        error1: 'Ngày bắt đầu lớn hơn ngày kết thúc',
        error2: 'Không được vượt quá tháng hiện tại'
      },
      measuringList: {
        label: 'Thông số',
        placeholder: 'Chọn thông số',
        require: 'Chọn ít nhất 1 thông số'
      },
      isExceeded: {
        label: 'Dữ liệu vượt QCVN'
      },
      operator: {
        label: 'Phép toán'
      },
      value: {
        label: 'Giá trị'
      },
      type: {
        label: 'Dữ liệu trung bình',
        error: 'Vui lòng chọn dữ liệu trung bình'
      },
      advanced: {
        label: 'Nâng cao'
      }
    },
    table: {
      receivedAt: 'Thời gian',
      all: 'Tất cả',
      emptyText: 'Không có giá trị',
      header1: 'Tên trạm',
      header2: 'Tần suất truyền dữ liệu (phút/lần)',
      header3: 'Tổng số bản ghi theo thiết kế',
      header4: 'Tổng số bản ghi thực tế',
      header5: 'Tỷ lệ nhận dữ liệu (%)',
      header6: 'Ngày bắt đầu truyền dữ liệu',
      header7: 'Ngày/tháng',
      header8: 'Giờ',
      header9: 'Tỉ lệ số liệu vượt ngưỡng (%)',
      title: 'BÁO CÁO TỈ LỆ SỐ LIỆU THU ĐƯỢC',
      description:
        'Các số liệu thống kê về tỉ lệ số liệu thu được của các trạm quan trắc từ tháng {{=it.fromMonth}} đến tháng {{=it.toMonth}}',
      title2: 'BÁO CÁO KẾT QUẢ QUAN TRẮC TRUNG BÌNH 24 GIỜ',
      description2:
        'Các số liệu thống kê về kết quả quan trắc trung bình 24 giờ của trạm {{=it.stationName}} trong tháng {{=it.monthYear}}',
      title3: 'BÁO CÁO KẾT QUẢ QUAN TRẮC TRUNG BÌNH 1 GIỜ',
      description3:
        'Các số liệu thống kê về kết quả quan trắc trung bình 1 giờ của trạm {{=it.stationName}}  trong ngày {{=it.monthYear}}',
      title4: 'BÁO CÁO TỈ LỆ VƯỢT NGƯỠNG',
      description4:
        'Các số liệu thống kê về tỉ lệ dữ liệu vượt ngưỡng của trạm {{=it.fromMonth}}  trong ngày {{=it.toMonth}}',
      title5: 'BÁO CÁO KẾT QUẢ QUAN TRẮC TRUNG BÌNH 8 GIỜ',
      description5:
        'Các số liệu thống kê về kết quả quan trắc trung bình 8 giờ của trạm {{=it.stationName}}  trong ngày {{=it.monthYear}}'
    },
    selectTimeRange: {
      minute: 'Phút',
      hour: 'Giờ',
      day: 'Ngày',
      month: 'Tháng',
      year: 'Năm',
      errorMonth: 'Vui lòng chọn tháng',
      errorDay: 'Vui lòng chọn ngày',
      error: 'Vui lòng chọn thời gian'
    },
    tab: {
      data: 'Dữ liệu',
      chart: 'Biểu đồ',
      exportExcel: 'Xuất dữ liệu excel',
      statusExport: 'Đang xuất dữ liệu ...'
    }
  },
  measuringManager: {
    list: {
      title: 'Thông số'
    },
    create: {
      success: 'Thêm thông số thành công',
      keyExisted: 'Thông số đã tồn tại'
    },
    edit: {
      label: 'Sửa',
      success: 'Cập nhật thông số thành công'
    },
    delete: {
      label: 'Xoá'
    },
    form: {
      key: {
        label: 'Mã thông số',
        placeholder: 'Nhập mã thông số',
        error: 'Vui lòng nhập mã thông số'
      },
      name: {
        label: 'Tên thông số',
        placeholder: 'Nhập tên thông số',
        error: 'Vui lòng nhập tên thông số'
      },
      unit: {
        label: 'Đơn vị',
        placeholder: 'Nhập đơn vị'
      },
      numericalOrder: {
        label: 'Số thứ tự',
        placeholder: 'Nhập số thứ tự',
        error: 'Vui lòng nhập số thứ tự'
      },
      action: {
        label: ' '
      },
      error: 'Lỗi'
    }
  },
  stationTypeManager: {
    list: {
      title: 'Loại trạm'
    },
    create: {
      label: 'Tạo mới',
      success: 'Thêm loại trạm mới thành công',
      keyExisted: 'Loại trạm đã tồn tại'
    },
    edit: {
      label: 'Sửa',
      success: 'Cập nhật loại trạm thành công'
    },
    delete: {
      label: 'Xoá'
    },
    form: {
      key: {
        label: 'Mã trạm',
        placeholder: 'Nhập mã trạm',
        error: 'Vui lòng nhập mã trạm',
        existError: 'Mã trạm đã tồn tại'
      },
      name: {
        label: 'Tên',
        placeholder: 'Nhập tên trạm',
        error: 'Vui lòng nhập tên trạm'
      },
      icon: {
        label: 'Biểu tượng',
        placeholder: 'Chọn biểu tượng'
      },
      auto: {
        label: 'Tự động'
      },
      action: {
        label: ' '
      },
      error: 'Lỗi',
      errorStationExist: 'Không thể xóa vì có trạm sử dụng loại trạm này',
      color: {
        label: 'Màu sắc',
        placeholder: 'Chọn màu'
      },
      numericalOrder: {
        label: 'Số thứ tự',
        placeholder: 'Nhập số thứ tự',
        error: 'Vui lòng nhập số thứ tự'
      }
    }
  },
  qcvn: {
    list: {
      title: 'QCVN'
    },
    create: {
      label: 'Thêm',
      success: 'Thêm QCVN thành công',
      keyExisted: 'QCVN đã tồn tại'
    },
    edit: {
      label: 'Sửa',
      success: 'Cập nhật QCVN thành công'
    },
    delete: {
      label: 'Xoá'
    },
    form: {
      key: {
        label: 'Mã QCVN',
        placeholder: 'Nhập QCVN',
        error: 'Vui lòng nhập mã QCVN',
        existError: 'Mã QCVN đã tồn tại'
      },
      name: {
        label: 'Tên QCVN',
        placeholder: 'Nhập tên QCVN',
        error: 'Vui lòng nhập tên QCVN'
      },
      unit: {
        label: 'Đơn vị',
        placeholder: 'Nhập đơn vị'
      },
      numericalOrder: {
        label: 'Số thứ tự',
        placeholder: 'Nhập số thứ tự',
        error: 'Vui lòng nhập số thứ tự'
      },
      action: {
        label: ' '
      },
      error: 'Lỗi'
    }
  },
  province: {
    list: {
      title: 'Đơn vị quản lý',
      key: 'Mã đơn vị',
      numericalOrder: 'Số thứ tự'
    },
    create: {
      label: 'Thêm',
      success: 'Thêm thành công',
      keyExisted: 'Đơn vị quản lý đã tồn tại'
    },
    edit: {
      label: 'Sửa',
      success: 'Cập nhật thành công'
    },
    delete: {
      label: 'Xóa',
      require: 'Bạn chắc chắn xoá dữ liệu?'
    },
    add: {
      label: 'Thêm'
    },
    form: {
      action: ' ',
      key: {
        label: 'Mã đơn vị',
        placeholder: 'Nhập mã đơn vị quản lý',
        error: 'Vui lòng nhập mã đơn vị quản lý',
        existError: 'Mã đơn vị đã tồn tại'
      },
      name: {
        label: 'Tên đơn vị quản lý',
        placeholder: 'Nhập tên đơn vị quản lý',
        error: 'Vui lòng nhập tên đơn vị quản lý'
      },
      numericalOrder: {
        label: 'Số thứ tự',
        placeholder: 'Nhập số thứ tự',
        error: 'Vui lòng nhập số thứ tự'
      }
    }
  },
  configWQI: {
    breadCrumb: 'Cấu hình tính WQI, AQI',
    stationAuto: 'Trạm tự động',
    stationFixed: 'Trạm cố định',
    stationName: 'Tên trạm',
    allow: 'Cho phép tính',
    stationType: 'Loại trạm',
    success: 'Cập nhật thành công !',
    error: 'Cập nhật thất bại..!',
    unckecked: 'Bỏ chọn'
  },
  ftpTranfer: {
    allowFtpTranfer: 'Cho phép truyền',
    stationName: 'Tên trạm',
    measureTranfer: 'Thông số được truyền',
    ftpInfo: 'Thông tin FTP',
    ftpConfig: 'Thông tin FTP',
    tranferBonus: 'Truyền bổ sung',
    breadCrumb: 'Cấu hình truyền file TXT về Bộ TNMT',
    configTranferFTP: 'Danh sách trạm',
    confirmTitle: 'Bạn muốn xóa cấu hình này',
    tranfer: 'Truyền',
    success: 'Cập nhật thành công',
    error: 'Thât bại..!',
    save: 'Lưu lại',
    add: 'Thêm',
    edit: 'Sửa',
    delete: 'Xóa',
    cancel: 'Đóng',
    timeStart: 'Thời gian truyền',
    formInFoFTP: {
      ipAddress: {
        title: 'Địa chỉ IP',
        addonBefore: 'ftp://',
        message: 'Bạn chưa nhập địa chỉ IP'
      },
      port: {
        title: 'VD: 21',
        addonBefore: 'Cổng(Port):',
        message: 'Bạn chưa điền cổng(port)'
      },
      user: {
        title: 'Tên đăng nhập',
        addonBefore: 'Tên đăng nhập: ',
        message: 'Bạn chưa điền tên đăng nhập'
      },
      pass: {
        title: 'Mật khẩu',
        addonBefore: 'Mật khẩu:',
        message: 'Bạn chưa điền mật khẩu'
      },
      fileName: {
        name: 'Tên file FTP',
        title: 'Tên file truyền về Bộ',
        addonBefore: 'Tên file:',
        message: 'Bạn chưa nhập tên file'
      }
    },
    summary: 'Thống Kê',
    history: 'Lịch sử truyền',
    status: {
      title: 'Trạng thái truyền',
      success: 'Truyền file thành công',
      failed: 'Truyền file thất bại',
      success2: 'Đặt lệnh truyền thành công',
      failed2: 'Không đặt lệnh truyền đối với các file trước thời gian truyền'
    },
    tryUploadFile: 'Truyền lại file'
  },
  page: {
    config: {
      color: {
        button: {
          selectTabData: 'Tình trạng dữ liệu',
          selectTabSensor: 'Tình trạng thiết bị'
        },
        table: {
          column: {
            type: 'Loại',
            alternative: 'Tên thay thế',
            color: 'Màu chữ',
            backgroundColor: 'Màu nền',
            desc: 'Chú thích'
          }
        }
      }
    }
  },
  stationFixedManager: {
    list: {
      title: 'Trạm quan trắc cố định'
    }
  },
  stationAutoManager: {
    list: {
      title: 'Trạm quan trắc',
      ftpInfo: 'Thông tin FTP',
      ftpFile: 'Tập tin FTP',
      restore: 'Khôi phục',
      remove: 'Loại bỏ',
      action: ' ',
      createdAt: 'Tạo lúc'
    },
    create: {
      label: 'Tạo mới',
      success: 'Thêm trạm thành công',
      keyExisted: 'Tên trạm đã tồn tại'
    },
    edit: {
      label: 'Sửa',
      success: 'Cập nhật trạm thành công'
    },
    delete: {
      label: 'Xoá',
      require: 'Bạn chắc chắn xoá dữ liệu?'
    },
    add: {
      label: 'Thêm'
    },
    addMeasuring: {
      label: 'Thêm thông số',
      error: 'Tối thiểu phải có 1 thông số'
    },
    form: {
      panel1: 'Thông tin trạm',
      panel2: 'Thông tin khác',
      website: {
        label: 'Website',
        placeholder: 'Website'
      },
      capacity: {
        label: 'Công suất thiết kế',
        placeholder: 'Công suất thiết kế'
      },
      career: {
        label: 'Ngành nghề',
        placeholder: 'Ngành nghề'
      },
      material: {
        label: 'Nguyên liệu chính',
        placeholder: 'Nguyên liệu chính'
      },
      userResponsible: {
        label: 'Người vận hành',
        placeholder: 'Người vận hành'
      },
      phoneResponsible: {
        label: 'Số điện thoại',
        placeholder: 'Nhập số điện thoại người chịu trách nhiệm'
      },
      processProdution: {
        label: 'Quy trình sản xuất',
        placeholder: 'Quy trình sản xuất'
      },
      yearOperate: {
        label: 'Năm hoạt động',
        placeholder: 'Năm hoạt động'
      },
      userSupervisor: {
        label: 'Người quản lý',
        placeholder: 'Người quản lý'
      },
      phoneSupervisor: {
        label: 'Số điện thoại',
        placeholder: 'Nhập số điện thoại người quản lý'
      },
      key: {
        label: 'Mã trạm',
        placeholder: 'Nhập mã trạm',
        error: 'Vui lòng nhập mã trạm'
      },
      name: {
        label: 'Tên trạm',
        placeholder: 'Nhập tên trạm',
        error: 'Vui lòng nhập tên trạm'
      },
      stationType: {
        label: 'Loại trạm',
        placeholder: 'Nhập loại trạm',
        error: 'Vui lòng nhập loại trạm'
      },
      address: {
        label: 'Địa chỉ',
        placeholder: 'Nhập địa chỉ'
      },
      qcvn: {
        label: 'QCVN',
        placeholder: 'QCVN',
        error: 'Vui lòng chọn QCVN'
      },
      province: {
        label: 'Đơn vị quản lý',
        placeholder: 'Đơn vị quản lý',
        error: 'Vui lòng chọn đơn vị quản lý'
      },
      frequency: {
        label: 'Tần suất(phút/lần)',
        placeholder: 'phút/lần',
        error: 'Vui lòng chọn tần suất'
      },
      typeSampling: {
        label: 'Hình thức lấy mẫu',
        placeholder: 'Chọn hình thức'
      },
      dayOfOperation: {
        label: 'Ngày hoạt động',
        placeholder: 'Ngày hoạt động',
        error: 'Vui lòng chọn ngày hoạt động'
      },
      isStopWorking: {
        label: 'Ngừng hoạt động',
        placeholder: 'Ngừng hoạt động'
      },
      note: {
        label: 'Ghi chú',
        placeholder: 'Ghi chú',
        error: 'Vui lòng điền ghi chú'
      },
      long: {
        label: 'Kinh độ',
        placeholder: 'Nhập kinh độ',
        error: 'Vui lòng nhập kinh độ'
      },
      lat: {
        label: 'Vĩ độ',
        placeholder: 'Nhập vĩ độ',
        error: 'Vui lòng nhập vĩ độ'
      },
      emails: {
        label: 'Địa chỉ Email',
        placeholder: 'Nhập địa chỉ Email',
        error: 'Vui lòng nhập địa chỉ Email',
        description:
          'Chú ý: Khi dữ liệu gặp sự cố. Hệ thống sẽ gửi thông tin sự cố thông qua email này.'
      },
      image: {
        label: 'Hình ảnh trạm'
      },
      phones: {
        label: 'Số điện thoại',
        placeholder: 'Nhập số điện thoại',
        error: 'Vui lòng nhập số điện thoại'
      },
      range: {
        label: 'Giới hạn đo'
      },
      measuringKey: {
        label: 'Mã thông số',
        placeholder: 'Nhập mã thông số',
        error: 'Vui lòng nhập mã thông số'
      },
      measuringName: {
        label: 'Tên thông số',
        placeholder: 'Tên thông số',
        error: 'Vui lòng nhập tên thông số'
      },
      measuringUnit: {
        label: 'Đơn vị',
        placeholder: 'Nhập đơn vị của thông số',
        error: 'Vui lòng nhập đơn vị của thông số'
      },
      measuringMinLimit: {
        label: 'Giới hạn tối thiểu',
        placeholder: 'Nhập giới hạn tối thiểu',
        error: 'Vui lòng nhập giới hạn tối thiểu'
      },
      measuringMaxLimit: {
        label: 'Giới hạn tối đa',
        placeholder: 'Nhập giới hạn tôí đa',
        error: 'Vui lòng nhập giới hạn tối đa'
      },
      measuringMinRange: {
        label: 'Giới hạn tối thiểu',
        placeholder: 'Nhập giới hạn đo tối thiểu',
        error: 'Vui lòng nhập giới hạn đo tối thiểu'
      },
      measuringMaxRange: {
        label: 'Giới hạn tối đa',
        placeholder: 'Input Max Range',
        error: 'Vui lòng nhập giới hạn đo tối đa'
      },
      options: {
        isAllowWarning: 'Cảnh báo',
        isAllowRemote: 'Điều khiển từ xa'
      },
      mapLocation: {
        label: 'Vị trí trên bản đồ',
        placeholder: 'Vị trí trên bản đồ'
      },
      error: 'Lỗi',
      require: 'Vui lòng nhập giá trị',
      order: {
        label: 'Order',
        placeholder: 'Order'
      }
    },
    range: {
      label: 'Dải đo',
      min: 'Dải đo nhỏ nhất',
      max: 'Dải đo lớn nhất'
    },
    config: {
      label: 'Cấu hình',
      extensionFile: 'Loại tập tin',
      fileName: {
        label: 'Tên tập tin',
        placeholder: 'Nhập tên tập tin'
      },
      path: {
        label: 'Đường dẫn tập tin',
        placeholder: 'Nhập đường dẫn tập tin'
      },
      measuringSrc: {
        label: 'Thông số trong file .txt',
        placeholder: 'Thông số trong file .txt',
        error: 'Vui lòng nhập thông số trong file .txt'
      },
      measuringDes: {
        label: 'Thông số trong CSDL',
        placeholder: 'Thông số trong CSDL',
        error: 'Vui lòng nhập thông số trong CSDL'
      },
      ratio: {
        label: 'Tỉ lệ',
        placeholder: 'Nhập tỉ lệ',
        error: 'Vui lòng nhập tỉ lệ'
      },
      message: {
        success: 'Cấu hình trạm thành công!',
        error: 'Cấu hình trạm thất bại!'
      },
      buttonLoadSourceParameter: 'Lấy danh sách thông số',
      errorLoadFile: 'Tải tệp từ đường đường dẫn không thành công'
    },
    options: {
      calibration: {
        title: 'Hiệu chuẩn thiết bị'
      },
      allowSendWarning: {
        label: 'Gửi cảnh báo',
        placeholder: 'Gửi cảnh báo'
      },
      allowApprove: {
        label: 'Cho phép cấu hình loại bỏ dữ liệu tự động',
        note:
          ' *Ghi chú: Khi cấu hình cho phép kiểm duyệt tự động với các điều kiện trên, hệ thống sẽ tự động kiểm duyệt và loại bỏ các dữ liệu không đủ điều kiện.',
        parameters: 'Tên thông số',
        rules: 'Loại bỏ dữ liệu theo các điều kiện',
        zero: 'Bằng 0',
        negative: 'Số âm',
        outOfRange: 'Ngoài khoảng đo của thiết bị',
        deviceStatus: 'Trạng thái thiết bị (hỏng hoặc bảo trì)',
        error: 'Vui lòng nhập khoảng đo'
      },
      outOfRangeConfig: {
        title: 'Thời gian hiệu chuẩn',
        minRange: 'Min',
        maxRange: 'Max',
        note: '* Lưu ý',
        warning: 'Bạn chưa chọn khoảng thời gian',
        to: 'Đến',
        from: 'Từ',
        timeConfig: 'Chọn khung T/Gian',
        placeholderTimeFrom: 'Từ (giờ)',
        placeholderTimeTo: 'Đến (giờ)',
        btnCancel: 'Hủy',
        btnSave: 'Lưu lại',
        selectTile: 'Lặp lại',
        placeholderSelect: 'Tùy chọn',
        daily: 'Hàng ngày',
        monday: 'Mọi thứ 2',
        tuesday: 'Mọi thứ 3',
        wednesday: 'Mọi thứ 4',
        thursday: 'Mọi thứ 5',
        friday: 'Mọi thứ 6',
        saturday: 'Mọi thứ 7',
        sunday: 'Mọi chủ nhật'
      },
      allowSampling: {
        label: 'Lấy mẫu',
        placeholder: 'Lấy mẫu'
      },
      apiAddress: {
        label: 'Địa chỉ API',
        placeholder: 'Địa chỉ API'
      },
      allowCamera: {
        label: 'Xem camera',
        placeholder: 'Xem camera',
        add: 'Thêm'
      },
      name: {
        label: 'Tên',
        placeholder: 'Tên'
      },
      RTSP: {
        label: 'Địa chỉ RTSP',
        placeholder: 'Địa chỉ RTSP',
        error: 'Vui lòng nhập địa chỉ RTSP'
      }
    },
    header: {
      option: 'Tuỳ chọn',
      dataLogger: 'DataLogger',
      approve: 'Kiểm duyệt dữ liệu'
    },
    upload: {
      label: 'Tải lên',
      error: 'Tải ảnh thất bại'
    },
    uploadFile: {
      label: 'Tải tệp lên',
      error: 'Tải tệp lên thất bại',
      success: 'Tải tên lên thành công',
      status: {
        uploading: 'Đang tải lên ...',
        finish: 'Hoàn thành'
      }
    },
    ftpFile: {
      auto: 'Tự động',
      choosePath: 'Chọn đường dẫn',
      titleConfigFTP: 'Cấu hình thông tin FTP',
      folderName: 'Tên',
      updateAt: 'Thời gian',
      fileName: 'Tên tập tin',
      kind: 'Loại',
      modifiedDate: 'Sửa ngày',
      size: 'Kích thước',
      NOT_EXIST_FTP:
        'Trạm này không có thư mục FTP hoặc thư mục FTP đã thay đổi',
      buttonCreateFTP: 'Tạo thư mục FTP',
      createFTPSuccess: 'Tạo thư mục FTP thành công',
      updateFTPSuccess: 'Cập nhật thành công',
      headerName: 'Thông tin FTP: ',
      addressLabel: 'Địa chỉ ftp:',
      usernameLabel: 'Tên đăng nhập:',
      passwordLabel: 'Mật khẩu:'
    },
    infoStation: {
      title: 'Thông tin trạm',
      edit: 'Chỉnh sửa',
      career: 'Ngành nghề',
      emptyText: 'Không có dữ liệu',
      yearOperate: 'Năm bắt đầu hoạt động',
      capacity: 'Công xuất thiết kế',
      processProdution: 'Quy trình sản xuất',
      userResponsible: 'Người chịu trách nhiệm',
      userSupervisor: 'NGười dám sát',
      website: 'Website'
    }
  },
  parameterManager: {
    breadcrumb: {
      base: 'Thông số',
      create: 'Tạo mới',
      edit: 'Chỉnh sửa'
    }
  },
  cameraManager: {
    breadcrumb: {
      camera: 'Camera'
    }
  },
  userManager: {
    breadcrumb: {
      list: 'Danh sách người dùng',
      rule: 'Ủy quyền',
      create: 'Tạo mới',
      edit: 'Chỉnh sửa'
    },
    form: {
      placeholder: {
        selectUser: 'Chọn user',
        selectRoleGroup: 'Chọn nhóm quyền'
      },
      email: {
        label: 'Địa chỉ Email',
        placeholder: 'Địa chỉ Email',
        error: 'Địa chỉ Email không hợp lệ',
        errorExist: 'Địa chỉ email này đã tồn tại'
      },
      password: {
        label: 'Mật khẩu',
        placeholder: 'Mật khẩu'
      },
      confirmPassword: {
        label: 'Nhập lại mật khẩu',
        placeholder: 'Nhập lại mật khẩu',
        message: 'Vui lòng nhập lại mật khẩu!'
      },
      firstName: {
        label: 'Tên',
        placeholder: 'Tên'
      },
      lastName: {
        label: 'Họ & Tên đệm',
        placeholder: 'Họ & Tên đệm'
      },
      country: {
        label: 'Quốc gia',
        placeholder: 'Chọn quốc gia'
      },
      organization: {
        label: 'Tổ chức',
        placeholder: 'Chọn tổ chức'
      },
      phone: {
        label: 'Số điện thoại',
        placeholder: 'Số điện thoại'
      },
      isAdmin: {
        label: 'Quản trị hệ thống'
      }
    },
    modal: {
      title: 'Gói đăng ký giới hạn',
      back: 'Quay lại',
      text: `<div>Số lượng "Thành viên" của bạn là <strong> {{=it.total}} </strong>, bạn không thể thêm thành viên mới. Vui lòng liên hệ hoặc nâng cấp gói dịch vụ</div>`,
      text1: 'Tăng số lượng thành viên hãy liên hệ',
      text2: 'Số điện thoại',
      text3: 'Email'
    },
    list: {
      enableAccount: 'Kích hoạt tài khoản',
      disableAccount: 'Vô hiệu hoá tài khoản',
      warning: 'Bạn không thể vô hiệu hóa tài khoản của chính mình',
      confirmEnableAccount: 'Bạn có muốn {0} tài khoản này không?',
      enable: 'Kích hoạt',
      disable: 'Vô hiệu',
      deactivate: 'Hủy kích hoạt',
      action: ' ',
      email: 'Email',
      country: 'Quốc gia',
      login: 'Đăng nhập',
      status: 'Trạng thái',
      roleAssign: 'Uỷ quyền',
      roleName: 'Nhóm quyền',
      createdAt: 'Tạo lúc',
      setPassword: 'Cập nhật mật khẩu',
      setPasswordSuccess: 'Cập nhật mật khẩu thành công',
      setPasswordFailure: 'Cập nhật mật khẩu thất bại'
    },
    roleAssign: {
      role: 'Nhóm quyền',
      name: 'Tên nhóm quyền',
      nameStation: 'Danh sách trạm quản lý',
      success: 'Cập nhật qui định thành công',
      error: 'Cập nhật qui định thất bại',
      address: 'Địa chỉ',
      isAdmin: 'Quản trị hệ thống'
    }
  },
  roleManager: {
    breadcrumb: {
      list: 'Nhóm quyền',
      create: 'Tạo mới',
      edit: 'Chỉnh sửa'
    },
    tableHeader: {
      menu: 'Danh sách module',
      action: 'Chức năng',
      stt: 'STT'
    },
    form: {
      name: {
        label: 'Tên nhóm',
        placeholder: 'Nhập tên nhóm',
        error: 'Vui lòng nhập tên nhóm',
        errorExist: 'Nhóm quyền đã tồn tại',
        limit: 'Tên nhóm phải lớn hơn 5 ký tự'
      },
      description: {
        label: 'Mô tả',
        placeholder: 'Nhập mô tả',
        error: 'Vui lòng nhập mô tả'
      }
    },
    rule: {
      label: 'Rule',
      orderby: {
        label: '#',
        placeholder: '#'
      },
      menu: {
        label: 'Danh dách',
        placeholder: 'Danh sách'
      },
      action: {
        label: 'Hành động',
        placeholder: 'Hành động',
        package: 'Package'
      },

      dashboard: {
        name: 'Trang chủ'
      },
      dashboard_2: {
        name: 'Trang chủ - giám sát'
      },
      monitoring: {
        name: 'Giám sát trực tuyến'
      },
      monitorByList: {
        name: 'Giám sát danh sách'
      },
      map: {
        name: 'Bản đồ'
      },
      camera: {
        name: 'Camera'
      },
      dataSearch: {
        name: 'Tra cứu dữ liệu'
      },
      avgSearch: {
        name: 'Dữ liệu trung bình'
      },
      xuLyDuLieu_config: {
        name: 'Xử lý dữ liệu - Cấu hình'
      },
      kiemDuyetDuLieu: {
        name: 'Kiểm duyệt dữ liệu'
      },
      qaqcConfig: {
        name: 'Cấu hình chia sẻ dữ liệu'
      },
      ftpTransfer: {
        name: 'Cấu hình truyền FTP'
      },
      tiLeDuLieuThuDuoc: {
        name: 'Tỉ lệ dữ liệu thu được'
      },
      tiLeDuLieu: {
        name: 'Tỉ lệ dữ liệu'
      },
      tb24H: {
        name: 'Trung bình 24 giờ'
      },
      tb1H: {
        name: 'Trung bình 1 giờ'
      },
      tb1HMax: {
        name: 'Trung bình 1h Max'
      },
      tb8HMax: {
        name: 'Trung bình 8h Max'
      },
      tileDuLieuVuotNguong: {
        name: 'Tỉ lệ dữ liệu vượt ngưỡng'
      },
      soLanMatKetNoi: {
        name: 'Số lần mất kết nối'
      },
      aqiGio: {
        name: 'AQI - giờ'
      },
      aqiNgay: {
        name: 'AQI - ngày'
      },
      wqiGio: {
        name: 'WQI - giờ'
      },
      tinhTrangDuLieu: {
        name: 'Tình trạng dữ liệu'
      },
      aqiMap: {
        name: 'Bản đồ AQI'
      },
      wqiMap: {
        name: 'Bản đồ WQI'
      },
      configWQI: { name: 'Cấu hình tính WQI, AQI' },
      stationFixMap: {
        name: 'Bản đồ trạm cố định'
      },
      stationFixData: {
        name: 'Dữ liệu trạm cố định'
      },
      stationFix: {
        name: 'Trạm cố định'
      },
      stationFixInput: {
        name: 'Nhập liệu trạm cố định'
      },
      stationAuto: { name: 'Trạm quan trắc' },
      cauHinhKetNoi: {
        name: 'Cấu hình kết nối'
      },
      cauHinhGuiCanhBao: {
        name: 'Cấu hình gửi cảnh báo'
      },
      cauHinhLayMau: {
        name: 'Cấu hình lấy mẫu'
      },
      cauHinhTinhToanAQI: {
        name: 'Cấu hình tính toán AQI'
      },
      cauHinhTinhToanWQI: {
        name: 'Cấu hình tính toán WQI'
      },
      cauHinhCamera: {
        name: 'Cấu hình Camera'
      },
      measuring: { name: 'Chỉ tiêu quan trắc' },
      stationType: { name: 'Loại trạm' },
      province: { name: 'Đơn vị quản lý' },
      qcvn: { name: 'Quy chuẩn' },
      role: { name: 'Nhóm quyền' },
      user: { name: 'Người dùng' },
      config_color_noti: {
        name: 'Cấu hình màu cảnh báo'
      },
      xem_Nhat_ky: {
        name: 'Xem nhật ký'
      },
      mobile_dashboard: {
        name: 'Trang chủ Mobile'
      },
      /////
      actions: {
        role: 'Ủy quyền',
        enableAccount: 'Kích hoạt/Vô hiệu hóa tài khoản',
        config: 'Cấu hình',
        download: 'Tải mẫu nhập liệu',
        import: 'Nhập liệu từ file',
        wqi_export: 'Xuất dữ liệu',
        pushDuLieu: 'Push dữ liệu',
        aqi_export: 'Xuất dữ liệu',
        isTransfer: 'Cập nhật trạm cho phép truyền',
        updateFTP: 'Cập nhật thông tin FTP',
        publicStation: 'Cập nhật trạm công bố',
        view: 'Xem',
        camera: 'Camera',
        control: 'Lấy mẫu',
        chart: 'Biểu đồ',
        map: 'Bản đồ',
        images: 'Hình ảnh',
        infoStation: 'Thông tin trạm',
        reviewStation: 'Đánh giá trạm',
        updateSelectStation: 'Cập nhật chọn trạm',
        create: 'Thêm mới',
        edit: 'Cập nhật',
        delete: 'Xóa',
        export: 'Xuất dữ liệu',
        manualapprove: 'Kiểm duyệt tùy chọn',
        unapprove: 'Hủy kiểm duyệt',
        approve: 'Kiểm duyệt',
        restore: 'Khôi phục',
        remove: 'Loại bỏ dữ liệu',
        statistics_device: 'Tổng kết thiết bị',
        statistics_exceeded_avgDay: 'Vượt TB ngày',
        vuotNguongTBNgay: 'Vượt ngưỡng TB ngày',
        bieuDoAQI: 'Biểu đồ AQI',
        bieuDoWQI: 'Biểu đồ WQI',
        bieuDoMatKetNoi: 'Số lần mất kết nối',
        bieuDoVuotNguong: 'Số lần vượt ngưỡng',
        thongKeLoaiTram: 'Thống kê loại trạm',
        fTPFloder: 'FTP Floder',
        fileMapping: 'File Mapping '
      }
    }
  },
  subscriptionStatus: {
    breadcrumb: {
      base: 'Trạng thái hệ thống'
    },
    Renew: 'Thay mới',
    renewAt: 'Thay mới lúc',
    currentSubscription: 'Tình trạng hiện tại',
    subscriptionHistory: 'Lịch sử đăng ký',
    expiredAt: 'Hết hạn lúc',
    totalUsers: 'Tổng số người dùng',
    totalStation: 'Tổng số trạm'
  },
  infoLicense: {
    breadCrumb: 'Thông tin gói',
    title1: 'Thời gian đăng ký',
    title2: 'Số lượng tối đa để sử dụng',
    title3: 'Hỗ trợ, gia hạn sử dụng',
    text1: 'Ngày tạo tổ chức',
    text2: 'Ngày hết hạn',
    text3: 'Bạn còn {{=it.total}} ngày để sử dụng sản phẩm',
    text4: 'Số lượng trạm sử dụng',
    text5: 'Số lượng tối đa',
    text6: 'Số điện thoại',
    text7: 'Email'
  },
  expLicenseInfo: {
    title: 'Chúng tôi rất xin lỗi',
    subtitle1: 'Tổ chức của bạn đã hết hạn ngày {{=it.totalDate}}.',
    subtitle2: 'Vui lòng gia hạn để tiếp tục sử dụng',
    text1: 'Số điện thoại',
    text2: 'Gia hạn sử dụng ngay',
    text3: 'Email'
  },
  profileUser: {
    title: 'người dùng',
    success: 'Thay đổi thông tin thành công',
    infoLicense: 'Thông tin gói',
    viewProfile: 'Thông tin cá nhân',
    configStation: 'Cấu hình nhận cảnh báo',
    security: 'Bảo mật',
    logOut: 'Đăng xuất',
    changePassword: 'Đổi mật khẩu',
    avatar: 'Ảnh đại diện',
    email: 'Email',
    LastName: 'Họ & Tên đệm',
    FirstName: 'Tên',
    Birthday: 'Ngày tháng năm sinh',
    Phone: 'Số điện thoại',
    upload: 'Tải ảnh lên',
    imageUpload: {
      success: 'Tải ảnh lên thành công',
      error: 'Tải ảnh lên thất bại'
    },
    user: 'Thông tin cá nhân',
    organization: 'Thông tin tổ chức'
  },
  configStation: {
    name: 'Tên trạm',
    breadCrumb: 'Cấu hình nhận cảnh báo',
    warningStatus: 'Nhận cảnh báo',
    showStation: 'Hiển thị trạm',
    numericalOrder: 'Số thứ tự',
    action: ' ',
    messageUpdate: {
      success: 'Cập nhật thành công!',
      error: 'cập nhật thất bại!'
    }
  },
  changePassword: {
    breadcrumb: {
      changePassword: 'Thay đổi mật khẩu',
      profileUser: 'Thông tin',
      security: 'Cài đặt bảo mật'
    },
    form: {
      oldPassword: {
        label: 'Mật khẩu hiện tại',
        error: 'Vui lòng nhập mật khẩu hiện tại'
      },
      newPassword: {
        label: 'Mật khẩu mới',
        error: 'Vui lòng nhập mật khẩu mới'
      },
      newPasswordConfirmation: {
        label: 'Xác nhập mật khẩu',
        error: 'Vui lòng nhập mật khẩu mới 1 lần nữa',
        error1: 'Mật khẩu không khớp'
      },
      Success: 'Đổi mật khẩu thành công',
      compare: 'Hai mật khẩu nhập không khớp',
      savePassword: 'Thay đổi mật khẩu'
    }
  },
  resetPassword: {
    key: 'Quên mật khẩu',
    key2: 'Nhập email đã đăng ký để đặt lại mật khẩu',
    key3: 'Đặt lại mật khẩu',
    key4: 'Gửi lại mã xác thực',
    key5: 'Xác nhận',
    key6: 'Gửi mã xác thực'
  },
  security: {
    label: 'Bảo mật 2 lớp',
    enable2FA: 'Kích hoạt bảo mật 2 lớp',
    disable2FA: 'Hủy kích hoạt bảo mật 2 lớp',
    confirmPasswordLabel: 'Xác thực trước khi tiếp tục:',
    confirmPasswordError: 'Mật khẩu không chính xác',
    enterPassword: 'Nhập mật khẩu',
    confirm: 'Xác nhận',
    note:
      'Nếu bạn bật tính năng Xác thực hai lớp. Hệ thống sẽ gửi mã xác thực đến địa chỉ email hoặc số điện thoại của bạn mỗi khi bạn đăng nhập.',
    success: 'Thành công',
    failure: 'Kích hoạt bảo mật 2 lớp thành công',
    message: {
      userUse: 'Bạn đang sử dụng tính năng bảo mật 2 lớp qua {{=it.type}}',
      code:
        'Mã xác thực đã được gửi tới: {{=it.phone}} (sẽ hết hạn sau {{=it.expired}})',
      info: `Lựa chọn phương thức xác thực khi đăng nhập:`
    },
    step1: 'Nhập code',
    step2: 'Chờ xác thực',
    step3: 'Xong',
    send: 'Gửi',
    use: {
      email: 'Sử dụng Email',
      sms: 'Sử dụng SMS'
    }
  },
  login: {
    title: 'Đăng nhập',
    twoFactorAlert:
      'Xác thực 2 lớp - Mã xác thực của bạn sẽ được gửi tới {{=it.email}}!',
    form: {
      email: {
        label: 'Địa chỉ Email',
        placeholder: 'user@example.com'
      },
      password: {
        label: 'Mật khẩu',
        placeholder: '********'
      },
      twoFactor: {
        label: 'Mã Xác Thực',
        placeholder: 'xxxx'
      },
      buttonLogin: 'Đăng nhập',
      buttonTwoFactor: 'Xác thực'
    },
    errors: {
      emailOrPasswordIncorrect: 'Emai hoặc mật khẩu không đúng',
      accountDisable: 'Tài khoản của bạn bị vô hiệu hoá',
      accountDelete: 'Tài khoản của bạn bị xóa',
      accountNotActivated: 'Tài khoản chưa được kích hoạt',
      codeNotEqual: 'Mã xác thực không chính xác',
      organizationNotExist: 'Tổ chức của bạn không tồn tại'
    }
  },
  warningLevels: {
    title: 'Mức cảnh báo',
    good: 'Tốt',
    exceedTendency: 'Có xu hướng vượt',
    exceedPreparing: 'Chuẩn bị vượt',
    exceed: 'Vượt nguỡng',
    lossData: 'Mất tín hiệu',
    sensorError: 'Lỗi thiết bị'
  },
  addon: {
    add: 'Thêm',
    create: 'Tạo mới',
    edit: 'Chỉnh sửa',
    delete: 'Xoá',
    save: 'Lưu',
    reset: 'Đặt lại',
    remove: 'Loại bỏ',
    restore: 'Khôi phục',
    sendRequest: 'Gửi yêu cầu',
    onSave: {
      add: {
        success: 'Thêm thành công',
        error: 'Thêm mới lỗi'
      },
      update: {
        success: 'Cập nhật thành công',
        error: 'Cập nhật thất bại'
      }
    },
    onDelete: {
      success: 'Xoá thành công',
      error: 'Xoá thất bại',
      warning: 'Bạn không thể xóa tài khoản của chính mình'
    },
    onRestore: {
      success: 'Khôi phục thành công',
      error: 'Khôi phục thất bại'
    },
    search: 'Tìm kiếm',
    searchSeclect: 'Chọn điều kiện',
    error: 'Đã xảy ra sự cố!!!',
    warning: 'Chú ý',
    refresh: 'Làm mới',
    cancel: 'Hủy',
    ok: 'Đồng ý'
  },
  success: {
    text: 'Thành công'
  },
  error: {
    text: 'Lỗi',
    warningText: 'Chú ý',
    require: 'Yêu cầu',
    email: 'Địa chỉ Email không hợp lệ',
    nullValue: 'Dữ liệu không hợp lệ',
    monitoring: {
      sampling: {
        resetTitle: 'Xác nhận',
        resetSubtitle: 'Bạn có muốn reset số chai đã lấy về 0?',
        updateScheduleTitle: 'Xác nhận',
        updateScheduleSubtitle:
          'Số chai muốn lấy không hợp lệ hoặc thời gian bắt đầu lấy nhỏ hơn 5 phút so với thời điểm hiện tại',
        takeSampling: `
        <div style="text-align: left">
          <p>Không kết nối được với thiết bị điều khiển, vui lòng kiểm tra các thông tin:</p>
            <p style="margin-left: 20px">1. Thông tin cấu hình với thiết bị điều khiển </p>
            <p style="margin-left: 20px">2. Tình trạng hoạt động của thiết bị điều khiển </p>
            <p style="margin-left: 20px">3. Tín hiệu mạng tới thiết bị điều khiển </p>
        </div>
        `
      }
    }
  },
  modal: {
    confirm: {
      title: 'Xác nhận',
      monitoring: {
        sampling: {
          cancelSchedule: 'Bạn có chắc muốn hủy lấy mẫu tự động?'
        }
      }
    }
  },
  alert: {
    error: {
      monitoring: {
        saveSampingConfig: 'Bạn vui lòng nhập đầy đủ thông tin trước khi Lưu'
      }
    }
  },
  form: {
    save: 'Lưu',
    update: 'Cập nhật'
  },
  menuApp: {
    dashboard: 'Trang Chủ',

    monitoringSub: 'Khai thác dữ liệu',
    monitoring: {
      base: 'Giám sát trực tuyến',
      map: 'Bản đồ',
      mapAQI: 'Bản đồ AQI',
      camera: 'Camera',
      historyData: 'Tra cứu dữ liệu',
      avgData: 'Dữ liệu trung bình',
      report: 'Báo cáo'
    },
    monitoringList: {
      base: 'Giám sát danh sách'
    },

    processDataSub: 'Xử lý dữ liệu',
    processData: {
      approveData: 'Kiểm duyệt dữ liệu',
      config: 'Cấu hình'
    },

    shareDataSub: 'Chia sẻ dữ liệu',
    shareData: {
      shareConfig: 'Cấu hình chia sẻ dữ liệu',
      ftpConfig: 'Cấu hình truyền FTP'
    },

    advanceSub: 'Nâng cao',
    advance: {
      aqiMap: 'Bản đồ AQI',
      aqiStatistic: 'Tra cứu dữ liệu AQI',
      wqiMap: 'Bản đồ WQI',
      wqiStatistic: 'Tra cứu dữ liệu WQI',
      config: 'Cấu hình AQI & WQI'
    },

    configSub: 'Cấu hình',
    config: {
      stationAuto: 'Trạm quan trắc',
      stationAutoConnection: 'Cấu hình kết nối',
      sendNotification: 'Cấu hình gửi cảnh báo',
      sampling: 'Cấu hình lấy mẫu',
      configAQI: 'Cấu hình tính toán AQI',
      configWQI: 'Cấu hình tính toán WQI',
      camera: 'Cấu hình camera',
      color: 'Cấu hình màu cảnh báo',
      parameter: 'Chỉ tiêu quan trắc',
      stationType: 'Loại trạm',
      site: 'Đơn vị quản lý',
      standard: 'Quy chuẩn',
      role: 'Nhóm quyền',
      user: 'Tài khoản',
      dataLogger: 'Xem nhật ký'
    },

    camera: 'Camera',
    map: 'Bản đồ',
    data: 'Khai thác dữ liệu',
    dataSearch: 'Dữ liệu gốc',
    dataSearchFixed: 'Dữ liệu trạm cố định',
    avgData: 'Dữ liệu tổng hợp',
    manage: 'Quản lý',
    measuring: 'Thông số',
    stationType: 'Loại trạm',
    stationAuto: 'Trạm quan trắc',
    stationFixed: 'Trạm cố định',
    adminManagement: 'Quản trị',
    user: 'Người dùng',
    role: 'Nhóm quyền',
    subscription: 'Hệ thống',
    support: 'Hỗ trợ',
    province: 'Đơn vị quản lý',
    ftpTranfer: 'Truyền FTP về bộ',
    publishShare: 'Công bố và Chia sẻ',
    configWQI: 'Cấu hình WQI, AQI',
    groupStatistic: 'Thống kê',
    mapFixed: 'Bản đồ',

    reportSub: 'Báo cáo',
    report: {
      type1: 'Tỷ lệ dữ liệu',
      type2: 'TB 24 giờ',
      type3: 'TB 1 giờ Max',
      type4: 'TB 8 giờ Max',
      type5: 'AQI các giờ/ngày',
      type6: 'AQI TB 24h theo thông số',
      type7: 'AQI ngày theo thông số',
      type9: 'Trung bình ngày',
      type10: 'Tỷ lệ dữ liệu thu được',
      type11: 'Quan trắc trung bình 1 giờ',
      type12: 'Tỉ lệ dữ liệu vượt ngưỡng',
      aqiHour: 'AQI - Giờ',
      aqiDay: 'AQI - Ngày',
      aqi878: 'AQI - 1479',
      status_data: 'Tình trạng dữ liệu',
      status_data_obj: {
        title: 'Báo cáo đánh giá tình trạng dữ liệu',
        dateRange: 'Khoảng thời gian'
      }
    },
    reportBreadcrum: {
      type1: 'Tỷ lệ dữ liệu',
      type2: 'Kết quả quan trắc trung bình 24 giờ',
      type3: 'Trung bình 1 giờ lớn nhất trong ngày',
      type4: 'Trung bình 8 giờ lớn nhất trong ngày',
      type5: 'AQI các giờ/ngày',
      type6: 'AQI trung bình 24h theo thông số',
      type7: 'AQI ngày theo thông số',
      type9: 'Trung bình ngày',
      type10: 'Tỷ lệ dữ liệu thu được',
      type11: 'Kết quả quan trắc trung bình 1 giờ',
      type12: 'Tỉ lệ dữ liệu vượt ngưỡng',
      aqiHour: 'AQI - Giờ',
      aqiDay: 'AQI - Ngày',
      aqi878: 'AQI - 1479',
      status_data: 'Status Data' // Qui them cho dong bo voi file EN
    }
  },
  dataLogger: {
    breadcrumb: {
      base: 'Nhật ký dữ liệu'
    },
    list: {
      emptyView: 'Không có dữ liệu',
      colNo: 'STT',
      colUser: 'Email',
      colTime: 'Thời gian',
      colAction: 'Hành động',
      colDevice: 'Thiết bị',
      colDetail: 'Chi tiết'
    },
    searchForm: {
      user: 'Select email',
      typeLog: 'Loại',
      from: 'Từ ngày',
      to: 'Đến ngày',
      download: 'Xuất Excel'
    },
    action: {
      login: 'Đăng nhập',
      logout: 'Đăng xuất',
      add_measuring: 'Thêm chỉ tiêu quan trắc',
      update_measuring: 'Cập nhật chỉ tiêu quan trắc',
      delete_measuring: 'Xoá chỉ tiêu quan trắc',
      add_province: 'Thêm đơn vị quản lý',
      update_province: 'Cập nhật đơn vị quản lý',
      delete_province: 'Xoá đơn vị quản lý',
      add_qcvn: 'Thêm quy chuẩn',
      update_qcvn: 'Cập nhật quy chuẩn',
      delete_qcvn: 'Xoá quy chuẩn',
      add_station_type: 'Thêm loại trạm',
      update_station_type: 'Cập nhật loại trạm',
      delete_station_type: 'Xoá loại trạm',
      add_station_auto: 'Thêm trạm quan trắc',
      update_station_auto: 'Cập nhật trạm quan trắc',
      delete_station_auto: 'Xoá trạm quan trắc',
      add_role: 'Thêm nhóm quyền',
      update_role: 'Cập nhật nhóm quyền',
      delete_role: 'Xoá nhóm quyền'
    }
  },
  cameraControl: {
    station: {
      label: 'Tên trạm quan trắc',
      placeholder: 'Lựa chọn trạm quan trắc'
    },
    stationType: {
      label: 'Loại trạm',
      placeholder: 'Lựa chọn loại trạm quan trắc'
    },
    selectStationPlaceholder: 'Nhập tên trạm'
  },
  support: {
    breadcrumb: {
      base: 'Hỗ trợ'
    },
    form: {
      type: {
        label: 'Loại hỗ trợ',
        error: 'Vui lòng chọn loại hỗ trợ'
      },
      title: {
        label: 'Tiêu đề',
        error: 'Vui lòng nhập tiêu đề'
      },
      content: {
        label: 'Nội dung',
        error: 'Vui lòng nhập nội dung'
      },
      upload: {
        label: 'Tải lên',
        buttonLabel: 'Chọn để tải lên',
        error: 'Lỗi'
      }
    }
  },
  documents: {
    label: 'Tài liệu hướng dẫn',
    guide1: 'Cài đặt hướng dẫn 1',
    guide2: 'Cài đặt hướng dẫn 2',
    develop: {
      title: 'Chức năng này đang phát triển',
      process: 'Chúng tôi sẽ cập nhật nó cho phiên bản sau'
    }
  },
  statistic: {
    exceeded: 'Vượt ngưỡng',
    perRecData: 'Tỉ lệ nhận dữ liệu',
    perRecDataFrom: {
      breadCrumb: 'Thống kê tỉ lệ nhận dữ liệu',
      time: 'Thời gian',
      totalFile: 'Tổng số file/ngày',
      totalFileReceivedAt: 'Tổng số file truyền về',
      perFileReceivedAt: 'Tỉ lệ file truyền về (%)'
    },
    exceededFrom: {
      breadCrumb: 'Thống kê số lần vượt ngưỡng/ngày',
      time: 'Thời gian',
      totalFile: 'Tổng số file/ngày',
      totalFileReceivedAt: 'Tổng số file truyền về',
      perFileReceivedAt: 'Tỉ lệ file truyền về (%)'
    },
    aqi: {
      menuApp: 'AQI',
      breadCrumb: 'Chỉ số AQI giờ - ngày',
      selectMonths: 'Chọn tháng',
      time: 'Thời gian',
      day: 'Ngày',
      title: 'Giá trị AQI theo giờ'
    },
    wqi: {
      menuApp: 'WQI',
      breadCrumb: 'Chỉ số WQI',
      selectMonths: 'Chọn tháng',
      time: 'Thời gian',
      day: 'Ngày',
      title: 'Giá trị WQI theo giờ'
    }
  },
  pageInfo: {
    header: 'Thông báo',
    body1:
      'Đây là chức năng thuộc phiên bản Nâng cao, vui lòng liên hệ với chúng tôi để biết thêm thông tin:',
    body2: 'Email:'
  },
  stationStatus: {
    good: 'Tốt',
    lostSignal: 'Mất tín hiệu',
    notConnected: 'Chưa kết nối',
    connecting: 'Đang kết nối',
    connected: 'Đã kết nối',
    exceeded: 'Vượt ngưỡng',
    exceededPreparing: 'Chuẩn bị vượt',
    exceededTendency: 'Có xu hướng vượt'
  },
  actions: {
    gotoMonitoring: 'Đến trang Xem chi tiết trạm',
    viewDataAroundThisTime: 'Xem giá trị quanh thời điểm vượt',
    tryAgain: 'Thử lại'
  },
  network: {
    sampling: {
      lostConnection:
        'Không kết nối được với dịch vụ lấy mẫu, vui lòng liên hệ quản trị viên!'
    },
    camera: {
      lostConnection: 'Không kết nối được với Camera, vui lòng kiểm tra lại!'
    },
    qaqc: {
      lostConnection:
        'Không kết nối được với dịch vụ QAQC, vui lòng liên hệ quản trị viên!'
    }
  },
  serverResponse: {
    error: {
      VersionError:
        'Dữ liệu đã được cập nhật bởi người dùng khác, hãy làm mới lại!'
    }
  },
  confirm: {
    msg: {
      restore: 'Bạn có muốn khôi phục mục này không?',
      delete: 'Bạn có muốn xóa mục này không?'
    }
  },
  common: {
    station: 'trạm',
    device: 'thiết bị',
    measure: 'Chỉ tiêu',
    measures: 'Các chỉ tiêu',
    deviceStatus: {
      sensorGood: 'Thiết bị tốt',
      sensorError: 'Lỗi thiết bị',
      sensorMaintain: 'Hiệu chuẩn',
      dataExceeded: 'Vượt ngưỡng',
      dataExceededPrepare: 'Chuẩn bị vượt ngưỡng',
      dataLoss: 'Mất tín hiệu',
      dataGood: 'Tốt',
      dataConnected: 'Có tín hiệu trở lại'
    },
    overview: 'Tổng quan',
    list: 'Danh sách',
    statusSensor: 'Trạng thái thiết bị',
    statusData: 'Trạng thái dữ liệu'
  }
}

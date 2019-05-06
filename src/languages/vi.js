export default {
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
      normal: 'Đang đo',
      maintenance: 'Hiệu chuẩn/Bảo trì',
      broken: 'Báo lỗi',
      sensorNormal: 'Đang đo',
      sensorError: 'Lỗi thiết bị'
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
      reviewStation: 'Đánh giá trạm'
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
          typeOfSampling: 'Hình thức lấy mẫu',
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
          activedOverRange: "Đã kích hoạt lấy mẫu khi vượt ngưỡng (Nhấn để hủy)",
          history: {
            stt: 'STT',
            bottleNo: 'Chai số',
            dateTime: 'Thời gian lấy',
            typeOfSampling: 'Hình thức lấy',
            activedUser: 'Người kích hoạt',
            result: 'Kết quả lấy mẫu'
          },
          config: {
            totalBottles: 'Tổng số chai:',
            controlTagName: 'Tag name điều khiển:',
            timeToTakeOneBottle: 'Thời gian lấy mẫu xong 1 chai (phút):',
            save: 'Lưu'
          }
        }
      },
      chart:{
        tab:{
          avgHour:"Trung bình giờ",
          avgDay:"Trung bình ngày",
        },
        content:{
          minLimit: "Giới hạn dưới",
          maxLimit:"Giới hạn trên",
          to:"Từ",
          from:"Đến",
        }
      }
    }
  },
  aqi: {
    title: 'AQI',
    paramsTitle: 'Giá trị AQI {{=it.day}} ngày của từng thông số'
  },
  wqi: {
    title: 'WQI'
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
    originalData: 'Dữ liệu gốc',
    approveData: 'Kiểm duyệt dữ liệu',
    removeDataBy: 'Chỉ kiểm duyệt dữ liệu khác điều kiện sau:',
    approveAll: 'Kiểm duyệt tất cả',
    manualApprove: 'Kiểm duyệt tùy chọn',
    dataFilter: {
      label: 'Lọc dữ liệu theo',
      negative: 'Số âm',
      outOfRange: 'Ngoài vùng đo',
      isZero: ' Bằng 0',
      deviceStatus: 'Trạng thái thiết bị'
    },
    data: 'Loại dữ liệu',
    approve: 'Kiểm duyệt',
    cancel: 'Hủy bỏ',
    remove: 'Loại bỏ dữ liệu',
    restore: 'Khôi phục',
    allCancel: 'Hủy bỏ tất cả',
    unApprove: 'Hủy kiểm duyệt',
    yetApprove: 'Chưa kiểm duyệt',
    approved: 'Đã kiểm duyệt',
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
      dataLossAt: 'Mất kết nối lúc:',
      dataReceived: 'Dữ liệu lúc:',
      longitude: 'Kinh độ',
      latitude: 'Vĩ độ',
      address: 'Địa chỉ',
      viewMore: {
        sampling: 'Lấy mẫu',
        camera: 'Camera',
        viewData: 'Hiển thị dữ liệu'
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
        placeholder: 'Chọn loại trạm'
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
        label: 'Dữ liệu vượt QCVN'
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
      receivedAt: 'Thời gian',
      all: 'Tất cả',
      numericalOrder: 'TT'
    },
    tab: {
      data: 'Dữ liệu',
      chart: 'Biểu đồ',
      exportExcel: 'Xuất dữ liệu excel',
      statusExport: 'Đang xuất dữ liệu...'
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
  avgSearchFrom: {
    titleText: 'Tra cứu dữ liệu tổng hợp',
    form: {
      time: 'Thời gian',
      stationType: {
        label: 'Loại trạm',
        placeholder: 'Chọn loại trạm',
        error: 'Vui lòng chọn loại trạm'
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
      emptyText: 'Không có giá trị'
    },
    selectTimeRange: {
      minute: 'Phút',
      hour: 'Giờ',
      day: 'Ngày',
      month: 'Tháng',
      year: 'Năm'
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
        placeholder: 'Nhập số thứ tự'
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
        error: 'Vui lòng nhập mã trạm'
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
      color: {
        label: 'Màu sắc',
        placeholder: 'Chọn màu'
      },
      numericalOrder: {
        label: 'Số thứ tự',
        placeholder: 'Nhập số thứ tự'
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
        error: 'Vui lòng nhập mã QCVN'
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
        placeholder: 'Nhập số thứ tự'
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
        error: 'Vui lòng nhập mã đơn vị quản lý'
      },
      name: {
        label: 'Tên đơn vị quản lý',
        placeholder: 'Nhập tên đơn vị quản lý',
        error: 'Vui lòng nhập tên đơn vị quản lý'
      },
      numericalOrder: {
        label: 'Số thứ tự',
        placeholder: 'Nhập số thứ tự'
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
    breadCrumb: 'Cấu hình truyền file TXT về Bộ TNMT',
    configTranferFTP: 'Danh sách trạm',
    success: 'Cập nhật thành công',
    error: 'Thât bại..!',
    save: 'Lưu lại',
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
      failed: 'Truyền file thất bại'
    },
    tryUploadFile: 'Truyền lại file'
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
      key: {
        label: 'Mã trạm',
        placeholder: 'Nhập mã trạm',
        error: 'Vui lòng nhập mã trạm'
      },
      name: {
        label: 'Tên trạm',
        placeholder: 'Nhập tên trạm',
        error: 'Vui lòng nhập tên trạm',
        error_length_max: 'Vui lòng nhập dưới 25 kí tự',
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
      dayOfOperation: {
        label: 'Ngày hoạt động',
        placeholder: 'Ngày hoạt động',
        error: 'Vui lòng chọn ngày hoạt động'
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
      require: 'Vui lòng nhập giá trị'
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
      create: 'Tạo mới',
      edit: 'Chỉnh sửa'
    },
    form: {
      email: {
        label: 'Địa chỉ Email',
        placeholder: 'Địa chỉ Email',
        error: 'Địa chỉ Email không hợp lệ'
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
    list: {
      enableAccount: 'Kích hoạt tài khoản',
      disableAccount: 'Vô hiệu hoá tài khoản',
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
      createdAt: 'Tạo lúc',
      setPassword: 'Cập nhật mật khẩu',
      setPasswordSuccess: 'Cập nhật mật khẩu thành công',
      setPasswordFailure: 'Cập nhật mật khẩu thất bại'
    },
    roleAssign: {
      role: 'Nhóm quền',
      name: 'Tên nhóm quyền',
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
    form: {
      name: {
        label: 'Tên tổ chức',
        placeholder: 'Nhập tên tổ chức',
        error: 'Vui lòng nhập tên tổ chức'
      },
      description: {
        label: 'Mô tả',
        placeholder: 'Nhập mô tả',
        error: 'Vui lòng nhập mô tả'
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
  profileUser: {
    title: 'người dùng',
    success: 'Thay đổi thông tin thành công',
    viewProfile: 'Thông tin cá nhân',
    configStation: 'Cấu hình trạm',
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
      success: 'Hoàn thành',
      error: 'Tải ảnh lên thất bại'
    },
    user: 'Thông tin cá nhân',
    organization: 'Thông tin tổ chức'
  },
  configStation: {
    name: 'Tên trạm',
    breadCrumb: 'Cấu hình trạm theo tài khoản',
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
    note:
      'Nếu bạn bật tính năng Xác thực hai lớp. Hệ thống sẽ gửi mã xác thực đến địa chỉ email hoặc số điện thoại của bạn mỗi khi bạn đăng nhập.',
    success: 'Thành công',
    failure: 'Kích hoạt bảo mật 2 lớp thành công',
    message: {
      userUse: 'Bạn đang sử dụng tính năng bảo mật 2 lớp qua {{=it.type}}',
      code: 'Mã xác thực đã được gửi tới: {{=it.phone}} (sẽ hết hạn sau 10 phút)' ,
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
    lostData: 'Mất tín hiệu',
    sensorError: 'Lỗi thiết bị'
  },
  addon: {
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
      error: 'Xoá thất bại'
    },
    onRestore: {
      success: 'Khôi phục thành công',
      error: 'Khôi phục thất bại'
    },
    search: 'Tìm kiếm',
    error: 'Đã xảy ra sự cố!!!'
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
        updateScheduleTitle: "Xác nhận",
        updateScheduleSubtitle: "Số chai muốn lấy không hợp lệ hoặc thời gian bắt đầu lấy nhỏ hơn 5 phút so với thời điểm hiện tại",
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
          cancelSchedule: "Bạn có chắc muốn hủy lấy mẫu tự động?"
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
      camera: 'Camera',
      historyData: 'Tra cứu dữ liệu',
      avgData: 'Dữ liệu trung bình',
      report: 'Báo cáo',
    },

    processDataSub: 'Xử lý dữ liệu',
    processData: {
      approveData: 'Kiểm duyệt dữ liệu'
    },

    shareDataSub: 'Chia sẻ dữ liệu',
    shareData: {
      shareConfig: 'Cấu hình chia sẻ dữ liệu',
      ftpConfig: 'Cấu hình truyền FTP',
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
      parameter: 'Chỉ tiêu quan trắc',
      stationType: 'Loại trạm',
      site: 'Đơn vị quản lý',
      standard: 'Quy chuẩn',
      role: 'Nhóm quyền',
      user: 'Tài khoản'
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
    mapFixed: 'Bản đồ'
  },
  cameraControl: {
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
      time:'Thời gian',
      totalFile: 'Tổng số file/ngày',
      totalFileReceivedAt: 'Tổng số file truyền về',
      perFileReceivedAt:'Tỉ lệ file truyền về (%)'
    },
    exceededFrom: {
      breadCrumb: 'Thống kê số lần vượt ngưỡng/ngày',
      time:'Thời gian',
      totalFile: 'Tổng số file/ngày',
      totalFileReceivedAt: 'Tổng số file truyền về',
      perFileReceivedAt:'Tỉ lệ file truyền về (%)'
    },
    aqi: {
      menuApp:'AQI',
      breadCrumb: 'Chỉ số AQI giờ - ngày',
      selectMonths: 'Chọn tháng',
      time:'Thời gian',
      day:'Ngày',
      title:'Giá trị AQI theo giờ',

    },
    wqi: {
      menuApp:'WQI',
      breadCrumb: 'Chỉ số WQI',
      selectMonths: 'Chọn tháng',
      time:'Thời gian',
      day:'Ngày',
      title:'Giá trị WQI theo giờ'
    }
  },
  pageInfo: {
    header: 'Thông báo',
    body1: 'Đây là chức năng thuộc phiên bản Nâng cao, vui lòng liên hệ với chúng tôi để biết thêm thông tin:',
    body2: 'Email: sales@vietan-software.com'
  },
  
}
// 
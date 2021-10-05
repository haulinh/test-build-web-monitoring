import FileSaver from 'file-saver'
export const downFileExcel = (data, fileName) => {
  const blob = new Blob([data], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  })
  FileSaver.saveAs(blob, `${fileName}.xlsx`)
}

export const downloadAttachment = params => {
  const { data, name, type } = params
  const blob = new Blob([data], { type })
  FileSaver.saveAs(blob, name)
}

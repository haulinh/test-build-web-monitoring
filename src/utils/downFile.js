import FileSaver from "file-saver";

export const downFileExcel = (data, fileName) => {
    const blob = new Blob([data], { type: 'application/vnd.ms-excel;charset=utf-8' });
    FileSaver.saveAs(blob, `${fileName}.xlsx`)
}
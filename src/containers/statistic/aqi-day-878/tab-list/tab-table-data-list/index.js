import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { translate } from "hoc/create-lang"
import { Table, Button, message } from "antd"

const TableWrapper = styled.div`
  th.column-style {
    text-align: center !important;
  }
`

export default class TableDataList extends React.PureComponent {
  static propTypes = {
    dataAQI: PropTypes.array,
    dataSource: PropTypes.array,
    loading: PropTypes.bool,
    listKey: PropTypes.string,
    onCreateReport: PropTypes.func
  }

  getColumns = () => {
    const columns = [
      {
        title: "STT",
        dataIndex: "stt",
        className: "column-style",
        width: 5,
        render: text => {
          return <div>{text}</div>
        }
      },
      {
        title: "Thời gian",
        dataIndex: "name",
        className: "column-style",
        // width: 150,
        render: text => {
          return <span>{text}</span>
        }
      },
      {
        title: "Đường dẫn tải về",
        dataIndex: "urlDownload",
        className: "column-style",
        render: (text, record) => {
          return <a href={text}>{text}</a>
        }
      },
      {
        title: "Action",
        dataIndex: "action",
        className: "column-style",
        render: (text, record) => {
          // console.log(record,"record")
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: 100
              }}
            >
              <div
                style={{
                  width: 100,
                  marginRight: "4px",
                  marginBottom: "4px"
                }}
              >
                <Button
                  onClick={() =>
                    this.createFileReport({
                      reportDate: record.reportDate,
                      listKey: this.props.listKey
                    })
                  }
                  type="primary"
                  icon="file-add"
                  size={"small"}
                >
                  Tạo file
                </Button>
              </div>

              {record.urlDownload && (
                <div
                  style={{
                    width: 100,
                    marginRight: "4px",
                    marginBottom: "4px"
                  }}
                >
                  <Button
                    type="primary"
                    icon="copy"
                    size={"small"}
                    onClick={() => this.copyToClipboard(record.urlDownload)}
                  >
                    Sao chép
                  </Button>
                </div>
              )}
              {/* {record.urlDownload && <Divider type="vertical" />} */}

              {record.urlDownload && (
                <div
                  style={{
                    width: 100,
                    marginRight: "4px",
                    marginBottom: "4px"
                  }}
                >
                  <Button
                    type="primary"
                    icon="download"
                    size={"small"}
                    onClick={() => {
                      window.open(record.urlDownload, "_blank")
                    }}
                  >
                    Tải file
                  </Button>
                </div>
              )}
            </div>
          )
        }
      }
    ]

    return columns
  }

  copyToClipboard = str => {
    var el = document.createElement("textarea")
    // Set value (string to be copied)
    el.value = str
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute("readonly", "")
    el.style = { position: "absolute", left: "-9999px" }
    document.body.appendChild(el)
    // Select text inside element
    el.select()
    // Copy text to clipboard
    document.execCommand("copy")
    // Remove temporary element
    document.body.removeChild(el)
    message.success("Sao chép thành công", 3)
  }

  createFileReport = ({ reportDate, listKey }) => {
    const param = {
      reportDate: reportDate,
      listKey: listKey,
      timezoneDay: 14
    }
    if(this.props.onCreateReport){
      this.props.onCreateReport(param)
    }
  }

  render() {
    // console.log(this.props.listKey, "this.props.dataSource")
    return (
      <TableWrapper>
        <Table
          size="small"
          rowKey="key"
          bordered
          columns={this.getColumns()}
          dataSource={this.props.dataSource}
          loading={this.props.loading}
          locale={{ emptyText: translate("dataSearchFrom.table.emptyText") }}
          pagination={false}
        />
      </TableWrapper>
    )
  }
}

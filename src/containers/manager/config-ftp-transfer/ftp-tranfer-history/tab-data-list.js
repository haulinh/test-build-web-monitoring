import React from "react";
import { translate } from "hoc/create-lang";
import { autobind } from "core-decorators";
import { Table, Icon, Tooltip } from "antd";
import moment from "moment/moment";

@autobind
export default class TableDataList extends React.PureComponent {
  getColumns() {
    const columnIndex = {
      title: translate("dataSearchFrom.table.numericalOrder"),
      dataIndex: "Index",
      key: "Index",
      render(value, record, index) {
        return <div>{index + 1}</div>;
      }
    };

    const columnTime = {
      title: translate("dataSearchFrom.table.time"),
      dataIndex: "time",
      key: "time",
      sorter: (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      render(value) {
        return <div>{moment(value).format("DD-MM-YYYY HH:mm")}</div>;
      }
    };
    const columnReceivedAt = {
      title: translate("dataSearchFrom.table.receivedAt"),
      dataIndex: "receivedAt",
      key: "receivedAt",
      render(value) {
        return <div>{moment(value).format("DD-MM-YYYY HH:mm")}</div>;
      }
    };

    const columnPath = {
      title: translate("stationAutoManager.ftpFile.fileName"),
      dataIndex: "fileName",
      key: "fileName",
      render(value) {
        return <div>{value}</div>;
      }
    };

    const columnIsTranfer = {
      title: translate("ftpTranfer.status.title"),
      dataIndex: "isTransferred",
      key: "isTransferred",
      align: "center",
      sorter: (x, y) =>
        x.isTransferred === y.isTransferred ? 0 : x.isTransferred ? -1 : 1,
      render(value) {
        return (
          <Tooltip
            key={value}
            placement="top"
            title={
              value
                ? translate("ftpTranfer.status.success")
                : translate("ftpTranfer.status.failed")
            }
          >
            <div>
              <span onClick={() => {}}>
                <Icon
                  type={value ? "check" : "close"}
                  theme="outlined"
                  style={{
                    paddingLeft: "15px",
                    color: `${value ? "blue" : "red"}`
                  }}
                />{" "}
              </span>
            </div>
          </Tooltip>
        );
      }
    };

    return [
      columnIndex,
      columnReceivedAt,
      columnTime,
      columnPath,
      columnIsTranfer
    ];
  }

  render() {
    return (
      <div>
        <Table
          size="small"
          rowKey="_id"
          columns={this.getColumns()}
          {...this.props}
          pagination={{
            pageSize: 15
          }}
          locale={{ emptyText: translate("dataSearchFrom.table.emptyText") }}
        />
      </div>
    );
  }
}

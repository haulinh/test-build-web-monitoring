import React from "react";
import propTypes from "prop-types";
import _ from "lodash";
import { connectAutoDispatch } from "redux/connect";
import { Spin, Icon, Input, Row, Col, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import { withRouter } from "react-router";
// import { COLOR_STATUS } from 'themes/color';
import {
  loadNotificationsByType,
  clearLoadNotificationsByType
} from "redux/actions/notification";
import { translate } from "hoc/create-lang";

import Cells from "./cells";

const { Search } = Input;

function LoadMoreIcon() {
  const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
  return (
    <div style={{ textAlign: "center", paddingTop: 16 }}>
      <Spin indicator={antIcon} />
    </div>
  );
}

const i18n = {
  timKiem: translate("addon.search")
};

@connectAutoDispatch(
  state => ({
    loading: state.notification.loading,
    currentPage: state.notification.currentPage,
    dataSource: state.notification.logs,
    stationAuto: state.stationAuto.list
  }),
  { loadNotificationsByType, clearLoadNotificationsByType }
)
@withRouter
export default class NotificationDrawer extends React.Component {
  static propTypes = {
    /* component's props */
    tabName: propTypes.string.isRequired,
    /* redux's props */
    stationAuto: propTypes.array.isRequired,
    loading: propTypes.bool.isRequired,
    currentPage: propTypes.number.isRequired,
    dataSource: propTypes.array.isRequired,
    loadNotificationsByType: propTypes.func.isRequired,
    clearLoadNotificationsByType: propTypes.func
  };

  static defaultProps = {};

  state = {
    currentPage: 1,
    txtSearch: undefined,
    isSearchLoading: false
  };

  componentDidMount() {
    const { stationAuto, currentPage } = this.props;
    this.props.loadNotificationsByType(
      currentPage,
      stationAuto,
      this.state.txtSearch
    );
  }

  hanldeOnChange = _.debounce(value => {
    const { stationAuto, currentPage } = this.props;

    this.setState(
      {
        txtSearch: value,
        isSearchLoading: false
      },
      () => {
        this.props.loadNotificationsByType(
          0,
          stationAuto,
          this.state.txtSearch
        );
      }
    );
  }, 300);
  render() {
    const { loading, dataSource, stationAuto, currentPage } = this.props;

    return (
      <div>
        <Row>
          <Col style={{ padding: "8px" }}>
            <Search
              style={{ boxShadow: "4px 4px 6px #eee" }}
              placeholder={i18n.timKiem}
              onChange={e => {
                const value = e.target.value;
                this.setState({
                  isSearchLoading: true
                });
                this.props.clearLoadNotificationsByType();
                this.hanldeOnChange(_.trim(value));
              }}
            />
          </Col>
        </Row>
        {this.state.isSearchLoading && (
          <Skeleton avatar paragraph={{ rows: 4 }} />
        )}
        {!this.state.isSearchLoading && (
          <div style={{ height: "90vh", overflow: "auto" }}>
            <InfiniteScroll
              initialLoad={
                false
              } /* NOTE : không load chỗ này sẽ dẫn đến vòng lập vô hạn */
              pageStart={currentPage}
              hasMore={loading}
              threshold={1000}
              loader={<LoadMoreIcon />}
              loadMore={page =>
                this.props.loadNotificationsByType(
                  page,
                  stationAuto,
                  this.state.txtSearch
                )
              }
              useWindow={false}
            >
              <Cells
                dataSource={dataSource}
                closeDrawer={this.props.closeDrawer}
              />
            </InfiniteScroll>

            <div style={{ height: 100 }} />
          </div>
        )}
      </div>
    );
  }
}

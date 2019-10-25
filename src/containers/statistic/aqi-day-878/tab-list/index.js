import React from "react";
import PropTypes from "prop-types";
import BoxShadow from "components/elements/box-shadow";
import TabTableDataList from "./tab-table-data-list/index";



const TabeListWrapper = BoxShadow.extend`
  padding: 0px 16px 16px 16px;
  position: relative;
`;

export default class TabeList extends React.PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool,
    dataAQI: PropTypes.array,
    listKey: PropTypes.string,
    nameChart: PropTypes.string,
    isExporting: PropTypes.bool,
    onCreateReport: PropTypes.func
  };

  render() {
    return (
      <TabeListWrapper>
        <TabTableDataList
          loading={this.props.isLoading}
          dataSource={this.props.dataAQI}
          onChange={this.props.onChangePage}
          listKey={this.props.listKey}
          onCreateReport={this.props.onCreateReport}
        />
      </TabeListWrapper>
    );
  }
}

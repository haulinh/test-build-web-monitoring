import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Typography, Input, Skeleton } from "antd";
import styled from "styled-components";
import * as _ from "lodash";
const { Text } = Typography;

const WrapperView = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid #f2f2f2;
  padding: 8px;

  .item-aqi {
    display: flex;
    padding: 8px 0px;
    border-bottom: 1px solid #f2f2f2;
    justify-content: space-between;
  }
`;

const RenderValueAqi = ({ valueAqi, aqiLevel }) => {
  const level = _.find(aqiLevel, ({ min, max }) => {
    return (
      _.inRange(valueAqi, min, max) ||
      valueAqi === max ||
      (min < valueAqi && !max) ||
      (max > valueAqi && !min)
    );
  });
  const backgroundColor = _.get(level, "backgroundColor", null);
  const colorFont = _.get(level, "color", null);
  const colorBorder = "#FFFFFF";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgroundColor || "yellow",
        padding: `4px`,
        borderRadius: "50%",
        border: `2px solid ${colorBorder}`,
        width: 45,
        height: 45,
        marginBottom: 6
      }}
    >
      <div>
        <span
          style={{
            fontSize: `16px`,
            color: colorFont,
            fontWeight: "bold"
          }}
        >
          {valueAqi}
        </span>
      </div>
    </div>
  );
};

export default class AQIList extends React.PureComponent {
  static propTypes = {
    aqiList: PropTypes.array,
    aqiLevel: PropTypes.array
  };

  state = {
    dataSoure: null
  };

  componentDidUpdate = () => {
    if (!this.state.dataSoure) {
      this.setState({
        dataSoure: this.props.aqiList
      });
    }
  };

  hanldeOnchange = e => {
    const value = e.target.value;
    const dataSearch = _.filter(this.props.aqiList, item => {
      const name = _.get(item, "name", "");
      return _.toUpper(name.trim()).search(_.toUpper(value.trim())) >= 0;
    });

    console.log(dataSearch, "---dataSearch");
    this.setState({
      dataSoure: dataSearch
    });
    // => objects for ['fred']
  };

  render() {
    return (
      <WrapperView>
        <Input placeholder="Tìm kiếm trạm AQI" onChange={this.hanldeOnchange} />
        {(!this.state.dataSoure) && (
          <Skeleton />
        )}
        {_.map(this.state.dataSoure, (item, index) => {
          const name = _.get(item, "name", "");
          const address = _.get(item, "address", "");
          const valueAqi = _.get(item, "aqiDay");
          return (
            <Row key={index}>
              <Col>
                <div className="item-aqi">
                  <div>
                    <div>
                      <Text style={{fontSize:16}} strong>{name}</Text>
                    </div>
                    <div>
                      <Text type="secondary">{address}</Text>
                    </div>
                  </div>
                  <div>
                    <RenderValueAqi
                      aqiLevel={this.props.aqiLevel}
                      valueAqi={valueAqi}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          );
        })}
      </WrapperView>
    );
  }
}

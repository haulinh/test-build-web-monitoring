import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import styled from "styled-components";
import { Sticky, StickyContainer } from "react-sticky";
import { Collapse } from "reactstrap";
import StationAutoList from "./station-auto-list";
import HeadStationType from "./HeadStationType";
import { Icon, Select } from "antd";
import { filter, uniqBy, forEach as _forEach } from "lodash";

const { Option } = Select;

const StationTypeWrapper = styled.div``;

const IconToggle = styled.span`
  transition: all 0.3s linear;
  transform: rotate(-0deg);
  display: inline-block;
  margin-right: 4px;
  font-size: 10px;
  position: relative;
  top: -2px;
  ${props => (props.isOpen ? `transform: rotate(90deg);` : ``)};
`;

const TextSpan = styled.span`
  &:hover {
    cursor: pointer;
  }
`;

@autobind
export default class StationTypeSummary extends React.Component {
  static propTypes = {
    stationType: PropTypes.object,
    stationAutoList: PropTypes.array
  };

  state = {
    isOpen: true,
    measureSoure: []
  };

  toggleOpen() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  componentDidMount() {
    const { stationAutoList } = this.props;
    let tamp = [];
    // qui chin de k bi bao warning
    _forEach(stationAutoList, item =>{
      tamp = [...tamp, ...item.measuringList];
    })
    // stationAutoList.fo(item => {
    //   tamp = [...tamp, ...item.measuringList];
    // });
    let measureSource = uniqBy(tamp, "key");
    this.setState({
      measureSoure: measureSource,
      measureShow: measureSource.map(item => item.key)
    });
  }

  render() {
    const { stationType, stationAutoList } = this.props;
    const goodTotal = filter(
      stationAutoList || [],
      ({ status }) => status === "GOOD"
    ).length;
    if (stationAutoList.length === 0) return null;

    return (
      <StickyContainer>
        <StationTypeWrapper>
          <Sticky>
            {props => (
              <div
                style={{
                  ...props.style,
                  top: props.isSticky ? "68.8px" : null,
                  transition: "all .3s linear",
                  zIndex: 99999
                }}
              >
                <HeadStationType>
                  <TextSpan onClick={this.toggleOpen}>
                    <IconToggle isOpen={this.state.isOpen}>
                      <Icon type="caret-right" />
                    </IconToggle>
                    {stationType.name} ({goodTotal}/{stationAutoList.length})
                  </TextSpan>
                  <Select
                    mode="multiple"
                    size="small"
                    getPopupContainer={() => document.querySelector(".ant-table-wrapper")}
                    style={{ width: "100%", maxWidth: 800, marginLeft: 20 }}
                    maxTagCount={6}
                    value={this.state.measureShow}
                    onChange={val => {
                      this.setState({ measureShow: val });
                    }}
                  >
                    {this.state.measureSoure.map(item => {
                      return <Option value={item.key}>{item.name}</Option>;
                    })}
                  </Select>
                </HeadStationType>
              </div>
            )}
          </Sticky>
          <Collapse isOpen={this.state.isOpen}>
            <StationAutoList
              isShowStationName={stationType.name === "All"}
              stationAutoList={stationAutoList}
              measureShow={this.state.measureShow}
            />
          </Collapse>
        </StationTypeWrapper>
      </StickyContainer>
    );
  }
}

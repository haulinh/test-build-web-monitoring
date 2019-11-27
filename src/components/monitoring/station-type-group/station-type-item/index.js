import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import styled from "styled-components";
import { Sticky, StickyContainer } from "react-sticky";
import { Collapse } from "reactstrap";
import StationAutoList from "./station-auto-list";
import HeadStationType from "./HeadStationType";
import { removeAccents } from "hoc/create-lang";
import { Icon } from "antd";
import { get as _get } from "lodash";
import { filter } from "lodash";
import { connect } from "react-redux";

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

@connect(state => ({
  language: _get(state, "language.locale")
}))
@autobind
export default class StationTypeSummary extends React.Component {
  static propTypes = {
    stationType: PropTypes.object,
    stationAutoList: PropTypes.array
  };

  state = {
    isOpen: true
  };

  toggleOpen() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { stationType, stationAutoList, language } = this.props;
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
                  top: props.isSticky ? "95px" : null,
                  transition: "all .3s linear",
                  zIndex: 99999
                }}
              >
                <HeadStationType>
                  <TextSpan onClick={this.toggleOpen}>
                    {removeAccents(language, stationType.name)} ({goodTotal}/
                    {stationAutoList.length})
                    <IconToggle
                      isOpen={this.state.isOpen}
                      style={{ marginLeft: 10 }}
                    >
                      <Icon type="caret-right" />
                    </IconToggle>
                  </TextSpan>
                </HeadStationType>
              </div>
            )}
          </Sticky>
          <Collapse isOpen={this.state.isOpen}>
            <StationAutoList
              isShowStationName={stationType.name === "All"}
              stationAutoList={stationAutoList}
            />
          </Collapse>
        </StationTypeWrapper>
      </StickyContainer>
    );
  }
}

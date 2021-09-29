import { Col, Icon, Input, Row } from 'antd';
import React, { Component } from 'react'


class Categories extends Component {
  state = {
    list: []
  }

  onCreate = () => {
    const newKey = Math.random()
    const { list } = this.state;

    this.setState({ list: [...list, newKey] })
  }

  onDelSubCategory = (idxDelete) => {
    const { list } = this.state;
    const newList = list.filter((_, idx) => idx !== idxDelete)

    this.setState({ list: newList })
  }

  render() {
    const { list } = this.state

    return (
      <div>
        <div>
          Danh muc
          <button onClick={this.onCreate}>Create</button>
        </div>
        {list.map((item, idx) => {
          return (
            <div key={item}>
              <Row gutter={10} style={{ marginTop: 5 }}>
                <Col span={1} style={{ paddingTop: 6, paddingRight: 25 }}>
                  <Icon type="menu" style={{ color: "#BFBFBF", fontSize: "16px" }}></Icon>
                </Col>
                <Col span={22}>
                  <Input
                    suffix={
                      <Icon onClick={() => this.onDelSubCategory(idx)} type="close" style={{ color: "#BFBFBF", fontSize: "12px" }} />
                    }>
                  </Input>
                </Col>
              </Row>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Categories

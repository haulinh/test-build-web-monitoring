import React, { Component } from 'react'

class Categories extends Component {
    state = {
      list: []
    }

    onCreate = () => {
      const newKey = Math.random()
      const {list}= this.state;

      this.setState({list: [...list, newKey]})
    }

    onDrop = (ev, idx) => {
      ev.preventDefault();
      var newIdx = ev.dataTransfer.getData("index");
      console.log('onDrop ',idx, newIdx)
    }

    onDragStart = (ev, idx) => {
      console.log('==========================')
      console.log('onDragStart ', idx)
      ev.dataTransfer.setData("index", idx);
    }

    render() {
        const {list} = this.state
        
        return (
          <div>
            <div>
              Danh muc
              <button onClick={this.onCreate}>Create</button> 
            </div>
            {list.map((item, idx) => {
              return (
                <div key={item}>
                  <span 
                    draggable="true"
                    onDragOver={e => e.preventDefault()}
                    onDrop={(ev) => this.onDrop(ev, idx)}
                    onDragStart={(ev) => this.onDragStart(ev, idx)}
                  >drag {item}</span>
                  <input />
                </div>
              )
            })}
          </div>
        )
    }
}

export default Categories

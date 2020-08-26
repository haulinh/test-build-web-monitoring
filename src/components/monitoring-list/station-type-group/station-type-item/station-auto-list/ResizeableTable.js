import * as React from 'react'
import { Table } from 'antd'
import 'antd/dist/antd.css'
import { Resizable } from 'react-resizable'
import './resizeable-table.css'

class ResizeableTitle extends React.Component {
  render() {
    const { onResize, width, onClick, ...restProps } = this.props

    if (!width) {
      return <th {...restProps} />
    }

    return (
      <Resizable
        width={width}
        height={0}
        onResizeStart={() => (this.resizing = true)}
        onResizeStop={() => {
          setTimeout(() => {
            this.resizing = false
          })
        }}
        onResize={onResize}
      >
        <th
          onClick={(...args) => {
            console.log('>>>', this.resizing)
            if (!this.resizing && onClick) {
              onClick(...args)
            }
          }}
          {...restProps}
        />
      </Resizable>
    )
  }
}

class ResizeableTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: props.columns,
    }
  }

  components = {
    header: {
      cell: ResizeableTitle,
    },
  }

  static getDerivedStateFromProps(nextProps) {    
    return {
      columns: nextProps.columns,
    }
  }

  componentDidMount() {
    const handlers = document.querySelectorAll(
      '.react-resizable .react-resizable-handle'
    )
    handlers.forEach(handler =>
      handler.addEventListener('click', e => {
        console.log('e', e)
        return false
      })
    )
  }

  render() {
    console.log('this.props.columns', this.props.columns)
    console.log('this.state.columns', this.state.columns)
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }))

    const components = Object.assign({}, this.props.components, this.components)

    return <Table {...this.props} columns={columns} components={components} />
  }

  handleResize = index => (e, { size }) => {
    // console.log('handleResize', e)
    e.stopImmediatePropagation()
    // e.preventDefault();
    this.setState(({ columns }) => {
      const nextColumns = [...columns]
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      }
      return { columns: nextColumns }
    })
  }
}

export default ResizeableTable

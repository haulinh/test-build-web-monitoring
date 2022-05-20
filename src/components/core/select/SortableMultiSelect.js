import { Col, Icon, Row } from 'antd'
import { isEqual, keyBy } from 'lodash'
import React, { Component } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: '0 6px',
  margin: 2,
  height: '25px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '14px',
  textAlign: 'center',
  // whiteSpace: 'nowrap',

  // change background colour if dragging
  background: '#fafafa',
  borderColor: 'rgb(217, 217, 217)',
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 2,

  // styles we need to apply on draggables
  ...draggableStyle,
})

const getListStyle = (isDraggingOver, itemsLength) => ({
  display: 'flex',
  width: '100%',
  // flexWrap: 'nowrap',
  overflowX: 'auto',
  overflowY: 'hidden',
  transition: 'transform ease-out 0.3s',

  maxHeight: 400,
  padding: 4,
  rowGap: 8,
  minHeight: 35,
})

const ItemSelect = styled.div`
  padding: 0px 12px;
  background-color: ${props => props.bg};
  font-weight: ${props => props.fontWeight};
  &:hover {
    transition: background 0.3s ease;
    background-color: #e6f7ff;
    cursor: pointer;
  }
`

const Select = styled.div`
  position: absolute;
  z-index: 9;
  background-color: white;
  padding: 5px 0;
  width: 100%;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  max-height: 300px;
  overflow-x: auto;
  border-radius: 5px;
`

const BoxSelectMeasure = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgb(217, 217, 217);
  border-radius: 2px;
  min-height: 40px;

  .clear-all {
    margin-right: 4px;
    cursor: pointer;
    visibility: hidden;
    svg {
      fill: rgba(0, 0, 0, 0.25);
    }

    &:hover {
      svg {
        fill: rgba(0, 0, 0, 0.45);
      }
    }
  }

  &:hover {
    .clear-all {
      visibility: visible;
    }
  }
`

const Measure = styled.div`
  display: flex;
  gap: 5px;
  width: 100%;
  align-items: center;

  .measure-name {
    max-width: 130px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon-delete {
    svg {
      fill: rgba(0, 0, 0, 0.45);
    }
    &:hover {
      svg {
        fill: rgba(0, 0, 0, 0.65);
      }
    }
  }
`

const convertArrayValue = array => array.map(item => item.value)

export default class SortableMultiSelect extends Component {
  state = {
    isOpenListSelect: false,
    optionsChoose: [],
  }

  ref = React.createRef()

  handleOnClickOutSide = e => {
    if (
      this.state.isOpenListSelect &&
      this.ref.current &&
      !this.ref.current.contains(e.target)
    ) {
      this.setState({ isOpenListSelect: false })
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.handleOnClickOutSide)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleOnClickOutSide)
  }

  componentDidUpdate(prevProps, prevState) {
    const { optionsChoose } = this.state
    const { onChange, value, options } = this.props

    if (!isEqual(value, prevProps.value)) {
      const optionsObj = keyBy(options, 'value')

      const valueMapOption = value.map(valueItem => optionsObj[valueItem])
      this.setState({ optionsChoose: valueMapOption })
    }

    if (!isEqual(optionsChoose, prevState.optionsChoose)) {
      onChange(convertArrayValue(optionsChoose))
    }
  }

  openListSelect = () => {
    this.setState({ isOpenListSelect: true })
  }

  toggleSelect = () =>
    this.setState(prevState => ({
      isOpenListSelect: !prevState.isOpenListSelect,
    }))

  handleOnChoose = option => {
    const { optionsChoose } = this.state

    const exitsOption = optionsChoose.find(
      optionChoose => optionChoose.value === option.value
    )

    if (exitsOption) {
      const newOptionChoose = optionsChoose.filter(
        optionChoose => optionChoose.value !== exitsOption.value
      )
      this.setState({ optionsChoose: newOptionChoose })
      return
    }

    const newOptionChoose = [...optionsChoose, option]
    this.setState({ optionsChoose: newOptionChoose })
  }

  handleOnUnChoose = option => {
    const { optionsChoose } = this.state

    const newOptionsChoose = optionsChoose.filter(
      optionChoose => optionChoose.value !== option.value
    )
    this.setState({ optionsChoose: newOptionsChoose })
  }

  clearChoose = () => {
    this.setState({ optionsChoose: [] })
  }

  onDragEnd = result => {
    const { optionsChoose } = this.state
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const newOptionChoose = reorder(
      optionsChoose,
      result.source.index,
      result.destination.index
    )

    this.setState({
      optionsChoose: newOptionChoose,
    })
  }

  isOptionChoose = value => {
    const { optionsChoose } = this.state
    return optionsChoose.find(optionChoose => optionChoose.value === value)
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { options } = this.props
    const { isOpenListSelect, optionsChoose } = this.state
    return (
      <div
        ref={this.ref}
        onClick={this.openListSelect}
        style={{ width: '100%', position: 'relative' }}
      >
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
              <BoxSelectMeasure>
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {optionsChoose.map((option, index) => (
                    <div>
                      <Draggable
                        onClick={e => e.stopPropagation()}
                        key={option.value || option.key || option._id}
                        draggableId={option.value || option.key || option._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <Measure>
                              <div className="measure-name">{option.name}</div>
                              <div>
                                <Icon
                                  onClick={() => this.handleOnUnChoose(option)}
                                  className="icon-delete"
                                  type="close"
                                  style={{ fontSize: '10px' }}
                                />
                              </div>
                            </Measure>
                          </div>
                        )}
                      </Draggable>
                    </div>
                  ))}
                </div>
                <Icon
                  type="close-circle"
                  theme="filled"
                  className="clear-all"
                  onClick={e => {
                    e.stopPropagation()
                    this.clearChoose()
                  }}
                />
              </BoxSelectMeasure>
            )}
          </Droppable>
        </DragDropContext>
        {isOpenListSelect && (
          <Select>
            {options.map(option => (
              <ItemSelect
                bg={this.isOptionChoose(option.value) && '#FAFAFA'}
                fontWeight={this.isOptionChoose(option.value) && 600}
                onClick={() => this.handleOnChoose(option)}
              >
                <Row type="flex" justify="space-between">
                  <Col>{option.name || options.label}</Col>
                  <Col>
                    {this.isOptionChoose(option.value) && (
                      <Icon type="check" style={{ color: '#1890ff' }} />
                    )}
                  </Col>
                </Row>
              </ItemSelect>
            ))}
          </Select>
        )}
      </div>
    )
  }
}

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
  // width: '100%',
  maxWidth: '70px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',

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
  padding: 2px 10px 4px;
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
  transition: all 0.2s;
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderColor: 'rgb(217, 217, 217)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderRadius: 2,
                  minHeight: '40px',
                  // textOverflow: 'ellipsis'
                }}
              >
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
                            <div
                              style={{
                                maxWidth: '80%',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {option.name}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    </div>
                  ))}
                </div>
                <Icon
                  type="close-circle"
                  theme="outlined"
                  style={{ marginRight: 4, cursor: 'pointer' }}
                  onClick={e => {
                    e.stopPropagation()
                    this.clearChoose()
                  }}
                />
              </div>
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
                    {this.isOptionChoose(option.value) && <Icon type="check" />}
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

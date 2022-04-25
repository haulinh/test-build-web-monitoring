import React, { Component } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import ItemDrag from 'components/elements/item-drag'

const DragDropWrapper = styled.div`
  .drag-drop-wrapper {
    width: 100%;
    background: #f3f4f6;
    border-radius: 8px;
    max-height: 400px;
    overflow: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }
`

export default class DragDropMeasure extends Component {
  render() {
    const { measuringList, onDragEnd, onChangeCheckBox, form } = this.props
    return (
      <DragDropWrapper>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
              <div
                className="drag-drop-wrapper"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {measuringList.map((measure, index) => (
                  <Draggable
                    key={measure.key}
                    draggableId={measure.key}
                    index={index}
                  >
                    {provided => (
                      <div
                        key={measure.key}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ItemDrag
                          form={form}
                          name={measure.name}
                          itemKey={measure.key}
                          onChangeCheckBox={onChangeCheckBox}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </DragDropWrapper>
    )
  }
}

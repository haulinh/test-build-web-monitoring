import ItemDrag from 'components/elements/item-drag'
import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'

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

export default function DragDropConfig({ form, onDragEnd, columnList }) {
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
              {columnList.map((column, index) => (
                <Draggable
                  key={column.key}
                  draggableId={column.key}
                  index={index}
                >
                  {provided => (
                    <div
                      key={column.key}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ItemDrag
                        form={form}
                        name={column.name}
                        itemKey={column.key}
                        checked={column.checked}
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

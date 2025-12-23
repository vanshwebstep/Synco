import React, { useState, useCallback, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import BlockRenderer from "./BlockRenderer";
import PreviewModal from "./PreviewModal";

export default function TemplateBuilder({
  blocks,
  setBlocks,
  subject,
  setSubject,
  isPreview,
  setIsPreview
}) {


  const sidebarBlocks = [
    { id: "text", label: "Text field" },
    { id: "input", label: "Input" },
    { id: "image", label: "Image" },
    { id: "btn", label: "Button" },
    { id: "sectionGrid", label: "Section Grid" },
  ];

  const addBlock = async (type) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      content:
        type === "text"
          ? ""
          : type === "btn"
            ? ""
            : "",
      url: "",
      placeholder: "Enter value" ,
      style:
        type === "btn"
          ? {
            backgroundColor: "#000000",
            textColor: "#ffffff",
            fontSize: 16,
          }
          : type === "text"
            ? {
              textColor: "#000000",
              fontSize: 16,
            }
            : {},
      columns:
        type === "sectionGrid"
          ? Array(2)
            .fill(null)
            .map(() => [])
          : null,
    };


    setBlocks((prev) => [...prev, newBlock]);
  };


  const deleteBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

const duplicateBlock = (id) => {
  const block = blocks.find((b) => b.id === id);

  // ✅ deep clone (break shared references)
  const clonedBlock = JSON.parse(JSON.stringify(block));

  // ✅ assign brand new IDs
  const regenerateIds = (blk) => {
    blk.id = crypto.randomUUID();

    // sectionGrid → regenerate child IDs
    if (blk.type === "sectionGrid" && Array.isArray(blk.columns)) {
      blk.columns = blk.columns.map((column) =>
        column.map((child) => {
          const clonedChild = { ...child };
          regenerateIds(clonedChild);
          return clonedChild;
        })
      );
    }
  };

  regenerateIds(clonedBlock);

  setBlocks((prev) => [...prev, clonedBlock]);
};


  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    setBlocks(items);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Canvas */}
      <div className="flex-1 p-6 border-r border-gray-200">
        <div className="flex justify-between items-center mb-5">



        </div>
        <div className="mb-6">
          <label className="font-medium text-gray-700">Subject line</label>
          <input
            className="w-full border border-gray-200 px-4 py-2 rounded-lg mt-1"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject..."
          />
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {blocks.map((block, index) => (
                  <Draggable
                    key={block.id}
                    draggableId={block.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm"
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        {/* Block header */}
                        <div className="flex justify-between mb-2 text-sm">
                          <div {...provided.dragHandleProps} className="cursor-grab text-gray-500">
                            ⠿
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => duplicateBlock(block.id)}
                              className="px-2 py-1 text-white  bg-[#237FEA] rounded-xl"
                            >
                              Duplicate
                            </button>

                            <button
                              onClick={() => deleteBlock(block.id)}
                              className="px-2 py-1 text-white   bg-red-500 rounded-xl"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Block Body */}
                        <BlockRenderer
                          block={block}
                          blocks={blocks}
                          setBlocks={setBlocks}
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
      </div>

      {/* Sidebar */}
      <div className="w-[260px] p-4 bg-white">
        <h3 className="font-semibold text-lg mb-3">Blocks</h3>

        <div className="space-y-2">
          {sidebarBlocks.map((block) => (
            <div
              key={block.id}
              onClick={() => addBlock(block.id)}
              className="px-3 py-2 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200"
            >
              {block.label}
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}

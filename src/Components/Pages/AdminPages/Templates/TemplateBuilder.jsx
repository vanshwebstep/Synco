import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

export default function TemplateBuilder() {
  const [canvasItems, setCanvasItems] = useState([]);

  const blocks = [
    { id: "text", label: "Text Field" },
    { id: "image", label: "Image" },
    { id: "btn", label: "Button" },
    { id: "banner", label: "Banner" },
    { id: "footer", label: "Footer" },
    { id: "logo", label: "Logo" },
    { id: "sectionGrid", label: "Section Grid" }, // New block
  ];

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Reorder inside canvas
    if (
      source.droppableId === "canvas" &&
      destination.droppableId === "canvas"
    ) {
      const updated = Array.from(canvasItems);
      const [moved] = updated.splice(source.index, 1);
      updated.splice(destination.index, 0, moved);
      setCanvasItems(updated);
      return;
    }

    // Dragging from blocks into canvas
    if (
      source.droppableId === "blocks" &&
      destination.droppableId === "canvas"
    ) {
      const block = blocks.find((b) => b.id === draggableId);
      let newItem;

      if (block.id === "sectionGrid") {
        // Default section grid with 1 column and empty content array for each column
        newItem = {
          id: Date.now().toString(),
          type: block.label,
          columns: 1,
          contents: [[""]], // Array of arrays of strings, one array per column
        };
      } else if (block.id === "text") {
        newItem = {
          id: Date.now().toString(),
          type: block.label,
          text: "Edit me", // default editable text
        };
      } else if (block.id === "image") {
        newItem = {
          id: Date.now().toString(),
          type: block.label,
          imageUrl: null,
        };
      } else {
        newItem = {
          id: Date.now().toString(),
          type: block.label,
        };
      }

      setCanvasItems((prev) => [...prev, newItem]);
    }
  };

  // Handle editable text change
  const handleTextChange = (id, newText) => {
    setCanvasItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
  };

  // Handle image upload
  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCanvasItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, imageUrl: ev.target.result } : item
        )
      );
    };
    reader.readAsDataURL(file);
  };

  // Handle Section Grid column count change
  const handleColumnChange = (id, newCount) => {
    setCanvasItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Adjust columns and contents arrays accordingly
          const oldCount = item.columns;
          let newContents = [...item.contents];

          if (newCount > oldCount) {
            // Add empty columns
            for (let i = oldCount; i < newCount; i++) {
              newContents.push([""]);
            }
          } else if (newCount < oldCount) {
            newContents = newContents.slice(0, newCount);
          }

          return {
            ...item,
            columns: newCount,
            contents: newContents,
          };
        }
        return item;
      })
    );
  };

  // Handle content change inside a section grid column
  const handleSectionContentChange = (id, colIndex, textIndex, newText) => {
    setCanvasItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newContents = item.contents.map((col, i) => {
            if (i === colIndex) {
              const newCol = [...col];
              newCol[textIndex] = newText;
              return newCol;
            }
            return col;
          });
          return { ...item, contents: newContents };
        }
        return item;
      })
    );
  };

  // Add new content line in a column for section grid
  const addSectionContentLine = (id, colIndex) => {
    setCanvasItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newContents = item.contents.map((col, i) => {
            if (i === colIndex) {
              return [...col, ""];
            }
            return col;
          });
          return { ...item, contents: newContents };
        }
        return item;
      })
    );
  };

  return (
    <div className="flex gap-6 p-6 min-h-screen bg-gray-50">
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Left - Canvas */}
        <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
          <input
            placeholder="Subject line"
            className="w-full border px-4 py-3 rounded-lg shadow-sm outline-none mb-4"
          />

          <div className="w-full rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
              alt="Hero Banner"
              className="w-full h-[150px] object-cover rounded-xl"
            />
          </div>

          <Droppable droppableId="canvas">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="mt-6 space-y-4"
              >
                {canvasItems.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="border p-4 rounded-xl bg-white shadow cursor-grab"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {item.type === "Text Field" && (
                          <textarea
                            className="w-full p-2 border rounded resize-none"
                            rows={4}
                            value={item.text}
                            onChange={(e) =>
                              handleTextChange(item.id, e.target.value)
                            }
                            placeholder="Enter text..."
                          />
                        )}

                        {item.type === "Image" && (
                          <div>
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt="Uploaded"
                                className="max-w-full h-48 object-contain rounded"
                              />
                            ) : (
                              <label className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Upload Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleImageUpload(item.id, e)
                                  }
                                />
                              </label>
                            )}
                          </div>
                        )}

                        {item.type === "Section Grid" && (
                          <div>
                            <label className="block mb-2 font-semibold">
                              Columns:
                              <select
                                className="ml-2 border rounded p-1"
                                value={item.columns}
                                onChange={(e) =>
                                  handleColumnChange(
                                    item.id,
                                    Number(e.target.value)
                                  )
                                }
                              >
                                {[1, 2, 3].map((col) => (
                                  <option key={col} value={col}>
                                    {col}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <div className="flex gap-4">
                              {item.contents.map((col, colIndex) => (
                                <div
                                  key={colIndex}
                                  className="flex-1 border rounded p-2 bg-gray-50"
                                >
                                  <p className="font-semibold mb-2">
                                    Column {colIndex + 1}
                                  </p>
                                  {col.map((text, textIndex) => (
                                    <textarea
                                      key={textIndex}
                                      className="w-full p-1 mb-2 border rounded resize-none"
                                      rows={2}
                                      value={text}
                                      placeholder="Enter content"
                                      onChange={(e) =>
                                        handleSectionContentChange(
                                          item.id,
                                          colIndex,
                                          textIndex,
                                          e.target.value
                                        )
                                      }
                                    />
                                  ))}

                                  <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:underline"
                                    onClick={() =>
                                      addSectionContentLine(item.id, colIndex)
                                    }
                                  >
                                    + Add line
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* For other block types, just show their name */}
                        {![
                          "Text Field",
                          "Image",
                          "Section Grid",
                        ].includes(item.type) && (
                          <div className="text-center font-medium text-gray-600">
                            {item.type}
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Right - Sidebar blocks */}
        <div className="w-[260px] bg-white border rounded-xl p-4 shadow-md h-fit">
          <h3 className="font-semibold text-lg mb-3">Blocks</h3>

          <Droppable droppableId="blocks" isDropDisabled={true}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {blocks.map((block, index) => (
                  <Draggable
                    key={block.id}
                    draggableId={block.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border px-3 py-2 rounded-lg bg-gray-50 cursor-grab text-center font-medium select-none"
                      >
                        {block.label}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}

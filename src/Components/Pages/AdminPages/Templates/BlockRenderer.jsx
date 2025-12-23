import React from "react";

export default function BlockRenderer({ block, blocks, setBlocks }) {
  const update = (key, value) => {
    const updated = blocks.map((b) =>
      b.id === block.id ? { ...b, [key]: value } : b
    );
    setBlocks(updated);
  };
  const updateBlock = (newData) => {
    const updated = blocks.map((b) =>
      b.id === block.id ? { ...b, ...newData } : b
    );
    setBlocks(updated);
  };

  const addChild = (colIndex, type) => {
    const newChild = {
      id: crypto.randomUUID(),
      type,
      content: type === "text" ? "" : "",
      url: "",
      placeholder: type === "input" ? "Enter value" : "",
    };

    const newColumns = [...block.columns];
    newColumns[colIndex] = [...newColumns[colIndex], newChild];

    updateBlock({ columns: newColumns });
  };

  const removeChild = (colIndex, childId) => {
    const newColumns = [...block.columns];
    newColumns[colIndex] = newColumns[colIndex].filter(
      (c) => c.id !== childId
    );
    updateBlock({ columns: newColumns });
  };

  const updateChild = (colIndex, childId, key, value) => {
    const newColumns = [...block.columns];

    newColumns[colIndex] = newColumns[colIndex].map((c) =>
      c.id === childId ? { ...c, [key]: value } : c
    );

    updateBlock({ columns: newColumns });
  };

  if (block.type === "text") {
    const updateStyle = (key, value) => {
      const updated = blocks.map((b) =>
        b.id === block.id
          ? { ...b, style: { ...b.style, [key]: value } }
          : b
      );
      setBlocks(updated);
    };

    return (
      <div className="space-y-3">

        {/* Editable Text */}
        <textarea
          value={block.content}
          placeholder={"Enter text"}
          onChange={(e) =>
            setBlocks(
              blocks.map((b) =>
                b.id === block.id
                  ? { ...b, content: e.target.value }
                  : b
              )
            )
          }
          className="w-full border border-gray-200 p-2 rounded-md"
          style={{
            color: block.style.textColor,
            fontSize: block.style.fontSize,
          }}
        />

        {/* Controls */}
        <div className="flex justify-between items-center gap-3">

          {/* Text Color */}
          <div className="flex justify-between gap-2 items-center">
            <label className="text-sm">Text Color</label>
            <input
              type="color"
              className="w-10 rounded-md-full h-10 cursor-pointer"
              value={block.style.textColor}
              onChange={(e) => updateStyle("textColor", e.target.value)}
            />
          </div>

          {/* Font Size */}
          <div className="col-span-2">
            <label className="text-sm">Font Size</label>
            <input
              type="range"
              min="10"
              max="40"
              value={block.style.fontSize}
              onChange={(e) =>
                updateStyle("fontSize", parseInt(e.target.value))
              }
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              {block.style.fontSize}px
            </p>
          </div>
        </div>
      </div>
    );
  }

  // INPUT
  if (block.type === "input")
    return (
      <input
        className="w-full border p-3 border-gray-200 rounded-md"
        placeholder={block.placeholder}
      />
    );

  // IMAGE
if (block.type === "image")
  return (
    <div>
      {block.url && (
        <img
          src={block.url}
          className="w-full h-48 object-cover rounded-md mb-3"
        />
      )}

      <div className="flex flex-col gap-3">
        {/* Hidden native input */}
        <input
          key={block.id}                         // ✅ force DOM isolation
          id={`fileUpload-${block.id}`}          // ✅ UNIQUE ID
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              update("url", URL.createObjectURL(file));
            }
          }}
        />

        {/* Custom Upload Button */}
        <label
          htmlFor={`fileUpload-${block.id}`}     // ✅ MATCH UNIQUE ID
          className="flex items-center justify-center gap-2 cursor-pointer
            rounded-xl border-2 border-dashed border-gray-300
            px-6 py-4 text-gray-600
            hover:border-blue-500 hover:text-blue-600
            transition-all duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v9m0-9l-3 3m3-3l3 3M12 3v9"
            />
          </svg>

          <span className="text-sm font-medium">
            Click to upload
          </span>
        </label>
      </div>
    </div>
  );

  // BUTTON
  if (block.type === "btn") {
    const updateStyle = (key, value) => {
      const updated = blocks.map((b) =>
        b.id === block.id
          ? { ...b, style: { ...b.style, [key]: value } }
          : b
      );
      setBlocks(updated);
    };

    return (
      <div className="space-y-3">

        {/* Editable Button */}
        <button
          className="px-4 py-2 rounded-md-lg"
          style={{
            backgroundColor: block.style.backgroundColor,
            color: block.style.textColor,
            fontSize: block.style.fontSize,
          }}
        >
          {block.content}
        </button>

        {/* Customization Panel */}
        <div className="grid grid-cols-2 gap-3 text-sm">

          {/* Button Text */}
          <div className="col-span-2">
            <label className="text-xs font-medium">Button Text</label>
            <input
              className="w-full border border-gray-200 rounded-md p-3 mt-1 text-sm"
              placeholder="Enter Button Text here"
              value={block.content}
              onChange={(e) =>
                setBlocks(
                  blocks.map((b) =>
                    b.id === block.id ? { ...b, content: e.target.value } : b
                  )
                )
              }
            />
          </div>

          {/* Background Color */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">BG</label>
            <input
              type="color"
              className="w-10 h-10 rounded-md-full border cursor-pointer"
              value={block.style.backgroundColor}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
            />
          </div>

          {/* Text Color */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Text</label>
            <input
              type="color"
              className="w-10 h-10 rounded-md-full border cursor-pointer"
              value={block.style.textColor}
              onChange={(e) => updateStyle("textColor", e.target.value)}
            />
          </div>

          {/* Font Size */}
          <div className="col-span-2 mt-1">
            <label className="text-xs font-medium">Font Size</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="40"
                value={block.style.fontSize}
                onChange={(e) => updateStyle("fontSize", parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500 w-10">
                {block.style.fontSize}px
              </span>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // SECTION GRID
  if (block.type === "sectionGrid")
    return (
      <div className={`grid gap-4 grid-cols-${block.columns.length}`}>
        {block.columns.map((col, i) => (
          <div key={i} className="border rounded-lg p-3 bg-gray-50 border-gray-200 ">

            {/* Add buttons */}
            <div className="flex gap-2 mb-3">
              <button
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md"
                onClick={() => addChild(i, "text")}
              >
                + Text
              </button>

              <button
                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md"
                onClick={() => addChild(i, "image")}
              >
                + Image
              </button>

            </div>

            {/* Render inside blocks */}
            {col.map((child) => (
              <div key={child.id} className="mb-3 p-2 bg-white border rounded-md relative">

                {/* Delete child button */}
                <button
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-md-full text-xs"
                  onClick={() => removeChild(i, child.id)}
                >
                  ✕
                </button>

                {child.type === "text" && (
                  <textarea
                    className="border p-2 rounded-md w-full"
                    placeholder="Write here"
                    value={child.content}
                    onChange={(e) => updateChild(i, child.id, "content", e.target.value)}
                  />
                )}

                {child.type === "image" && (
                  <div>
                    {child.url && (
                      <img
                        src={child.url}
                        className="w-full h-40 mb-2 rounded-md object-cover"
                      />
                    )}
                    <div className="flex flex-col gap-3">
                      {/* Hidden input */}
                      <input
                        id={`child-file-${child.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateChild(
                              i,
                              child.id,
                              "url",
                              URL.createObjectURL(file)
                            );
                          }
                        }}
                      />

                      {/* Custom upload UI */}
                      <label
                        htmlFor={`child-file-${child.id}`}
                        className="flex items-center justify-center gap-2 cursor-pointer
               rounded-xl border-2 border-dashed border-gray-300
               px-5 py-3 text-gray-600
               hover:border-blue-500 hover:text-blue-600
               transition-all duration-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v9m0-9l-3 3m3-3l3 3M12 3v9"
                          />
                        </svg>

                        <span className="text-sm font-medium">
                          Upload child photo
                        </span>
                      </label>

                  
                    </div>

                  </div>
                )}

                {child.type === "input" && (
                  <input
                    className="border p-2 rounded-md w-full"
                    placeholder={child.placeholder}
                  />
                )}

                {child.type === "btn" && (
                  <button className="bg-black text-white px-3 py-1 rounded-md">
                    {child.content}
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
}

import React, { useState, useCallback, useEffect } from "react";
import { useCommunicationTemplate } from "../contexts/CommunicationContext";

export default function PreviewModal({ mode_of_communication, title, category, tags, sender, message, blocks, onClose, subject }) {
  const { createCommunicationTemplate } = useCommunicationTemplate();

  const [previewData, setPreviewData] = useState({
    subject: subject || "",
    blocks: blocks.map(b => ({ ...b })) // clone to avoid mutating props
  });
  const convertBlobToBase64 = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
    });
  };
const convertNestedImages = async (blocks) => {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Top-level image
    if (block.type === "image" && block.url?.startsWith("blob")) {
      block.url = await convertBlobToBase64(block.url);
    }

    // SectionGrid children
    if (block.type === "sectionGrid" && Array.isArray(block.columns)) {
      for (let ci = 0; ci < block.columns.length; ci++) {
        for (let c = 0; c < block.columns[ci].length; c++) {
          const child = block.columns[ci][c];
          if (child.type === "image" && child.url?.startsWith("blob")) {
            child.url = await convertBlobToBase64(child.url);
          }
        }
      }
    }
  }
  return blocks;
};

  // ✅ Save final preview data
  const handleSavePreview = async () => {

const finalBlocks = await convertNestedImages([...previewData.blocks]);

    // Loop and convert images
    for (let i = 0; i < finalBlocks.length; i++) {
  if (finalBlocks[i].type === "image" && finalBlocks[i].url?.startsWith("blob")) {
    finalBlocks[i].url = await convertBlobToBase64(finalBlocks[i].url);
  }
}
    const Payload = {
      mode_of_communication: mode_of_communication.value,
      title,
      template_category_id:category,
      tags,
    };
    const finalJSON = {
      subject: previewData.subject,
      blocks: finalBlocks
    };
    const mergedPayload = {
  ...Payload,
     content : finalJSON   
};

    createCommunicationTemplate(mergedPayload)
    console.log("✅ Final JSON to Send API:", finalJSON);

    // sending whole preview as one JSON
    onSave?.(finalJSON);  // ✅ parent receives full JSON
  };
  return (

    <div className="pt-10">
      <div className="flex justify-end ">
        <button
          className="mt-5 bg-blue-600 w-full max-w-fit text-right flex justify-right text-white px-4 py-2 rounded-lg"
          onClick={handleSavePreview}
        >
          Save Template
        </button>
      </div>
      <div className="bg-white w-full max-w-full overflow-auto ">

        {/* Header */}

        {/* ✅ Subject (render only once) */}
        {subject && (
          <h1 className="text-2xl font-semibold mb-6">{subject}</h1>
        )}

        {/* Loop blocks */}
        {blocks.map((block, i) => (
          <div key={i} className="mb-5">

            {/* TEXT BLOCK */}
            {block.type === "text" && (
              <p
                style={{
                  color: block.style?.textColor,
                  fontSize: block.style?.fontSize,
                }}
              >
                {block.content}
              </p>
            )}

            {/* INPUT BLOCK */}
            {block.type === "input" && (
              <input
                className="border px-3 py-2 rounded w-full"
                placeholder={block.placeholder}
                value={previewData.blocks[i].content || ""}
                onChange={(e) => {
                  const newState = { ...previewData };
                  newState.blocks[i].content = e.target.value;
                  setPreviewData(newState);
                }}
              />
            )}


            {/* IMAGE BLOCK */}
            {block.type === "image" && (
              <img
                src={block.url}
                className="w-full max-h-100 rounded-lg object-cover"
              />
            )}

            {/* BUTTON BLOCK */}
            {block.type === "btn" && (
              <button
                style={{
                  backgroundColor: block.style?.backgroundColor,
                  color: block.style?.textColor,
                  fontSize: block.style?.fontSize,
                }}
                className="px-4 py-2 rounded"
              >
                {block.content}
              </button>
            )}

            {/* SECTION GRID */}
            {block.type === "sectionGrid" && (
              <div
                className={`grid gap-4 grid-cols-${block.columns.length}`}
              >
                {block.columns.map((col, ci) => (
                  <div key={ci}>
                    {col.map((child) => (
                      <div key={child.id} className="mb-3">

                        {/* CHILD TEXT */}
                        {child.type === "text" && (
                          <p
                            style={{
                              color: child.style?.textColor,
                              fontSize: child.style?.fontSize,
                            }}
                          >
                            {child.content}
                          </p>
                        )}

                        {/* CHILD IMAGE */}
                        {child.type === "image" && (
                          <img
                            src={child.url}
                            className="rounded object-cover"
                          />
                        )}

                        {/* CHILD INPUT */}
                        {child.type === "input" && (
                          <input
                            className="border px-2 py-1 rounded"
                            placeholder={child.placeholder}
                            value={
                              previewData.blocks[i].columns[ci][ci]?.find(
                                (c) => c.id === child.id
                              )?.content || ""
                            }
                            onChange={(e) => {
                              const newState = { ...previewData };
                              const target = newState.blocks[i].columns[ci]
                                .find((c) => c.id === child.id);

                              if (target) target.content = e.target.value;
                              setPreviewData(newState);
                            }}
                          />
                        )}

                        {/* CHILD BUTTON */}
                        {child.type === "btn" && (
                          <button
                            style={{
                              backgroundColor: child.style?.backgroundColor,
                              color: child.style?.textColor,
                              fontSize: child.style?.fontSize,
                            }}
                            className="px-3 py-1 rounded"
                          >
                            {child.content}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

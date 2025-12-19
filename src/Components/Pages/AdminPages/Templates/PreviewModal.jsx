import React, { useState, useCallback, useEffect } from "react";
import { useCommunicationTemplate } from "../contexts/CommunicationContext";
import { useNavigate, useSearchParams } from "react-router-dom";  // ✅ to read URL params

export default function PreviewModal({ mode_of_communication, title, category, tags, sender, message, blocks, onClose, subject, editMode, templateId }) {
  const { createCommunicationTemplate, updateCommunicationTemplate } = useCommunicationTemplate();
    const navigate = useNavigate();

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
  console.log('editMode', editMode)

  // ✅ Save final preview data
 const handleSavePreview = async () => {
    const formData = new FormData();

    const finalBlocks = [...previewData.blocks];

    let imageIndex = 0; // for naming file fields

    const collectImages = async (block) => {
        if (block.type === "image" && block.url?.startsWith("blob")) {
            const response = await fetch(block.url);
            const blob = await response.blob();
            const file = new File([blob], `image_${imageIndex}.png`, { type: blob.type });

            // Append file (binary)
            formData.append("images", file);

            // Replace URL in JSON with placeholder (backend will map index)
            block.url = `__image_${imageIndex}__`;

            imageIndex++;
        }

        // sectionGrid deep images
        if (block.type === "sectionGrid" && Array.isArray(block.columns)) {
            for (let col of block.columns) {
                for (let child of col) {
                    await collectImages(child);
                }
            }
        }
    };

    // Extract all images
    for (let block of finalBlocks) {
        await collectImages(block);
    }

    // Prepare JSON without images
    const contentJSON = JSON.stringify({
        subject: previewData.subject,
        blocks: finalBlocks
    });

    formData.append("mode_of_communication", mode_of_communication.value);
    formData.append("title", title);
    formData.append("template_category_id", category);
    formData.append("tags", JSON.stringify(tags));

    // Append JSON content
    formData.append("content", contentJSON);

    // Now send FormData
    await createCommunicationTemplate(formData);

    navigate('/templates/settingList');
};

  const handleUpdatePreview = async () => {

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
      template_category_id: category,
      tags,
    };
    const finalJSON = {
      subject: previewData.subject,
      blocks: finalBlocks
    };
    const mergedPayload = {
      ...Payload,
      content: finalJSON
    };
  await  updateCommunicationTemplate(templateId , mergedPayload)
        navigate('/templates/settingList');

  };

  return (

    <div className="pt-10">
      <div className="flex justify-end ">
        <button
          className="mt-5 bg-blue-600 w-full max-w-fit text-white px-4 py-2 rounded-lg flex justify-end"
          onClick={editMode ? handleUpdatePreview : handleSavePreview}
        >
          {editMode ? "Update Template" : "Save Template"}
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
  <div className={`grid gap-4 grid-cols-${block.columns.length}`}>
    {block.columns.map((col, ci) => (
      <div key={ci}>
        {col.map((child) => (
          <div key={child.id} className="mb-3">

            {/* TEXT */}
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

            {/* IMAGE */}
            {child.type === "image" && (
              <img
                src={child.url}
                className="rounded object-cover"
              />
            )}

            {/* INPUT */}
            {child.type === "input" && (
              <input
                className="border px-2 py-1 rounded"
                placeholder={child.placeholder}
                value={
                  previewData.blocks[i].columns[ci]
                    ?.find((c) => c.id === child.id)?.content || ""
                }
                onChange={(e) => {
                  setPreviewData((prev) => {
                    const updated = structuredClone(prev);
                    const target = updated.blocks[i].columns[ci]
                      .find((c) => c.id === child.id);

                    if (target) target.content = e.target.value;
                    return updated;
                  });
                }}
              />
            )}

            {/* BUTTON */}
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



// const handleSavePreview = async () => {
//   const formData = new FormData();

//   const finalBlocks = structuredClone(previewData.blocks);
//   let imageIndex = 1; // start from 1 → images_1

//   const collectImages = async (block) => {
//     // IMAGE BLOCK
//     if (block.type === "image" && block.url?.startsWith("blob")) {
//       const response = await fetch(block.url);
//       const blob = await response.blob();

//       const fieldName = `images_${imageIndex}`;
//       const file = new File([blob], `${fieldName}.png`, {
//         type: blob.type,
//       });

//       // ✅ Append with unique key
//       formData.append(fieldName, file);

//       // ✅ Replace url with SAME key
//       block.url = fieldName;

//       imageIndex++;
//     }

//     // SECTION GRID (deep images)
//     if (block.type === "sectionGrid" && Array.isArray(block.columns)) {
//       for (const col of block.columns) {
//         for (const child of col) {
//           await collectImages(child);
//         }
//       }
//     }
//   };

//   // Extract all images
//   for (const block of finalBlocks) {
//     await collectImages(block);
//   }

//   // JSON payload
//   const contentJSON = JSON.stringify({
//     subject: previewData.subject,
//     blocks: finalBlocks,
//   });

//   formData.append("mode_of_communication", mode_of_communication.value);
//   formData.append("title", title);
//   formData.append("template_category_id", category);
//   formData.append("tags", JSON.stringify(tags));
//   formData.append("content", contentJSON);

//   await createCommunicationTemplate(formData);
//   navigate("/templates/settingList");
// };


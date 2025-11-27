export default function PreviewModal({ blocks, onClose, subject }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-8">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-xl overflow-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Preview</h2>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>

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
              />
            )}

            {/* IMAGE BLOCK */}
            {block.type === "image" && (
              <img
                src={block.url}
                className="w-full rounded-lg object-cover"
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

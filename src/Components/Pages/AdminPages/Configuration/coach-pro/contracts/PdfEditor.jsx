"use client";

import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "../../../../../../pdf-worker.jsX";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const PdfEditor = () => {
    const viewerRef = useRef(null);
    const overlayRef = useRef(null);
    const drawCanvasRef = useRef(null);
    const navigate = useNavigate();
    const [selectedPage, setSelectedPage] = useState(1);
    const [thumbnails, setThumbnails] = useState([]);
    const [activeTool, setActiveTool] = useState(null);
    const [pdfPages, setPdfPages] = useState([]);

    const [isDrawing, setIsDrawing] = useState(false);

    // ------------------ LOAD PDF ------------------
    useEffect(() => {
        if (!viewerRef.current || !overlayRef.current) return;

        const loadPDF = async () => {
            const loadingTask = pdfjsLib.getDocument("/sample.pdf");
            const pdf = await loadingTask.promise;

            const main = viewerRef.current;
            const overlay = overlayRef.current;

            main.innerHTML = "";
            overlay.innerHTML = "";

            const pagesArr = [];

            let thumbList = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);

                const viewport = page.getViewport({ scale: 1.4 });

                // ==== MAIN PAGE RENDER ====
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                canvas.className = "shadow-xl mb-6 rounded bg-white";

                if (i === selectedPage) {
                    main.appendChild(canvas);
                    await page.render({ canvasContext: ctx, viewport }).promise;
                }

                // Store page size for overlay positioning
                pagesArr.push({
                    width: viewport.width,
                    height: viewport.height,
                });

                // ==== THUMBNAIL RENDER ====
                const thumbViewport = page.getViewport({ scale: 0.28 });
                const thumbCanvas = document.createElement("canvas");
                const thumbCtx = thumbCanvas.getContext("2d");

                thumbCanvas.width = thumbViewport.width;
                thumbCanvas.height = thumbViewport.height;

                await page.render({
                    canvasContext: thumbCtx,
                    viewport: thumbViewport,
                }).promise;

                thumbList.push({
                    id: i,
                    src: thumbCanvas.toDataURL(),
                });
            }

            setPdfPages(pagesArr);
            setThumbnails(thumbList);

            // Create overlay canvas for drawing
            const drawCanvas = drawCanvasRef.current;
            drawCanvas.width = pagesArr[selectedPage - 1]?.width;
            drawCanvas.height = pagesArr[selectedPage - 1]?.height;
        };

        loadPDF();
    }, [selectedPage]);

    // ------------------ ADD TEXT ------------------
    const addTextBox = () => {
        const overlay = overlayRef.current;

        const div = document.createElement("div");
        div.contentEditable = true;
        div.innerText = "Enter Text";
        div.className =
            "absolute top-10 left-10 bg-yellow-200 px-2 py-1 rounded border cursor-move";

        makeDraggable(div);
        overlay.appendChild(div);
    };

    // ------------------ ADD SHAPE ------------------
    const addRectangle = () => {
        const overlay = overlayRef.current;

        const box = document.createElement("div");
        box.className =
            "absolute top-20 left-20 w-40 h-28 border-2 border-green-600 bg-transparent cursor-move";

        makeDraggable(box);
        overlay.appendChild(box);
    };

    // ------------------ ADD COMMENT ------------------
    const addComment = () => {
        const overlay = overlayRef.current;

        const note = document.createElement("div");
        note.className =
            "absolute top-16 left-16 w-32 p-2 bg-blue-200 rounded shadow cursor-move text-xs";
        note.innerText = "Comment...";

        makeDraggable(note);
        overlay.appendChild(note);
    };

    // ------------------ FREEHAND DRAW ------------------
    const startDrawing = (e) => {
        if (activeTool !== "draw") return;
        setIsDrawing(true);

        const canvas = drawCanvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const canvas = drawCanvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "red";

        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => setIsDrawing(false);

    // ------------------ ADD NEW PAGE ------------------
    const addBlankPage = () => {
        const newPage = {
            width: 900,
            height: 1200,
        };

        setPdfPages([...pdfPages, newPage]);
        setSelectedPage(pdfPages.length + 1);
    };

    // ------------------ Draggable Utility ------------------
    const makeDraggable = (el) => {
        let offsetX = 0,
            offsetY = 0,
            isDown = false;

        el.onmousedown = (e) => {
            isDown = true;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
        };

        el.onmouseup = () => (isDown = false);

        el.onmousemove = (e) => {
            if (!isDown) return;
            el.style.left = e.pageX - viewerRef.current.offsetLeft - offsetX + "px";
            el.style.top = e.pageY - viewerRef.current.offsetTop - offsetY + "px";
        };
    };

    const handleToolClick = (tool) => {
        setActiveTool(tool);

        if (tool === "text") addTextBox();
        if (tool === "shape") addRectangle();
        if (tool === "comment") addComment();
        if (tool === "page") addBlankPage();
    };

    return (
        <div className="mt-3">
            <h2 className="text-xl mb-4 font-semibold flex gap-3 items-center"> <IoArrowBackOutline onClick={() => navigate('/configuration/coach-pro/contracts')} className="cursor-pointer " /> Head Coach Contract</h2>
            <div className="flex  bg-white rounded-2xl p-7 w-full h-screen overflow-hidden ">


                {/* LEFT: PDF VIEWER + EDIT OVERLAY */}
                <div className="relative flex-1 bg-[#636363] p-5 overflow-auto flex justify-center">
                    <div className="relative">
                        <div ref={viewerRef}></div>

                        {/* Overlay for shapes, text, comments */}
                        <div
                            ref={overlayRef}
                            className="absolute top-0 left-0 w-full h-full pointer-events-auto"
                        ></div>

                        {/* Drawing Canvas */}
                        <canvas
                            ref={drawCanvasRef}
                            className="absolute top-0 left-0 pointer-events-auto"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                        />
                    </div>
                    <div className="w-32  bg-[#636363]  p-4 overflow-auto flex flex-col items-center gap-4">
                        {thumbnails.map((thumb) => (
                            <div
                                key={thumb.id}
                                onClick={() => setSelectedPage(thumb.id)}
                                className={`border-2 cursor-pointer rounded-md p-1 ${selectedPage === thumb.id
                                    ? "border-yellow-400"
                                    : "border-transparent"
                                    }`}
                            >
                                <img src={thumb.src} className="w-full rounded" />
                            </div>
                        ))}
                    </div>
                </div>


                {/* RIGHT: TOOLBOX */}
                <div className="w-[200px] bg-white p-6 pe-0 border-l flex flex-col gap-5">
                    <h2 className="text-md font-semibold text-[#282829] mb-2">Edit Options</h2>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleToolClick("shape")}
                            className="w-10 h-10 bg-green-500 rounded-full text-white"
                        >
                            S
                        </button>

                        <button
                            onClick={() => handleToolClick("comment")}
                            className="w-10 h-10 bg-blue-500 rounded-full text-white"
                        >
                            C
                        </button>
                    </div>

                    <div className="flex gap-4 border-t border-[#E2E1E5] pt-3">
                        <button
                            onClick={() => handleToolClick("text")}
                            className="w-10 h-10 bg-yellow-500 rounded-full text-white"
                        >
                            T
                        </button>

                        <button
                            onClick={() => setActiveTool("draw")}
                            className="w-10 h-10 rounded-full"
                        >
                            <img src="/reportsIcons/pencil.png" alt="" />
                        </button>

                        <button
                            onClick={() => handleToolClick("page")}
                            className="w-10 h-10 bg-indigo-300 rounded-full text-white"
                        >
                            <img src="/reportsIcons/calender1.png" alt="" />

                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PdfEditor;

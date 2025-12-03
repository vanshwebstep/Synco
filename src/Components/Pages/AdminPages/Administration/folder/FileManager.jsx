import React from "react";
import {
    Folder,
    Search,
    Plus,
    Upload,
    Download,
    Trash2,
} from "lucide-react";

export default function FileManager() {
    const folders = [
        { name: "Social Media Designs", files: "5 Files", size: "45 MB" },
        { name: "Flyer Templates", files: "7 Files", size: "100 MB" },
    ];

    const files = Array(10).fill({
        name: "DOC_Revision_12.doc",
        date: "7/14/2022 – 1:50 AM",
    });

    return (
        <div className="w-full h-screen  md:p-6 lg:flex gap-6 text-gray-700">

            <div className="lg:w-1/2 bg-white rounded-3xl flex flex-col">

                <div className="md:flex items-center justify-between gap-3 p-5  border-b border-[#E2E1E5]">
                    <div className="flex items-center gap-2">      <img src="/reportsIcons/Folder2.png" className="w-7" alt="" />
                        <h2 className="text-xl font-semibold ">Folders</h2></div>
                    <div className="md:flex items-center gap-2 md:w-9/12">
                        <div className="flex my-3 md:my-0 items-center bg-white border-[#E2E1E5] border rounded-lg px-3 py-2  flex-grow">
                            <Search size={18} className="text-gray-400" />
                            <input
                                placeholder="Search folder "
                                className="ml-2 outline-none flex-grow"
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-[#237FEA] text-sm hover:bg-blue-600 text-white px-4 py-2 rounded-xl">
                            <Plus size={18} />
                            Create New
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4 p-5 ">
                    {folders.map((f, i) => (
                        <div
                            key={i}
                            className="p-4 min-h-[170px] flex flex-col justify-between bg-[#fafafa] border border-[#E2E1E5] rounded-3xl hover:shadow-md transition cursor-pointer"
                        >

                            <div>
                                <img src="/reportsIcons/folder-open.png" className="w-10" alt="" />
                                <h3 className="font-semibold text-[#414141] leading-[22px] mt-2">{f.name}</h3>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-sm text-gray-500">{f.files}</p>
                                <p className="text-sm font-semibold">{f.size}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:w-1/2 mt-4 md:mt-0 bg-white rounded-3xl flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-[#E2E1E5]">
                        <div className="flex items-center gap-2">      <img src="/reportsIcons/folder-2.png" className="w-7" alt="" />
                        <h2 className="text-xl font-semibold ">Files</h2></div>

                    <button className="flex text-sm items-center gap-2 bg-[#237FEA] hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                         <Plus size={18} />
                        Upload File
                    </button>
                </div>


                <div className="flex flex-col gap-3 overflow-auto p-5 ">
                    {files.map((file, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 transition cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-[#E5F1FE] rounded-lg h-12 w-12 flex justify-center items-center">
                                    <img src="/reportsIcons/folder-open.png" className="w-6 m-auto" alt="" />
                                </div>

                                <div>
                                    <p className="font-semibold mb-1">{file.name}</p>
                                    <p className="text-sm text-gray-500">{file.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ">
                                <Download className="cursor-pointer hover:text-[#237FEA]" size={18} />
                                <Trash2 className="cursor-pointer hover:text-red-500" size={18} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

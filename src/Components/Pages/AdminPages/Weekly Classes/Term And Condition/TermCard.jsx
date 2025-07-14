import { useState } from 'react';

const TermCard = ({ item, sessionData }) => {
    const [showSessions, setShowSessions] = useState(false);

    return (
        <div className="bg-white border border-gray-200 rounded-2xl mb-4 shadow hover:shadow-md transition">
            <div className="flex flex-col md:flex-row justify-between p-4 gap-4 text-sm">
                {/* Left block */}
                <div className="min-w-40">
                    <p className="font-semibold whitespace-nowrap">{item.name}</p>
                    <p className="text-xs text-[#717073]">{item.Date}</p>
                </div>

                {/* Term summary & sessions */}
                <div className="flex  gap-8 flex-1">
                    {sessionData.map(({ term, icon, sessions }) => (
                        <div key={term} className="flex flex-col gap-2 min-w-[120px]">
                            {/* Term summary */}
                            <div className="flex items-start gap-3">
                                <img src={icon} alt={term} className="w-5 h-5 mt-1" />
                                <div>
                                    <p className="text-[#717073]">{term}</p>
                                    <p className="font-medium text-[#717073]">{item[term.toLowerCase()]}</p>
                                </div>
                            </div>

                            {/* Sessions inside each column */}
                            <div className={`transition-all duration-500 overflow-hidden ${showSessions ? 'max-h-[1000px]' : 'max-h-0'}`}>
                                <ul className="space-y-1 text-xs mt-1">
                                    {sessions.map((session, i) => (
                                        <li key={i}>
                                            <div className={`flex justify-between  max-w-11/12 m-auto ${i >= 6 ? 'font-semibold' : ''}`}>
                                                <span className='font-semibold'>{session}</span>
                                                <span className="text-[#717073]">Saturday 9th Sep 2025</span>
                                            </div>
                                        </li>
                                    ))}

                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action buttons */}
                <div className={`flex gap-3 mt-2 ${showSessions ? ' items-start' : 'items-center'}  md:mt-0 ml-auto`}>
                    <button className="text-gray-500 hover:text-blue-500">
                        <img className="min-w-5" src="/icons/edit.png" alt="Edit" />
                    </button>
                    <button className="text-gray-500 hover:text-red-500">
                        <img className="min-w-5" src="/icons/deleteIcon.png" alt="Delete" />
                    </button>
                </div>
            </div>

            {/* Toggle sessions */}
            <div
                className="bg-gray-100 px-4 py-2 cursor-pointer"
                onClick={() => setShowSessions(!showSessions)}
            >
                <div className="text-center text-[#237FEA] flex justify-center items-center gap-2">
                    {showSessions ? 'Hide all session dates' : 'Show all session dates'}
                    <img className="w-4" src="/icons/bluearrowup.png" alt="Toggle" />
                </div>
            </div>
        </div>
    );
};

export default TermCard;

import { useState } from 'react';
import { useTermContext } from '../../../contexts/TermDatesSessionContext';
import Swal from "sweetalert2"; // make sure it's installed
import { useNavigate } from 'react-router-dom';

const TermCard = ({ item, sessionData }) => {
    const navigate = useNavigate();

    const [showSessions, setShowSessions] = useState(false);
    const { fetchTermGroup, deleteTermGroup, termGroup, termData, loading } = useTermContext();
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will delete the Term Group.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteTermGroup(id);
                    Swal.fire('Deleted!', 'Term Group has been deleted.', 'success');
                } catch (error) {
                    Swal.fire('Error!', 'Failed to delete Term Group.', 'error');
                }
            }
        });
    };
    const handleEdit = (id) => {
        navigate(`/configuration/weekly-classes/term-dates/Create?id=${id}`)
    };
    console.log('sessionData', sessionData);
    console.log('item', item)
    return (
        <div className="bg-white border border-gray-200 rounded-2xl mb-4 shadow hover:shadow-md transition">
            <div className="flex flex-col md:flex-row justify-between p-4 gap-4 text-sm">
                {/* Left block */}
                <div className="min-w-40">
                    <p className="font-semibold whitespace-nowrap">{item.name}</p>
                    <p className="text-xs text-[#717073]">{item.Date}</p>
                </div>

                {/* Term summary & sessions */}
                <div className="md:flex  gap-8 flex-1">
                    {sessionData.map(({ id, term, icon, date, sessions, sessionDate }) => (
                        <div key={term} className="flex flex-col gap-2 min-w-[120px]">

                            <div className="flex items-start gap-3">
                                <img src={icon} alt={term} className="w-5 h-5 mt-1" />
                                <div>
                                    <p className="text-[#717073]">{term}</p>
                                    <p className="whitespace-pre-line text-sm text-gray-600">{date}</p>

                                    <p className="font-medium text-[#717073]">{item[term?.toLowerCase()]}</p>
                                </div>
                            </div>

                            {/* Sessions inside each column */}
                            <div className={`transition-all duration-500 overflow-hidden ${showSessions ? 'max-h-[1000px]' : 'max-h-0'}`}>
                                <ul className="space-y-1 text-xs mt-1">
                                    {sessions.map((session, i) => (
                                        <li key={i}>
                                            <div className={`flex justify-between max-w-11/12 m-auto ${i >= 6 ? 'font-semibold' : ''}`}>
                                                <span className='font-semibold'>Session {i + 1}: Plan #{session.groupName}</span>
                                                <span className="text-[#717073]">{session.date}</span>
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
                    <button
                        onClick={() => handleEdit(item.id)}
                        className="text-gray-500 hover:text-blue-500">
                        <img className="min-w-5" src="/demo/synco/icons/edit.png" alt="Edit" />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-500 hover:text-red-500"
                    >
                        <img className="min-w-5" src="/demo/synco/icons/deleteIcon.png" alt="Delete" />
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
                    <img className="w-4" src="/demo/synco/icons/bluearrowup.png" alt="Toggle" />
                </div>
            </div>
        </div>
    );
};

export default TermCard;

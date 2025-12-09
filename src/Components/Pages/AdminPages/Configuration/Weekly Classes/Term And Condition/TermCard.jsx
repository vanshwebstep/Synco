import { useState } from 'react';
import { useTermContext } from '../../../contexts/TermDatesSessionContext';
import Swal from "sweetalert2"; // make sure it's installed
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../../../Common/permission';

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
    navigate(`/weekly-classes/term-dates/Create?id=${id}`)
  };
  console.log('sessionData', sessionData);
  console.log('item', item)
  const { checkPermission } = usePermission();

  const canEdit =
    checkPermission({ module: 'term-group', action: 'update' }) &&
    checkPermission({ module: 'term', action: 'update' }) &&
    checkPermission({ module: 'session-plan-group', action: 'view-listing' })

  const canDelete = checkPermission({ module: 'term-group', action: 'delete' }) && checkPermission({ module: 'term', action: 'delete' });;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow hover:shadow-md transition">
      <div className="flex flex-col md:flex-row justify-between p-4 gap-4 text-sm">
        {/* Left block */}
        <div className="flex-shrink-0 w-full md:w-1/12">
          <p className="font-semibold line-clamp-2">{item.name}</p>
          <p className="text-xs text-[#717073]">{item.Date}</p>
        </div>

        {/* Term summary & sessions */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-8 md:w-10/12 overflow-x-auto scrollbar-hide">
          {sessionData.map(({ id, term, icon, date, sessions }) => (
            <div key={term} className="flex-shrink-0 w-full  flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <img src={icon} alt={term} className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[#717073]">{term}</p>
                  <p className="whitespace-pre-line text-sm text-gray-600">{date}</p>
                </div>
              </div>

              {/* Sessions inside each column */}
              <div className={`transition-all duration-500 overflow-hidden ${showSessions ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <ul className="space-y-1 text-xs mt-1">
                  {sessions.map((session, i) => (
                    <li key={i}>
                      <div
                        className={`grid grid-cols-2 items-start ${i >= 6 ? 'font-semibold' : ''
                          }`}
                      >
                        <span className="font-semibold truncate">
                          {`Session ${i + 1}: ${session.groupName || 'No Session Found'}`}
                        </span>
                        <span className="text-[#717073] text-left">{session.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className={`flex gap-3 md:w-1/12 mt-2 md:mt-0 ${showSessions ? 'items-start' : 'items-center'} ml-auto`}>
          {canEdit && (
            <button onClick={() => handleEdit(item.id)} className="text-gray-500 hover:text-blue-500">
              <img className="w-5 h-5" src="/images/icons/edit.png" alt="Edit" />
            </button>
          )}
          {canDelete && (
            <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-500">
              <img className="w-5 h-5" src="/images/icons/deleteIcon.png" alt="Delete" />
            </button>
          )}
        </div>
      </div>

      {/* Toggle sessions */}
      <div className="bg-gray-100 px-4 py-2 cursor-pointer" onClick={() => setShowSessions(!showSessions)}>
        <div className="text-center text-[#237FEA] flex justify-center items-center gap-2">
          {showSessions ? 'Hide all session dates' : 'Show all session dates'}
          <img className={`w-4 transition-transform ${showSessions ? 'rotate-180' : ''}`} src="/images/icons/bluearrowup.png" alt="Toggle" />
        </div>
      </div>
    </div>

  );
};

export default TermCard;

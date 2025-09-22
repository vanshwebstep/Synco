import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Eye, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionPlan } from '../../../contexts/SessionPlanContext';
import Swal from "sweetalert2";
import Loader from '../../../contexts/Loader';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { usePermission } from '../../../Common/permission';

const List = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");

  const navigate = useNavigate();
  const { fetchSessionGroup, sessionGroup, deleteSessionGroup, deleteSessionlevel, loading } = useSessionPlan();
  const [weeks, setWeeks] = useState([]);
  const ageMapping = {
    Beginner: "4-6 Years",
    Intermediate: "6-7 Years",
    Advanced: "8-9 Years",
    Pro: "10-12 Years",
  };
  const [weekList, setWeekList] = useState([]);
  const [tempList, setTempList] = useState([]); // holds the working reorder
  const [reorderMode, setReorderMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const getPackages = async () => {
      try {
        const response = await fetchSessionGroup();
        console.log("Fetched packages:", response);
        // do something with response (set state, display, etc.)
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    getPackages();
  }, [fetchSessionGroup]);
  // with empty conditon 

  useEffect(() => {
    setTempList(weekList); // initialize tempList with server list
  }, [weekList]);
  useEffect(() => {
    if (sessionGroup?.length > 0) {
      const transformedWeeks = sessionGroup
        .map((group) => {
          const levels = typeof group.levels === 'string'
            ? JSON.parse(group.levels)
            : group.levels || {};

          const validLevels = Object.keys(levels).filter((levelKey) => {
            const levelData = levels[levelKey];
            return levelData?.some(item =>
              item.player?.trim() ||
              item.skillOfTheDay?.trim() ||
              item.description?.trim() ||
              (item.sessionExerciseId?.length > 0) ||
              (item.sessionExercises?.length > 0 && Object.keys(item.sessionExercises[0] || {}).length > 0)
            );
          });

          if (validLevels.length === 0) return null;

          const groups = validLevels.map((levelKey, index) => {
            const capitalizedLevel = levelKey.charAt(0).toUpperCase() + levelKey.slice(1);

            // Get first non-empty player
            const levelPlayer = levels[levelKey]
              .map(item => item.player?.trim())
              .find(player => !!player) || ""; // Default to empty string

            return {
              id: index + 1,
              name: capitalizedLevel,
              age: ageMapping[capitalizedLevel] || "N/A",
              player: levelPlayer,
            };
          });

          return {
            id: group.id,
            title: group.groupName,
            groups,
          };
        })
        .filter(Boolean); // remove nulls

      setWeeks(transformedWeeks);
      setWeekList(transformedWeeks);
    }
    else{
      setWeekList([])
      setTempList([])
    }
  }, [sessionGroup]);

  console.log('sessionGroup', sessionGroup)
  // without condition 
  //  useEffect(() => {
  //   if (sessionGroup?.length > 0) {
  //     console.log('sessionGroup', sessionGroup);

  //     const transformedWeeks = sessionGroup.map((group) => {
  //       const levels = typeof group.levels === 'string'
  //         ? JSON.parse(group.levels)
  //         : group.levels || {};

  //       const groups = Object.keys(levels)
  //         .filter((levelKey) => {
  //           const levelData = levels[levelKey];
  //           // Check if *every* object inside the array is fully empty
  //           return levelData.some(item => {
  //             return item.player?.trim() ||
  //               item.skillOfTheDay?.trim() ||
  //               item.description?.trim() ||
  //               (item.sessionExerciseId && item.sessionExerciseId.length > 0) ||
  //               (item.sessionExercises && item.sessionExercises.length > 0 && Object.keys(item.sessionExercises[0]).length > 0);
  //           });
  //         })
  //         .map((levelKey, index) => {
  //           const capitalizedLevel = levelKey.charAt(0).toUpperCase() + levelKey.slice(1);
  //           return {
  //             id: index + 1,
  //             name: capitalizedLevel,
  //             age: ageMapping[capitalizedLevel] || "N/A",
  //           };
  //         });

  //       console.log('groups', groups);

  //       return {
  //         id: group.id,
  //         title: group.groupName,
  //         groups,
  //       };
  //     });

  //     setWeeks(transformedWeeks);
  //     setWeekList(transformedWeeks);
  //   }
  // }, [sessionGroup]);


  const handleAddNew = () => {
    // Logic to reorder sessions
    console.log("Reorder Sessions clicked");
  };

  const handleEditGroup = (weekId, groupId) => {
    navigate(`/configuration/weekly-classes/session-plan-create?id=${weekId}&level=${groupId}`);
  };

  const handleDeleteGroup = (weekId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This group will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSessionGroup(weekId);
        Swal.fire('Deleted!', 'The group has been deleted.', 'success');
      }
    });
  };

  const handleDeleteLevel = (id, level) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This Level will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSessionlevel(id, level);
        Swal.fire('Deleted!', 'The group has been deleted.', 'success');
      }
    });
  };
  const handleAddGroup = (weekId) => {
    // Add group logic here
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    )
  }
  const handleReorder = async (newList) => {
    if (!token) return;

    const orderedIds = newList.map((w) => w.id);
    try {
      await fetch(`${API_BASE_URL}/api/admin/session-plan-group/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderedIds }),
      });
      console.log("Reordered:", orderedIds);
    } catch (err) {
      console.error("Failed to reorder:", err);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newList = Array.from(tempList);
    const [movedItem] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedItem);

    setTempList(newList); // just update local reorder, not server
  };
  const { checkPermission } = usePermission();

  const canCreate = checkPermission({ module: 'session-plan-group', action: 'create' });
  const canEdit = checkPermission({ module: 'session-plan-group', action: 'update' });
  const canDelete = checkPermission({ module: 'session-plan-group', action: 'delete' });

  console.log(weekList)
  return (
    <div className="pt-1 bg-gray-50 min-h-screen">
      <div className="md:flex pe-4 justify-between items-center mb-4 w-full">
        <h2 className="text-[28px] font-semibold">Session Plan Library</h2>

        {reorderMode ? (
          <>
            <div className="flex gap-5 items-center">
              <button
                onClick={() => {
                  handleReorder(tempList); // save reordered list
                  setWeekList(tempList);   // commit changes
                  setReorderMode(false);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 font-semibold"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setTempList(weekList);  // reset back to original order
                  setReorderMode(false);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded-xl hover:bg-gray-500 font-semibold"
              >
                Cancel
              </button>
            </div>
          </>
        ) : weekList.length > 0 ? (
          <button
            onClick={() => setReorderMode(true)}
            className="bg-[#237FEA] flex items-center gap-2 cursor-pointer text-white px-4 py-[10px] rounded-xl hover:bg-blue-700 text-[16px] font-semibold"
          >
            Reorder Sessions
          </button>
        ) :
          (
            <p className="text-red-500 text-[16px] font-medium">
              You don't have any  plans
            </p>
          )}

      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="weekList" direction="horizontal">
          {(provided) => (
            <div
              className="flex bg-white justify-center md:justify-start  flex-wrap rounded-3xl p-6 shadow gap-6 relative"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tempList.map((week, index) => (
                <Draggable
                  key={week.id}
                  draggableId={String(week.id)}
                  index={index}
                  isDragDisabled={!reorderMode}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-gray-100 rounded-2xl p-4 w-full md:min-w-[374px] md:max-w-xs transform ${snapshot.isDragging ? 'scale-105 shadow-xl transition-transform duration-200' : ''
                        }`}
                    >
                      <div className="flex items-center justify-between p-2">
                        <h3 className="font-semibold text-[24px]">{week.title}</h3>
                        {!reorderMode && (
                          <div className="flex gap-2 item-center">
                            <button
                              onClick={() =>
                                navigate(`/configuration/weekly-classes/session-plan-preview?id=${week.id}`)
                              }
                              className="text-gray-700 hover:text-black"
                            >
                              <Eye size={24} />
                            </button>
                            {/* <button
                              onClick={() => handleDeleteGroup(week.id)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <img
                                src="/demo/synco/icons/deleteIcon.png"
                                alt="Delete"
                                className="min-w-6 min-h-6 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                              />
                            </button> */}
                          </div>
                        )}
                      </div>

                      {week.groups.map((group) => (
                        <div
                          key={group.id}
                          className="bg-white border border-gray-300 p-3 mb-2 rounded-xl flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium text-[16px]">{group.name}</p>
                            <p className="text-[14px] text-gray-400">
                              {{
                                Beginner: "4-5 years",
                                Intermediate: "6-7 years",
                                Advanced: "8-9 years",
                                Pro: "10-12 years",
                              }[group.name] || ""}
                            </p>                          </div>
                          <div className="flex gap-2">
                            {canEdit &&
                              <button
                                onClick={() => handleEditGroup(week.id, group.name)}
                                className="text-gray-500 hover:text-blue-600"
                              >
                                <img
                                  src="/demo/synco/icons/edit.png"
                                  alt="Edit"
                                  className="w-6 h-6 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                />
                              </button>
                            }
                            {canDelete &&
                              <button
                                onClick={() => {
                                  if (week.groups?.length === 1) {
                                    handleDeleteGroup(week.id);
                                  } else {
                                    handleDeleteLevel(week.id, group.name);
                                  }
                                }}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <img
                                  src="/demo/synco/icons/deleteIcon.png"
                                  alt="Delete"
                                  className="min-w-6 min-h-6 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                />
                              </button>
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Draggable>
              ))}

              {!reorderMode && canCreate && (
                <div
                  onClick={() => navigate('/configuration/weekly-classes/session-plan-create')}
                  className="border border-dashed border-gray-300 rounded-2xl min-w-[168px] max-w-xs items-center justify-center max-h-[100px] cursor-pointer text-gray-500 hover:text-black p-6 text-center text-[14px] font-semibold"
                >
                  <img
                    src="/demo/synco/members/addblack.png"
                    alt=""
                    className="w-6 h-6 m-auto mb-2"
                  />
                  Add Group
                </div>
              )}


              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default List;

// "use client";

// import { useState, useEffect, useRef } from 'react';
// import { Rnd } from 'react-rnd';

// interface TextObject {
//   id: number;
//   text: string;
//   originalText: string;
//   isEditing: boolean;
//   isDropdownOpen: boolean;
//   isHelpModalOpen: boolean;
//   helpModalType: 'rotate' | 'styleBox' | 'styleText' | null;
//   width: number;
//   height: number;
//   x: number;
//   y: number;
//   rotation: number;
//   backgroundColor: string;
//   borderColor: string;
//   fontSize: number;
//   isBold: boolean;
//   isItalic: boolean;
// }

// const TestRnd = () => {
//   const [textObjects, setTextObjects] = useState<TextObject[]>([]);
//   const [nextId, setNextId] = useState(1);
//   const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
//   const helpModalRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

//   const addTextObject = () => {
//     setTextObjects([
//       ...textObjects,
//       {
//         id: nextId,
//         text: 'New Text',
//         originalText: 'New Text',
//         isEditing: false,
//         isDropdownOpen: false,
//         isHelpModalOpen: false,
//         helpModalType: null,
//         width: 200,
//         height: 100,
//         x: 50,
//         y: 50,
//         rotation: 0,
//         backgroundColor: 'white',
//         borderColor: 'gray',
//         fontSize: 16,
//         isBold: false,
//         isItalic: false,
//       },
//     ]);
//     setNextId(nextId + 1);
//   };

//   const handleEditText = (id: number, newText: string) => {
//     setTextObjects((objs) =>
//       objs.map((obj) =>
//         obj.id === id ? { ...obj, text: newText, isEditing: false } : obj
//       )
//     );
//   };

//   const handleDelete = (id: number) => {
//     setTextObjects((objs) => objs.filter((obj) => obj.id !== id));
//   };

//   const toggleEditMode = (id: number) => {
//     setTextObjects((objs) =>
//       objs.map((obj) =>
//         obj.id === id
//           ? { ...obj, isEditing: !obj.isEditing, isDropdownOpen: false, originalText: obj.text }
//           : obj
//       )
//     );
//   };

//   const toggleDropdown = (id: number) => {
//     setTextObjects((objs) =>
//       objs.map((obj) =>
//         obj.id === id ? { ...obj, isDropdownOpen: !obj.isDropdownOpen } : { ...obj, isDropdownOpen: false }
//       )
//     );
//   };

//   const openHelpModal = (id: number, modalType: 'rotate' | 'styleBox' | 'styleText') => {
//     setTextObjects((objs) =>
//       objs.map((obj) =>
//         obj.id === id
//           ? { ...obj, isDropdownOpen: false, isHelpModalOpen: true, helpModalType: modalType }
//           : obj
//       )
//     );
//   };

//   const closeHelpModal = (id: number) => {
//     setTextObjects((objs) =>
//       objs.map((obj) =>
//         obj.id === id ? { ...obj, isHelpModalOpen: false, helpModalType: null } : obj
//       )
//     );
//   };

//   const handleClickOutside = (event: MouseEvent) => {
//     setTextObjects((objs) =>
//       objs.map((obj) =>
//         dropdownRefs.current[obj.id]?.contains(event.target as Node) ||
//         helpModalRefs.current[obj.id]?.contains(event.target as Node)
//           ? obj
//           : { ...obj, isDropdownOpen: false, isHelpModalOpen: false }
//       )
//     );
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className="min-h-screen p-6 bg-gray-100">
//       <button
//         className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//         onClick={addTextObject}
//       >
//         Add Text
//       </button>
//       <div className="relative">
//         {textObjects.map((obj) => (
//           <Rnd
//             key={obj.id}
//             size={{ width: obj.width, height: obj.height }}
//             position={{ x: obj.x, y: obj.y }}
//             onDragStop={(e, d) => {
//               setTextObjects((objs) =>
//                 objs.map((o) =>
//                   o.id === obj.id ? { ...o, x: d.x, y: d.y } : o
//                 )
//               );
//             }}
//             onResizeStop={(e, direction, ref, delta, position) => {
//               const newWidth = ref.offsetWidth;
//               const newHeight = ref.offsetHeight;
//               setTextObjects((objs) =>
//                 objs.map((o) =>
//                   o.id === obj.id
//                     ? { ...o, width: newWidth, height: newHeight }
//                     : o
//                 )
//               );
//             }}
//             style={{
//               transform: `rotate(${obj.rotation}deg)`,
//               backgroundColor: obj.backgroundColor,
//               borderColor: obj.borderColor,
//               borderStyle: 'solid',
//             }}
//             className="p-4 border border-gray-300 bg-white rounded shadow-md"
//           >
//             <div className="flex justify-between items-center">
//               {!obj.isEditing ? (
//                 <>
//                   <span
//                     className={`whitespace-pre-wrap ${obj.isBold ? 'font-bold' : ''} ${
//                       obj.isItalic ? 'italic' : ''
//                     }`}
//                     style={{ fontSize: `${obj.fontSize}px` }}
//                   >
//                     {obj.text}
//                   </span>
//                   <div
//                     className="relative"
//                     ref={(el) => {
//                       dropdownRefs.current[obj.id] = el;
//                     }}
//                   >
//                     <button
//                       className="cursor-pointer"
//                       onClick={() => toggleDropdown(obj.id)}
//                     >
//                       <span className="text-2xl font-bold">⁝</span>
//                     </button>
//                     {obj.isDropdownOpen && (
//                       <div className="absolute right-0 top-0 mt-2 p-2 w-32 bg-white border border-gray-200 rounded shadow-md">
//                         <button
//                           className="w-full text-left p-1 hover:bg-gray-100"
//                           onClick={() => toggleEditMode(obj.id)}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="w-full text-left p-1 hover:bg-gray-100"
//                           onClick={() => handleDelete(obj.id)}
//                         >
//                           Delete
//                         </button>
//                         <button
//                           className="w-full text-left p-1 hover:bg-gray-100"
//                           onClick={() => openHelpModal(obj.id, 'rotate')}
//                         >
//                           Rotate
//                         </button>
//                         <button
//                           className="w-full text-left p-1 hover:bg-gray-100"
//                           onClick={() => openHelpModal(obj.id, 'styleBox')}
//                         >
//                           Style Box
//                         </button>
//                         <button
//                           className="w-full text-left p-1 hover:bg-gray-100"
//                           onClick={() => openHelpModal(obj.id, 'styleText')}
//                         >
//                           Style Text
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <div>
//                   <textarea
//                     className="border border-gray-300 rounded p-1 resize-none"
//                     value={obj.text}
//                     onChange={(e) =>
//                       setTextObjects((objs) =>
//                         objs.map((o) =>
//                           o.id === obj.id ? { ...o, text: e.target.value } : o
//                         )
//                       )
//                     }
//                     style={{
//                       width: `${obj.width - 30}px`,
//                       height: `${obj.height - 30}px`,
//                     }}
//                     rows={Math.floor((obj.height - 10) / 20)}
//                   />
//                   <div className="flex space-x-2 mt-2">
//                     <button onClick={() => handleEditText(obj.id, obj.text)}>
//                       ✅
//                     </button>
//                     <button
//                       onClick={() =>
//                         setTextObjects((objs) =>
//                           objs.map((o) =>
//                             o.id === obj.id
//                               ? { ...o, text: o.originalText, isEditing: false }
//                               : o
//                           )
//                         )
//                       }
//                     >
//                       ❌
//                     </button>
//                   </div>
//                 </div>
//               )}
  
//               {/* Help Modal */}
//               {obj.isHelpModalOpen && (
//                 <div
//                   ref={(el) => (helpModalRefs.current[obj.id] = el)}
//                   className="absolute z-10 left-10 bottom-24 p-4 bg-white border border-gray-300 shadow-md rounded"
//                 >
//                   {obj.helpModalType === 'rotate' && (
//                     <div>
//                       <label className="block">Rotate Text:</label>
//                       <input
//                         type="range"
//                         min="0"
//                         max="360"
//                         value={obj.rotation}
//                         onChange={(e) =>
//                           setTextObjects((objs) =>
//                             objs.map((o) =>
//                               o.id === obj.id
//                                 ? { ...o, rotation: parseInt(e.target.value) }
//                                 : o
//                             )
//                           )
//                         }
//                       />
//                       <button
//                         className="mt-2 p-1 bg-blue-500 text-white rounded"
//                         onClick={() => closeHelpModal(obj.id)}
//                       >
//                         Done
//                       </button>
//                     </div>
//                   )}
  
//                   {obj.helpModalType === 'styleBox' && (
//                     <div>
//                       <label className="block">Background Color:</label>
//                       <input
//                         type="color"
//                         value={obj.backgroundColor}
//                         onChange={(e) =>
//                           setTextObjects((objs) =>
//                             objs.map((o) =>
//                               o.id === obj.id
//                                 ? { ...o, backgroundColor: e.target.value }
//                                 : o
//                             )
//                           )
//                         }
//                       />
//                       <label className="block mt-2">Border Color:</label>
//                       <input
//                         type="color"
//                         value={obj.borderColor}
//                         onChange={(e) =>
//                           setTextObjects((objs) =>
//                             objs.map((o) =>
//                               o.id === obj.id
//                                 ? { ...o, borderColor: e.target.value }
//                                 : o
//                             )
//                           )
//                         }
//                       />
//                       <button
//                         className="mt-2 p-1 bg-blue-500 text-white rounded"
//                         onClick={() => closeHelpModal(obj.id)}
//                       >
//                         Done
//                       </button>
//                     </div>
//                   )}
  
//                   {obj.helpModalType === 'styleText' && (
//                     <div>
//                       <label className="block">Font Size:</label>
//                       <input
//                         type="number"
//                         min="10"
//                         max="48"
//                         value={obj.fontSize}
//                         onChange={(e) =>
//                           setTextObjects((objs) =>
//                             objs.map((o) =>
//                               o.id === obj.id
//                                 ? { ...o, fontSize: parseInt(e.target.value) }
//                                 : o
//                             )
//                           )
//                         }
//                       />
//                       <div className="mt-2">
//                         <label>
//                           <input
//                             type="checkbox"
//                             checked={obj.isBold}
//                             onChange={() =>
//                               setTextObjects((objs) =>
//                                 objs.map((o) =>
//                                   o.id === obj.id
//                                     ? { ...o, isBold: !o.isBold }
//                                     : o
//                                 )
//                               )
//                             }
//                           />
//                           Bold
//                         </label>
//                         <label className="ml-4">
//                           <input
//                             type="checkbox"
//                             checked={obj.isItalic}
//                             onChange={() =>
//                               setTextObjects((objs) =>
//                                 objs.map((o) =>
//                                   o.id === obj.id
//                                     ? { ...o, isItalic: !o.isItalic }
//                                     : o
//                                 )
//                               )
//                             }
//                           />
//                           Italic
//                         </label>
//                       </div>
//                       <button
//                         className="mt-2 p-1 bg-blue-500 text-white rounded"
//                         onClick={() => closeHelpModal(obj.id)}
//                       >
//                         Done
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </Rnd>
//         ))}
//       </div>
//     </div>
//   );
  
// };

// export default TestRnd;

const ReactRND = () => {
  return (
    <div>ReactRND</div>
  )
}

export default ReactRND
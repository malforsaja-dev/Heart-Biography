"use client";

import AuthLayout from "@/components/AuthLayout";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";

const Profile: React.FC = () => {
  const { user, handleSave } = useUser(); // User and handleSave from context
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempUserName, setTempUserName] = useState(user?.user_name || "");
  const [tempBirthDate, setTempBirthDate] = useState(user?.birth_date || "");

  const startEditing = (field: string) => setEditingField(field);
  const cancelEditing = () => setEditingField(null);

  const saveChanges = () => {
    handleSave({
      userName: tempUserName,
      birthDate: tempBirthDate,
    });
    setEditingField(null); 
  };

  useEffect(() => {
    if (user) {
      setTempUserName(user.user_name || "");
      setTempBirthDate(user.birth_date || "");
    }
  }, [user]);

  return (
    <AuthLayout>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Edit Your Profile</h2>
            <div>
              <label className="block font-medium text-gray-700 mb-2">User Name</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={tempUserName}
                  disabled={editingField !== "userName"}
                  onChange={(e) => setTempUserName(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                {editingField === "userName" ? (
                  <>
                    <button className="ml-2" onClick={saveChanges}>✅</button>
                    <button className="ml-2" onClick={cancelEditing}>❌</button>
                  </>
                ) : (
                  <button className="ml-2" onClick={() => startEditing("userName")}>✏️</button>
                )}
              </div>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Birth Date</label>
              <div className="flex items-center">
                <input
                  type="date"
                  value={tempBirthDate}
                  disabled={editingField !== "birthDate"}
                  onChange={(e) => setTempBirthDate(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                {editingField === "birthDate" ? (
                  <>
                    <button className="ml-2" onClick={saveChanges}>✅</button>
                    <button className="ml-2" onClick={cancelEditing}>❌</button>
                  </>
                ) : (
                  <button className="ml-2" onClick={() => startEditing("birthDate")}>✏️</button>
                )}
              </div>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="p-2 border rounded w-full bg-gray-100"
              />
            </div>
          </div>
        </div>

    </AuthLayout>
  );
};

export default Profile;

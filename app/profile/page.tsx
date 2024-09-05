"use client";

import AuthLayout from "@/components/AuthLayout";
import { useState } from "react";

interface ProfileProps {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  handleSave: (data: { firstName: string; lastName: string; birthDate: string }) => void;
}

const Profile: React.FC<ProfileProps> = ({ firstName, lastName, birthDate, email, handleSave }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempFirstName, setTempFirstName] = useState(firstName);
  const [tempLastName, setTempLastName] = useState(lastName);
  const [tempBirthDate, setTempBirthDate] = useState(birthDate);

  const startEditing = (field: string) => setEditingField(field);
  const cancelEditing = () => setEditingField(null);

  const saveChanges = () => {
    handleSave({
      firstName: tempFirstName,
      lastName: tempLastName,
      birthDate: tempBirthDate,
    });
    setEditingField(null);
  };

  return (
    <AuthLayout>
    <div className="flex items-center justify-center h-screen bg-gray-100 ">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Your Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">First Name</label>
            <div className="flex items-center">
              <input
                type="text"
                value={tempFirstName}
                disabled={editingField !== "firstName"}
                onChange={(e) => setTempFirstName(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              {editingField === "firstName" ? (
                <>
                  <button className="ml-2" onClick={saveChanges}>✅</button>
                  <button className="ml-2" onClick={cancelEditing}>❌</button>
                </>
              ) : (
                <button className="ml-2" onClick={() => startEditing("firstName")}>✏️</button>
              )}
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Last Name</label>
            <div className="flex items-center">
              <input
                type="text"
                value={tempLastName}
                disabled={editingField !== "lastName"}
                onChange={(e) => setTempLastName(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              {editingField === "lastName" ? (
                <>
                  <button className="ml-2" onClick={saveChanges}>✅</button>
                  <button className="ml-2" onClick={cancelEditing}>❌</button>
                </>
              ) : (
                <button className="ml-2" onClick={() => startEditing("lastName")}>✏️</button>
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
              value={email}
              disabled
              className="p-2 border rounded w-full bg-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
    </AuthLayout>
  );
};

export default Profile;

import React from 'react';

interface ProfileProps {
  username: string | null;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ username, onLogout }) => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Profile</h2>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <p className="text-lg text-gray-700">
          Welcome, <span className="font-semibold">{username}</span> 🎉
        </p>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

"use client";

import { useUserPreferences, useCreateUserPreference, useDeleteUserPreference } from "../hooks/api";
import { useState } from "react";

const UsersExample = () => {
  const [newLatitude, setNewLatitude] = useState("");
  const [newLongitude, setNewLongitude] = useState("");
  const [newInterests, setNewInterests] = useState<string[]>([]);

  // Fetch user preferences with React Query
  const { data: userPreferences, isLoading, error, refetch } = useUserPreferences();

  // Mutations
  const createUserPreferenceMutation = useCreateUserPreference();
  const deleteUserPreferenceMutation = useDeleteUserPreference();

  const handleCreateUserPreference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLatitude || !newLongitude) return;

    try {
      await createUserPreferenceMutation.mutateAsync({
        latitude: parseFloat(newLatitude),
        longitude: parseFloat(newLongitude),
        interests: newInterests,
      });
      setNewLatitude("");
      setNewLongitude("");
      setNewInterests([]);
    } catch (error) {
      console.error("Failed to create user preference:", error);
    }
  };

  const handleDeleteUserPreference = async (id: string) => {
    try {
      await deleteUserPreferenceMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete user preference:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading users: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        User Preferences (React Query + Axios Example)
      </h2>

      {/* Create User Preference Form */}
      <form onSubmit={handleCreateUserPreference} className="mb-6 space-y-3">
        <div>
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={newLatitude}
            onChange={(e) => setNewLatitude(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={createUserPreferenceMutation.isPending}
          />
        </div>
        <div>
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={newLongitude}
            onChange={(e) => setNewLongitude(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={createUserPreferenceMutation.isPending}
          />
        </div>
        <button
          type="submit"
          disabled={
            createUserPreferenceMutation.isPending || !newLatitude || !newLongitude
          }
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {createUserPreferenceMutation.isPending ? "Creating..." : "Create User Preference"}
        </button>
      </form>

      {/* User Preferences List */}
      <div className="space-y-2">
        {userPreferences?.map((userPreference) => (
          <div
            key={userPreference.id}
            className="flex justify-between items-center p-3 bg-gray-100 rounded"
          >
            <div>
              <p className="font-semibold">Lat: {userPreference.latitude}, Lng: {userPreference.longitude}</p>
              <p className="text-sm text-gray-600">Interests: {userPreference.interests?.join(", ") || "None"}</p>
            </div>
            <button
              onClick={() => handleDeleteUserPreference(userPreference.id)}
              disabled={deleteUserPreferenceMutation.isPending}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {deleteUserPreferenceMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        )) || <p className="text-gray-500 text-center py-4">No user preferences found</p>}
      </div>

      {/* Refresh Button */}
      <button
        onClick={() => refetch()}
        className="mt-4 w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
      >
        Refresh User Preferences
      </button>
    </div>
  );
};

export default UsersExample;

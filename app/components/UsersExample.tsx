"use client";

import { useUsers, useCreateUser, useDeleteUser } from "../hooks/api";
import { useState } from "react";

const UsersExample = () => {
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  // Fetch users with React Query
  const { data: users, isLoading, error, refetch } = useUsers();

  // Mutations
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    try {
      await createUserMutation.mutateAsync({
        name: newUserName,
        email: newUserEmail,
      });
      setNewUserName("");
      setNewUserEmail("");
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUserMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete user:", error);
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
        Users (React Query + Axios Example)
      </h2>

      {/* Create User Form */}
      <form onSubmit={handleCreateUser} className="mb-6 space-y-3">
        <div>
          <input
            type="text"
            placeholder="Name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={createUserMutation.isPending}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={createUserMutation.isPending}
          />
        </div>
        <button
          type="submit"
          disabled={
            createUserMutation.isPending || !newUserName || !newUserEmail
          }
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {createUserMutation.isPending ? "Creating..." : "Create User"}
        </button>
      </form>

      {/* Users List */}
      <div className="space-y-2">
        {users?.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center p-3 bg-gray-100 rounded"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={() => handleDeleteUser(user.id)}
              disabled={deleteUserMutation.isPending}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        )) || <p className="text-gray-500 text-center py-4">No users found</p>}
      </div>

      {/* Refresh Button */}
      <button
        onClick={() => refetch()}
        className="mt-4 w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
      >
        Refresh Users
      </button>
    </div>
  );
};

export default UsersExample;

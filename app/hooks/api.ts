import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { MapPin } from "@/types/app";

// Example types - replace with your actual data types
interface User {
  id: string;
  name: string;
  email: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
}

interface MapResponse {
  data: MapPin[];
  success?: boolean;
  error?: string;
}

// API functions
const userApi = {
  getUsers: (): Promise<User[]> => api.get("/users"),
  getUser: (id: string): Promise<User> => api.get(`/users/${id}`),
  createUser: (userData: Omit<User, "id">): Promise<User> =>
    api.post("/users", userData),
  updateUser: (id: string, userData: Partial<User>): Promise<User> =>
    api.put(`/users/${id}`, userData),
  deleteUser: (id: string): Promise<void> => api.delete(`/users/${id}`),
};

const postApi = {
  getPosts: (): Promise<Post[]> => api.get("/posts"),
  getPost: (id: string): Promise<Post> => api.get(`/posts/${id}`),
  createPost: (postData: Omit<Post, "id">): Promise<Post> =>
    api.post("/posts", postData),
};

const mapApi = {
  getMapData: (): Promise<MapResponse> => api.get("/map"),
};

// React Query hooks for users
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userApi.getUser(id),
    enabled: !!id, // Only run query if id exists
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) =>
      userApi.updateUser(id, userData),
    onSuccess: (data, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(["users", variables.id], data);
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: (_, id) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: ["users", id] });
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// React Query hooks for posts
export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: postApi.getPosts,
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => postApi.getPost(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// React Query hooks for map
export const useMapData = () => {
  return useQuery({
    queryKey: ["map"],
    queryFn: mapApi.getMapData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

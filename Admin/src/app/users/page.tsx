"use client";

import { useQuery } from "@tanstack/react-query";
import { Mail, UserCircle } from "lucide-react";

const fetchUsers = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/users`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  return data.users;
};

export default function UsersPage() {
  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
  });

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Users</h1>
        <p className="text-white/60 font-sans text-sm uppercase tracking-widest">Manage customer accounts and roles</p>
      </header>
      
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl overflow-x-auto">
        <table className="w-full text-left font-sans">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Name</th>
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Email</th>
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Role</th>
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium text-right">Joined</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3].map((n: any) => (
                <tr key={n} className="border-b border-white/10 animate-pulse">
                  <td className="p-4"><div className="h-4 w-32 bg-white/10 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-48 bg-white/10 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-white/10 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-24 bg-white/10 rounded ml-auto" /></td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-red-400 font-sans tracking-widest text-sm uppercase bg-white/5 rounded-lg m-4">
                  Failed to load users. Ensure you are logged in as admin.
                </td>
              </tr>
            ) : users?.map((user: any) => (
              <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-5 h-5 text-white/60" />
                    <span className="text-white/90 font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-white/60 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs uppercase tracking-widest rounded-full ${user.role === 'admin' ? 'bg-luxury/20 text-luxury' : 'bg-white/10 text-white/60'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-white/60 text-right">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

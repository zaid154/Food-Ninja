import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Constants";

const AdminCustomersPage = (props) => {
  const context = useOutletContext() || {};
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/users`);
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q))
    );
  });

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Registered Customers & Accounts ({filteredUsers.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            View registered user profiles, contact information, and account types
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition"
          />
          <svg className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Quick Summary Chips */}
      <div className="flex items-center gap-3 text-xs">
        <span className="rounded-lg bg-slate-100 border border-slate-200/80 px-3 py-1 font-semibold text-slate-700">
          Total Users: <strong className="text-slate-900">{users.length}</strong>
        </span>
        <span className="rounded-lg bg-emerald-50 border border-emerald-200/80 px-3 py-1 font-semibold text-emerald-800">
          Customers: <strong className="text-emerald-950">{users.filter((u) => u.role !== "admin").length}</strong>
        </span>
        <span className="rounded-lg bg-purple-50 border border-purple-200/80 px-3 py-1 font-semibold text-purple-800">
          Store Admins: <strong className="text-purple-950">{users.filter((u) => u.role === "admin").length}</strong>
        </span>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading customers...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          No registered customer accounts found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3 min-w-[180px]">Customer Name</th>
                <th className="pb-3 min-w-[200px]">Email Address</th>
                <th className="pb-3 min-w-[130px]">Phone Number</th>
                <th className="pb-3 min-w-[90px]">Role</th>
                <th className="pb-3 min-w-[110px]">Joined Date</th>
                <th className="pb-3 text-right pr-2 min-w-[100px]">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isAdmin = u.role === "admin";
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(u.email)}`;

                return (
                  <tr key={u._id || u.email} className="text-slate-700 hover:bg-slate-50/50 transition">
                    <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-xs uppercase border border-slate-200 shrink-0">
                        {u.name ? u.name[0] : "U"}
                      </div>
                      <span>{u.name || "Customer"}</span>
                    </td>
                    <td className="py-3.5 font-mono text-[11px] text-slate-600">{u.email}</td>
                    <td className="py-3.5 font-mono text-[11px] text-slate-600">
                      {u.phone || <span className="text-slate-400 italic">Not provided</span>}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          isAdmin
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200/60"
                        }`}
                      >
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500 text-[11px]">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Recent"}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <a
                        href={gmailUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                        title="Send email to customer"
                      >
                        <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Mail</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;

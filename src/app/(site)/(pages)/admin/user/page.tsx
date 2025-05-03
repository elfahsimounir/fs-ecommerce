"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/Table/DataTable";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useNotification } from "@/hooks/notificationContext";

import FormModal from "@/components/Table/FormModal";
import { Checkbox } from "@/components/ui/checkbox";
import Breadcrumb from "@/components/Common/Breadcrumb";


const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">
      <Checkbox
       checked={row.getIsSelected()}
       onCheckedChange={(value) => row.toggleSelected(!!value)}
       aria-label="Select row"
     />
    </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="text-start">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="text-start">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className="text-start">{row.getValue("role")}</div>,
  },
];

const schema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.string(),
});

const fields = [
  { name: "name", label: "Name", type: "text" as const, placeholder: "Enter user name" },
  { name: "email", label: "Email", type: "text" as const, placeholder: "Enter email" },
  { name: "password", label: "Password", type: "text" as const, placeholder: "Enter password" },
{ 
  name: "role", 
  label: "Role", 
  type: "select" as const, 
  options: [
    { id: "admin", name: "Admin" },
    { id: "user", name: "User" },
  ],
  placeholder: "Select role" 
},
];

export default function UserAdminPage() {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [defaultValues, setDefaultValues] = useState<any>({});
  const [openModal, setOpenModal] = useState(false);
  const { showNotification, showConfirmation } = useNotification();

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const handleSubmit = async (data) => {
    console.log(data);
    const formData = {
      id: defaultValues?.id,
      ...data
    }
    const method = defaultValues?.id ? "PUT" : "POST";

    try {
      const res = await fetch("/api/user", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers((prev) =>
          defaultValues?.id
            ? prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
            : [...prev, updatedUser]
        );
        setOpenModal(false);
        showNotification(
          defaultValues?.id
            ? `User "${updatedUser.name}" updated successfully`
            : `User "${updatedUser.name}" added successfully`,
          "success"
        );
      } else {
        const error = await res.json();
        showNotification(error.message || "An error occurred", "error");
      }
    } catch (err) {
      showNotification("Failed to submit data", "error");
    }
  };

  const handleDelete = async (items) => {
    const confirmed = await new Promise((resolve) => {
      showConfirmation(
        "Are you sure you want to delete the selected users?",
        () => resolve(true),
        () => resolve(false)
      );
    });
    if (!confirmed) return;

    const ids = items.map((item) => item.id).join("&id=");
    try {
      const res = await fetch(`/api/user?id=${ids}`, { method: "DELETE" });

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => !items.some((item) => item.id === user.id)));
        showNotification(
          `Successfully deleted ${items.length} user(s)`,
          "success"
        );
      } else {
        const error = await res.json();
        showNotification(error.message || "Failed to delete users", "error");
      }
    } catch (err) {
      showNotification("An error occurred while deleting users", "error");
    }
  };

  const handleEdit = (user) => {
    setDefaultValues(user);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setDefaultValues({});
    setOpenModal(true);
  };
  const breadcrumb = {
    title: "Manage users",
    pages: ["Admin", "/ users"],
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <Breadcrumb
        title={breadcrumb.title}
        pages={breadcrumb.pages}
      />
      <FormModal
        schema={schema}
        fields={fields as any}
        defaultValues={defaultValues}
        showModal={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        display={openModal}
      />
      <DataTable
        filterKey="name"
        columns={columns}
        data={users}
        onDelete={handleDelete}
        onEdite={handleEdit}
        openModal={handleAdd}
      />
    </div>
  );
}

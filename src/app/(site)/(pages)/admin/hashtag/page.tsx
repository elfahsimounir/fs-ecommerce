"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/Table/DataTable";
import { Schema, z } from "zod";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Breadcrumbs from "@/components/Table/Breadcrumbs";
import FormModal from "@/components/Table/FormModal";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useNotification } from "@/hooks/notificationContext";

const fields: { 
  name: string; 
  label: string; 
  type: "number" | "text" | "select" | "hashtags" | "email" | "file" | "customImages" | "checkbox"; 
  placeholder?: string; 
  options?: { id: string; name: string }[]; 
  style?: string; 
}[] = [
  { name: "name", label: "Name", type: "text", placeholder: "Enter hashtag name" },
  { name: "description", label: "Description", type: "text", placeholder: "Enter description" },
  { name: "image", label: "Image", type: "file", placeholder: "Upload image" },
];

const schema= z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").nonempty("Name is required"),
  description: z.string().optional(),
  image: z.any().optional(),
});
export default function HashtagAdminPage() {
  interface Hashtag {
    id: string;
    name: string;
    description?: string;
    image?: string;
  }
  
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [defaultValues, setDefaultValues] = useState<Partial<Hashtag>>({});
  const [openModal, setOpenModal] = useState(false);
   const { showNotification, showConfirmation } = useNotification();
  useEffect(() => {
    fetch("/api/hashtag")
      .then((res) => res.json())
      .then(setHashtags)
      .catch(console.error);
  }, []);

  const handleSubmit = async (data) => {
    const method = defaultValues?.id ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    if (defaultValues?.id) {
      formData.append("id", defaultValues.id);
    }
    if (data.images && data.images[0]) {
      formData.append("image", data.images[0]);
    }

    try {
      const res = await fetch("/api/hashtag", {
        method,
        body: formData,
      });

      if (res.ok) {
        const updatedHashtag = await res.json();
        setHashtags((prev) =>
          defaultValues?.id
            ? prev.map((tag) => (tag.id === updatedHashtag.id ? updatedHashtag : tag))
            : [...prev, updatedHashtag]
        );
        setOpenModal(false);
        showNotification(
          defaultValues?.id
            ? `Hashtag "${updatedHashtag.name}" updated successfully`
            : `Hashtag "${updatedHashtag.name}" added successfully`,
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
        "Are you sure you want to delete the selected hashtags?",
        () => resolve(true),
        () => resolve(false)
      );
    });
    if (!confirmed) return;

    const ids = items.map((item) => item.id).join("&id=");
    try {
      const res = await fetch(`/api/hashtag?id=${ids}`, { method: "DELETE" });

      if (res.ok) {
        setHashtags((prev) => prev.filter((tag) => !items.some((item) => item.id === tag.id)));
        showNotification(
          `Successfully deleted ${items.length} hashtag(s)`,
          "success"
        );
      } else {
        const error = await res.json();
        showNotification(error.message || "Failed to delete hashtags", "error");
      }
    } catch (err) {
      showNotification("An error occurred while deleting hashtags", "error");
    }
  };

  const handleEdit = (hashtag) => {
    setDefaultValues(hashtag);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setDefaultValues({});
    setOpenModal(true);
  };
  const breadcrumb={
    title: "Manage hashtags",
    pages: [ "Admin", "/ Hashtags"],
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
 <Breadcrumb
  title={breadcrumb.title}
  pages={breadcrumb.pages}
/>
      <FormModal
        schema={schema}
        fields={fields}
        defaultValues={defaultValues}
        showModal={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        display={openModal}
      />
      <DataTable
        filterKey="name"
        columns={[
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
                  checked={row.isSelected}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label={`Select row ${row.id}`}
                />
              </div>
            ),
            enableSorting: false,
            enableHiding: false,
          },
          {
            accessorKey: "name",
            header: ({ column }) => (
             <div className="flex justify-center">
               <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Name
                <ArrowUpDown />
              </Button>
             </div>
            ),
            cell: ({ row }) => <div className="text-centre">{row.getValue("name")}</div>,
          },
          {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => <div>{row.getValue("description")}</div>,
          },
          {
            accessorKey: "image",
            header: <p className="w-full flex justify-center"><span>Image</span> </p>,
            cell: ({ row }) =>
                   row.original.image ? (
                                           <div className="flex justify-center ">
                                            <Image
                                             src={row.original.image as string}
                                             width={44}
                                             height={44}
                                             alt={row.original.name || "image"}
                                             className="h-10 w-15 object-cover"
                                           />
                                           </div>
                                         ) : (
                                           <div className="text-gray-500 text-start">No Image</div>
                                         ),
          },
        ]}
        data={hashtags || []} // Ensure `hashtags` is always an array
        onDelete={handleDelete}
        onEdite={handleEdit}
        openModal={handleAdd}
      />
    </div>
  );
}

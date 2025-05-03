"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { DataTable } from "@/components/Table/DataTable";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Breadcrumbs from "@/components/Table/Breadcrumbs";
import FormModal from "@/components/Table/FormModal";
import { Checkbox } from "@/components/ui/checkbox";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useNotification } from "@/hooks/notificationContext";


const fields = [
  { name: "name", label: "Name", type: "text" as const, placeholder: "Enter category name" },
  { name: "description", label: "Description", type: "text" as const, placeholder: "Enter description" },
  { name: "image", label: "Image", type: "file" as const, placeholder: "Upload image" },
];
const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").nonempty("Name is required"),
  description: z.string().optional(),
  image: z.any().optional(), // Allow any type for the image field
});

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState<{ id: string; name: string; description?: string }[]>([]);
  const [defaultValues, setDefaultValues] = useState<any>({});
  const [openModal, setOpenModal] = useState(false);
  const { showNotification, showConfirmation } = useNotification(); // Destructure showNotification and showConfirmation

  useEffect(() => {
    fetch("/api/category")
      .then((res) => res.json())
      .then(setCategories)
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
      const res = await fetch("/api/category", {
        method,
        body: formData,
      });

      if (res.ok) {
        const updatedCategory = await res.json();
        setCategories((prev) => {
          const categoriesArray = Array.isArray(prev) ? prev : []; // Ensure `prev` is always an array
          return defaultValues?.id
            ? categoriesArray.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
            : [...categoriesArray, updatedCategory];
        });
        setOpenModal(false);
        showNotification(
          defaultValues.id
            ? `Category "${updatedCategory.name}" updated successfully`
            : `Category "${updatedCategory.name}" added successfully`,
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
        "Are you sure you want to delete the selected categories?",
        () => resolve(true),
        () => resolve(false)
      );
    });
    if (!confirmed) return;

    const ids = items.map((item) => item.id).join("&id=");
    console.log("Deleting categories with IDs:", ids); // Debugging log
    try {
      const res = await fetch(`/api/category?id=${ids}`, { method: "DELETE" });

      if (res.ok) {
        setCategories((prev) => prev.filter((cat) => !items.some((item) => item.id === cat.id)));
        showNotification(
          `Successfully deleted ${items.length} category(s)`,
          "success"
        );
      } else {
        const error = await res.json();
        showNotification(error.message || "Failed to delete categories", "error");
      }
    } catch (err) {
      showNotification("An error occurred while deleting categories", "error");
    }
  };

  const handleEdit = (category) => {
    setDefaultValues(category);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setDefaultValues({});
    setOpenModal(true);
  };
  const breadcrumb={
    title: "Manage categories",
    pages: [ "Admin", "/ Categories"],
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
        columns={ [
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
            header: ({ column }) => (
              <div className="text-centre">
                 Description
              </div>
            
            ),
            cell: ({ row }) => <div className="text-centre">{row.getValue("description")}</div>,
          },
          {
            accessorKey: "image",
            header: <p className="w-full flex justify-center"><span>Image</span> </p>,
            cell: ({ row }: { row: any }) =>
              row.original.image ? (
                <div className="flex justify-center ">
                 <Image
                  src={row.original.image as string}
                  width={44}
                  height={54}
                  alt={row.original.name || "image"}
                  className="h-10 w-auto object-cover"
                />
                </div>
              ) : (
                <div className="text-gray-500 text-start">No Image</div>
              ),
          }
        ]}
        data={categories.length>0?categories:[]} // Ensure `categories` is always an array
        onDelete={handleDelete}
        onEdite={handleEdit}
        openModal={handleAdd}
      />
    </div>
  );
}

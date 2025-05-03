"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/Table/DataTable";
import FormModal from "@/components/Table/FormModal";
import { useNotification } from "@/hooks/notificationContext";
import { z } from "zod";
import Image from "next/image";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Breadcrumbs from "@/components/Table/Breadcrumbs";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const dynamic = 'force-dynamic';

type Brand = {
  id: string;
  name: string;
  images: any;
  isSelected?: boolean; // Added isSelected property
};

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").nonempty("Name is required"),
  image: z.any().optional(), // Allow any type for the image field
});
export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [defaultValues, setDefaultValues] = useState<Partial<Brand>>({});
  const [openModal, setOpenModal] = useState(false);
  const { showNotification, showConfirmation } = useNotification();

  useEffect(() => {
    fetch("/api/brand",{ next: { revalidate: 60 } })
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch(console.error);
  }, []);

  const fields = [
    { name: "name", label: "Name", type: "text" as const, placeholder: "Enter brand name" },
    { name: "image", label: "Image", type: "file" as const, placeholder: "Upload brand image" },
  ];
  const handleSubmit = async (data: Brand) => {
    const method = defaultValues.id ? "PUT" : "POST";
    const formData = new FormData();
    formData.append("name", data.name);
    if (defaultValues.id) {
      formData.append("id", defaultValues.id);
    }
    if (data.images && data.images[0]) {
      formData.append("image", data.images[0]);
    }

    try {
      const res = await fetch("/api/brand", {
        method,
        body: formData,
      }
    );

      if (res.ok) {
        const updatedBrand = await res.json();
        setBrands((prev) =>
          defaultValues.id
            ? prev.map((brand) => (brand.id === updatedBrand.id ? updatedBrand : brand))
            : [...prev, updatedBrand]
        );
        setOpenModal(false);
        showNotification(
          defaultValues.id
            ? `Brand "${updatedBrand.name}" updated successfully`
            : `Brand "${updatedBrand.name}" added successfully`,
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

  const handleDelete = async (items: any[]) => {
    const confirmed = await new Promise((resolve) => {
      showConfirmation(
        "Are you sure you want to delete the selected brands?",
        () => resolve(true),
        () => resolve(false)
      );
    });
    if (!confirmed) return;

    const ids = items.map((item) => item.id).join("&id=");
    try {
      const res = await fetch(`/api/brand?id=${ids}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBrands((prev) => prev.filter((brand) => !items.some((item) => item.id === brand.id)));
        showNotification(
          `Successfully deleted ${items.length} brand(s)`,
          "success"
        );
      } else {
        const error = await res.json();
        showNotification(error.message || "Failed to delete brands", "error");
      }
    } catch (err) {
      showNotification("An error occurred while deleting brands", "error");
    }
  };

  const handleEdit = (brand: Brand) => {
    setDefaultValues(brand);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setDefaultValues({});
    setOpenModal(true);
  };
  const breadcrumb={
    title: "Manage brands",
    pages: [ "Admin", "/ Brands"],
  }

  return (
    <div className="container mx-auto p-6">
 <Breadcrumb
  title={breadcrumb.title}
  pages={breadcrumb.pages}
/>
      <div className="flex justify-between mb-4">
      </div>
      <DataTable
        data={brands}
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
            cell: ({ row }) => <div className="lowercase text-centre">{row.getValue("name")}</div>,
          },
          {
            accessorKey: "image",
            header:<p className="flex justify-center"><span>Image</span></p>,
            cell: ({ row }: { row: any }) =>
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
        filterKey="name"
        openModal={handleAdd}
        onDelete={handleDelete}
        onEdite={(brand) => handleEdit(brand)}
      />
      <FormModal
        display={openModal}
        onSubmit={handleSubmit}
        showModal={() => setOpenModal(false)}
        schema={schema}
        fields={fields}
        defaultValues={defaultValues}
      />
    </div>
  );
}

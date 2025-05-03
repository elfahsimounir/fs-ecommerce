"use client";
import { DataTable } from "@/components/Table/DataTable";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { set, z } from "zod";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useNotification } from "@/hooks/notificationContext";
import FormModal from "@/components/Table/FormModal";
import { Checkbox } from "@/components/ui/checkbox";
import Loading from "@/components/ui/loading";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SliceHandler from "@/components/Common/SliceHandler";


// Define the type for the form data
type FormData = {
  id?: string; // Add optional id property
  name: string;
  description: Array<{ id: string; name: string; value: string }>; // Ensure description is an array
  price: number;
  stock: number;
  categoryId: string;
  images: File[] | string[];
  hashtags: string[]; // Ensure hashtags is an array of strings
  brandId: string; // Add brandId to the form data type
  properties: Array<{ id: string; name: string; value: string }>; // Add properties as an array
  rating: number; // Add rating to the form data type
  discount?: number; // Add discount as an optional field
  isNew?: boolean; // Add isNew as an optional field
  isPublished?: boolean; // Add isPublished as an optional field
};

// Define the type for the form configuration
type FormFieldConfig = {
  name: keyof FormData | "properties"; // Allow "properties" as a valid name
  label: string;
  type: "text" | "email" | "select" | "number" | "file" | "custom" | "hashtags"| 'customImages'; // Add "custom" as a valid type
  placeholder?: string;
  options?: any;
  validation?: any; // You can define a more specific type for validation if needed
  style?: string; // You can define a more specific type for style if needed
};

const schema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  categoryId: z.string().nonempty("Category ID is required"),
  images: z.array(z.union([z.instanceof(File), z.string()])).optional(),
  hashtags: z.array(z.string()).optional(),
  // properties: z
  //   .array(z.object({ id: z.string(), name: z.string(), value: z.string() }))
  //   .optional(),
  isNew: z.any().optional(), // Ensure boolean type
  isPublished: z.any().optional(), // Ensure boolean type
  rating: z.any().optional(), // Ensure number type
  discount: z.number().optional(),
  brandId: z.string().nonempty("Brand is required"),
});
const breadcrumb={
  title: "Manage products",
  pages: ["admin /", "product"],
}

const priorities = [
  { id: "1", label: "Processor" },
  { id: "2", label: "RAM" },
  { id: "3", label: "Storage" },
  { id: "4", label: "Screen Size" },
  { id: "5", label: "Battery Life" },
  { id: "6", label: "Camera Quality" },
  { id: "7", label: "Operating System" },
  { id: "8", label: "Graphics Card" },
  { id: "9", label: "Connectivity (5G/Wi-Fi)" },
  { id: "10", label: "Brand" },
  { id: "11", label: "Size" },
  { id: "12", label: "Color" },
  { id: "13", label: "Weight" },
  { id: "14", label: "Material" },
];
export default function ProductPage() {
  const [products, setProducts] = useState<FormData[]>([]);
  const [categoriesx, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [hashtags, setHashtags] = useState<{ id: string; name: string }[]>([]);
  const { showNotification, showConfirmation } = useNotification();
  const [defaultValues, setDefaultValues] = useState<Partial<any>>({});
  const [openModal, setOpenModal] = useState(false);

  const fetchAndFormatProducts = async () => {
    if (categoriesx.length === 0 || brands.length === 0) return;

    try {
      const productsRes = await fetch("/api/product");
      const productsData = await productsRes.json();

      const formattedProducts = productsData.map((product: any) => ({
        ...product,
        category: categoriesx.find(cat => cat.id === product.categoryId)?.name || "Unknown",
        brand: brands.find(brand => brand.id === product.brandId)?.name || "Unknown",
        hashtags: product.hashtags?.map(tag => `#${tag.name}`).join(" ") || "",
        image: product.images?.[0]?.url || "/default-image.jpg"
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchAndFormatProducts();
  }, [categoriesx, brands]); //

  useEffect(() => {
    fetch("/api/category")
    .then((res) => res.json())
    .then(setCategories)
    .catch(console.error);
  
    fetch("/api/brand") // Fetch brands
      .then((res) => res.json())
      .then(setBrands)
      .catch(console.error);

    fetch("/api/hashtag") // Fetch hashtags
      .then((res) => res.json())
      .then(setHashtags)
      .catch(console.error);
  }, []);

  const fields: FormFieldConfig[] = [
    { name: "name", label: "Name", type: "text", placeholder: "Enter product name", style: "col-span-6" },
    { name: "description", label: "Description", type: "text", placeholder: "Enter description", style: "col-span-6" },
    { name: "price", label: "Price", type: "number", placeholder: "Enter price", style: "col-span-4" },
    { name: "discount", label: "Discount", type: "number", placeholder: "Enter discount percentage", style: "col-span-4" },
    { name: "stock", label: "Stock", type: "number", placeholder: "Enter stock quantity", style: "col-span-4" },
    {
      name: "isNew",
      label: "Is New",
      placeholder: "Select",
      type: "select",
      options: [
        { id: "true", name: "Oui" },
        { id: "false", name: "Non" },
      ],
      style: "col-span-3",
    },
    {
      name: "isPublished",
      label: "Is Published",
      placeholder: "Select",
      type: "select",
      options: [
        { id: "true", name: "Oui" },
        { id: "false", name: "Non" },
      ],
      style: "col-span-3",
    },
    {
      name: "rating",
      label: "Rating",
      placeholder: "Select rating",
      type: "select",
      options: [
        { id: "1", name: "Very Low" },
        { id: "2", name: "Low" },
        { id: "3", name: "Medium" },
        { id: "4", name: "High" },
        { id: "5", name: "Very High" },
      ],
      style: "col-span-3",
    },
    { name: "categoryId", label: "Category",  placeholder: "Select Category", type: "select", options: categoriesx, style: "col-span-3" },
    { name: "brandId", label: "Brand",  placeholder: "Select brand", type: "select", options: brands, style: "col-span-3" },
    { name: "images", label: "Images", type: "file", placeholder: "Upload images",    style: "col-span-9", },
    { name: "hashtags", label: "Hashtags", type: "hashtags", placeholder: "Select hashtags" }, // Add hashtags field
    { name: "properties", label: "Properties", type: "custom", placeholder: "Add properties (e.g., size, color)" },
  ];

  const handleSubmit = async (data: any) => {
    const isEdit = !!defaultValues.id;
    const method = isEdit ? "PUT" : "POST";
   console.log('data',data);
    try {
      const validationSchema = z.object({
        id: z.string().optional(),
        name: z.string().nonempty("Name is required"),
        description: z.string().nonempty("Description is required"), // Ensure description is a string
        properties: z.array(z.object({ id: z.string(), name: z.string(), value: z.string() })).optional(),
        price: z.number().positive("Price must be greater than 0"),
        stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
        categoryId: z.string().nonempty("Category ID is required"),
        isNew: z.any().optional(),
        isPublished: z.any().optional(),
        rating: z.number().refine((val) => [1, 2, ,3 ,4 ,5].includes(val), "Invalid rating value"),
        discount: z.number().optional(),
        brandId: z.string().optional(),
        hashtags: z.array(z.string()).optional(),
        images: z
          .any()
          .refine(
            (files) =>
              Array.isArray(files) &&
              files.every((file) => file instanceof File || typeof file === "string"),
            "Images must be an array of files or strings"
          )
          .optional(),
      });
  
      // Parse and validate the data
      const validatedData = validationSchema.parse({
        ...data,
      });
  
      const formData = new FormData();
      Object.entries(validatedData).forEach(([key, value]) => {
        if (value) {
          if (key === "images" && Array.isArray(value)) {
            value.forEach((file) => {
              if (file instanceof File) {
                formData.append(key, file);
              }
            });
          } else if (key === "hashtags" && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (key === "properties") {
            formData.append(key, JSON.stringify(value));
          } else if (key === "isNew" || key === "isPublished") {
            formData.append(key, value === true ? "true" : value === false ? "false" : value as string);
          } else {
            formData.append(key, value as string);
          }
        }
      });
  
      if (isEdit) {
        formData.append("id", defaultValues.id as string);
        formData.append("deletedImages", JSON.stringify(data.deletedImages || []));
        formData.append("mainImage", data.mainImage || "");
      }
  
      console.log("Final form data to submit:", validatedData,'entred data',data);
  
      const res = await fetch("/api/product", {
        method,
        body: formData,
      });
  
      if (!res.ok) {
        const error = await res.json();
        console.error("API error response:", error);
        showNotification(`Failed to save product: ${error.error}`, "error");
        return;
      }
  
      const updatedProduct = await res.json();
  
      // Refresh data after successful submission
      // await fetchData();
  
      showNotification("Product saved successfully", "success");
  
      setOpenModal(false);
      setDefaultValues({});
      await fetchAndFormatProducts(); // Fetch and format products after submission
    } catch (error) {
      console.error("handleSubmit error:", error);
      if (error instanceof z.ZodError) {
        showNotification(error.errors.map((err) => err.message).join(", "), "error");
      } else {
        showNotification("An unexpected error occurred", "error");
      }
    }
  };
  
  const handleDelete = async (items: any[]) => {
    showConfirmation(
      "Are you sure you want to delete this Product?",
      async () => {
        try {
          const ids = items.map((item) => item.id).join('&id='); // Format IDs correctly
          console.log('Formatted IDs for deletion:', ids); // Log formatted IDs
      
          const res = await fetch(`/api/product?id=${ids}`, {
            method: "DELETE",
          });
          if (res.ok) {
            setProducts((prev) => prev.filter((p) => !items.some((item) => item.id === p.id)));
            showNotification("Products deleted successfully", "success");
          } else {
            const error = await res.json();
            console.error('Error response from server:', error); // Log server error
            showNotification(`Failed to delete products: ${error.error}`, "error");
          }
        } catch (error) {
          console.error("Error deleting products:", error); // Log unexpected error
          showNotification("An unexpected error occurred while deleting products", "error");
        }
      },
      () => console.log("Cancelled")
    )
  };
  
  const handleEdit = (product: any) => {
    if (!product) return; // Ensure product exists before proceeding
  
    // Format hashtags as an array of strings
    const formattedHashtags = Array.isArray(product.hashtags)
      ? product.hashtags.map((tag: any) => tag.name) // Extract hashtag names
      : []; // Default to an empty array if hashtags is not an array
  
    // Format images as an array of URLs
    const formattedImages = Array.isArray(product.images)
      ? product.images.map((image: any) => image.url) // Extract image URLs
      : []; // Default to an empty array if images is not an array
  
    // Set the main image, defaulting to the first image if available
    const mainImage = product.image || (formattedImages.length > 0 ? formattedImages[0] : null);
  
    // Prepare default values
    const preparedDefaultValues = {
      ...product,
      hashtags: formattedHashtags, // Set hashtags as an array of strings
      images: formattedImages, // Pass formatted image URLs
      deletedImages: [], // Initialize deletedImages as an empty array
      mainImage, // Set mainImage
    };
  
  
    // Set default values and open the modal
    setDefaultValues(preparedDefaultValues); // Ensure default values are set first
    // setOpenModal(true); // Open the modal after default values are set
  };
  
  const handleAdd = () => {
    setDefaultValues({
      id: "",
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      brandId: "",
      rating: "0",
      discount: 0,
      isNew: false, // Default to false
      isPublished: true, // Default to true
      images: [],
      hashtags: [],
      properties: [],
      reviews: [],
    });
    setOpenModal(true);
  };
  useEffect(() => {
    if (Object.keys(defaultValues).length > 0) {
      setOpenModal(true); // Open the modal after defaultValues are set
    }
  }, [defaultValues]);
  const columns: ColumnDef<FormData>[] = [
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
       <div className="flex justify-start text-start">
         <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown  size={15}/>
        </Button>
       </div>
      ),
      cell: ({ row }) => <div className="lowercase text-start"><SliceHandler maxChar={40} string={row.getValue("name")}/></div>,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
      <div className="flex justify-start text-start">
          <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown  size={15}/>
        </Button>
      </div>
      ),
      cell: ({ row }) => <div className="lowercase text-start"><SliceHandler maxChar={40} string={row.getValue("description")}/></div>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown  size={15}/>
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("price")}</div>,
    },
    {
      accessorKey: "discount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Discount
          <ArrowUpDown  size={15}/>
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("discount")}</div>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ArrowUpDown  size={15}/>
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("stock")}</div>,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown  size={15}/>
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("category")}</div>,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rating
          <ArrowUpDown  size={15}/>
        </Button>
      ),
      cell: ({ row }) => <div>{(row.getValue("rating") as number).toFixed(1)}</div>,
    },
    {
      accessorKey: "hashtags",
      header: "Hashtags",
      cell: ({ row }) => <div>{row.getValue("hashtags")}</div>,
    },
    {
      accessorKey: "isNew",
      header: "New",
      cell: ({ row }) => (
        <div className={`px-2 py-1 rounded-md ${row.getValue("isNew") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {row.getValue("isNew") ?
          <span className="border px-2 tex-xs border-green rounded-full bg-green/5 text-green"> Yes</span>
           :
           <span className="border px-2  text-xs border-red rounded-full bg-red/5 text-red"> No</span>
           }
        </div>
      ),
    },
    {
      accessorKey: "isPublished",
      header: "Published",
      cell: ({ row }) => (
        <div className={`px-2 py-1 rounded-md ${row.getValue("isPublished") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {row.getValue("isPublished") ?
          <span className="border px-2 text-xs border-green rounded-full bg-green/5 text-green"> Yes</span>
           :
           <span className="border px-2  text-xs border-red rounded-full bg-red/5 text-red"> No</span>
           }
        </div>
      ),
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }: { row: any }) =>
        row.original.image ? (
          <div className="flex bg-gray-2 rounded-md justify-center items-center">
             <Image
            src={row.original.image as string}
            width={60}
            height={60}
            alt={row.original.name}
            className="max-h-10 object-cover rounded-md w-full max-w-full"
          />
          </div>
         
        ) : (
          <Loading />
        ),
    },
  ];
  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <Breadcrumb
        title={breadcrumb.title}
        pages={breadcrumb.pages}
      />
      {/* <button onClick={fetchData}>
        formati lqlawi
      </button> */}
      <FormModal
        schema={schema}
        fields={fields.filter((field): field is Omit<FormFieldConfig, "type"> & { type: "text" | "email" | "select" | "number" | "file" } =>field.type !== "custom")}
        defaultValues={defaultValues}
        showModal={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        display={openModal}
        width="max-w-[800px]"
        priorities={priorities} // Pass priorities as a prop
        hashtags={hashtags} // Pass hashtags to the form modal
      />
      <DataTable
        filterKey="name"
        columns={columns}
        data={products || []} // Ensure `products` is always an array
        onDelete={handleDelete}
        onEdite={handleEdit}
        openModal={handleAdd}
      />
    </div>
  );
}

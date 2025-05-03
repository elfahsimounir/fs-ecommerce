"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import DetailsModal from "@/components/ui/Modal";
import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useNotification } from "@/hooks/notificationContext";

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
    accessorKey: "userId",
    header: ({ column }) => (
      <div className="flex justify-center">
             <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        User ID
        <ArrowUpDown />
      </Button>
      </div>
 
    ),
    cell: ({ row }) => <div>{row.getValue("userId") || "Guest"}</div>, // Display "Guest" for null userId
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <div className="flex justify-center"> <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Total
      <ArrowUpDown />
    </Button></div>
     
    ),
    cell: ({ row }) => <div>{row.getValue("total")}</div>,
  },
  {
    accessorKey: "shipping",
    header: ({ column }) => (
      <div className="flex justify-center"><span>Shipping Details</span> </div>
     
    ),
    cell: ({ row }) => {
      const shipping = row.original.shipping || {}; // Ensure `shipping` is defined
      return (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => row.original.showModal("shipping", shipping)}
          >
            <Eye size={17} />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "products",
    header: ({ column }) => (
      <div className="flex justify-center"><span>Products</span> </div>
     
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() =>
            row.original.showModal("products", row.original.products)
          }
        >
          <Eye size={17} />
        </Button>
      </div>
    ),
  },
];

const fetchProductDetails = async (products) => {
  const productIds = products.map((p) => p.productId).join(",");
  const res = await fetch(`/api/product?ids=${productIds}`);
  if (res.ok) {
    const productDetails = await res.json();
    return products
      .map((orderProduct) => {
        const product = productDetails.find(
          (p) => p.id === orderProduct.productId
        );
        if (product) {
          const quantity = orderProduct.quantity || 0;
          const price = product.price || 0;
          const discount = product.discount || 0;
          const subtotal = (price - discount) * quantity; // Calculate subtotal safely
          return { ...product, quantity, subtotal };
        }
        return null;
      })
      .filter(Boolean); // Filter out any unmatched products
  }
  return [];
};

export default function OrderAdminPage() {
  const [orders, setOrders] = useState([]);
  const [modalData, setModalData] = useState<any>(null);
    const { showNotification, showConfirmation } = useNotification();
  const [modalType, setModalType] = useState<"shipping" | "products" | null>(
    null
  );

  useEffect(() => {
    fetch("/api/order")
      .then((res) => res.json())
      .then(async (data) => {
        const ordersWithProducts: any = await Promise.all(
          data.map(async (order) => {
            const productsWithDetails = await fetchProductDetails(
              order.products
            );
            const totalAmount = productsWithDetails.reduce(
              (sum, product) => sum + (product.subtotal || 0), // Ensure subtotal is valid
              0
            );
            return {
              ...order,
              products: productsWithDetails,
              totalAmount,
              showModal: (type, data) => {
                setModalType(type);
                setModalData(data);
              },
            };
          })
        );
        setOrders(ordersWithProducts);
      })
      .catch(console.error);
  }, []);

  const handleDelete = async (items) => {
    showConfirmation(
      "Are you sure you want to delete this employee?",
      async () => {
        const ids = items.map((item) => item.id).join("&id=");
        const res = await fetch(`/api/order?id=${ids}`, { method: "DELETE" });
    
        if (res.ok) {
          showNotification("Order deleted successfully", "success");
          setOrders((prev) =>
            prev.filter((order:any) => !items.some((item) => item.id === order.id))
         
          );
        }
      },
      () => console.log("Cancelled")
    )
  };
  const breadcrumb={
    title: "Manage orders",
    pages: [ "Admin", "/ Orders"],
  }
  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <Breadcrumb
  title={breadcrumb.title}
  pages={breadcrumb.pages}
/>
      <DataTable
        filterKey="userId"
        columns={columns}
        data={orders}
        onDelete={handleDelete}
      />

      {modalType && modalData && (
        <DetailsModal onClose={() => setModalType(null)}>
          {modalType === "shipping" ? (
            <div>
              <h2 className="text-2xl py-2 border-b border-gray-2">
                Shipping Details
              </h2>
              <div className="space-y-2 mt-3">
                {[
                  { label: "Name", value: modalData.fullName },
                  { label: "Address", value: modalData.address },
                  { label: "City", value: modalData.city },
                  { label: "Country", value: modalData.country },
                  { label: "Telephone", value: modalData.telephone },
                  { label: "Email", value: modalData.email },
                ].map((field, index) => (
                  <p key={index} className="text-sm">
                    <span className="pr-2 mr-2 text-gray-6">{field.label}:</span>
                    {field.value}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div>
               <h2 className="text-2xl py-2 border-b border-gray-2">
               Products
              </h2>
              
              {modalData.length > 0 ? (
                <>
                <div className="flex justify-end py-2 text-xs">
              <span className="pr-2 mr-2 text-gray-6">Subtotal :</span>
              </div>
              <div className="gap-2  flex flex-col ">
                  {modalData.map((product, index) => (
                    <div
                      key={index}
                      className="p-2 border border-gray-2 rounded-lg flex justify-between"
                    >
                      <div className="flex bg-gray-2 px-2 items-center rounded-md max-w-20">
                      <Image
                        src={product.images[0]?.url}
                        alt={product.name}
                        width={100}
                        height={100}
                        objectFit="cover"
                        className="rounded-lg"
                      />
                      </div>
                      
                      <div className="flex flex-col text-xs">
                      <p >
                    <span className="pr-2 mr-2 text-gray-6">Title :</span>
                    {product.name}
                  </p>
                      <p >
                    <span className="pr-2 mr-2 text-gray-6">Price :</span>
                    {product.price || 0} DH
                  </p>
                  <p >
                    <span className="pr-2 mr-2 text-gray-6">Discount :</span>
                    {product.discount || 0} DH
                  </p>
                     
                      <p >
                    <span className="pr-2 mr-2 text-gray-6">Quantity :</span>
                    {product.quantity || 0}
                  </p>
                      </div>
                     <div className=" flex items-center">
                     <p className="text-sm flex flex-col">
                    <span>
                    {product.subtotal || 0} DH
                    </span>
                  </p>
                     </div>
                    </div>
                  ))}
                  <div className="mt-4 p-4 border-t flex justify-end">
                    <p className="text-lg flex gap-2">
                    
                      <span className=" text-gray-5">
                      Total Amount:{" "}
                      </span>
                      <span>
                      {modalData.reduce(
                        (sum, product) => sum + (product.subtotal || 0),
                        0
                      )}{" "}
                      DH
                      </span>      
                    </p>
                  </div>
                </div>
                </>
              
              ) : (
                <p className="text-center text-gray-500">No products found.</p>
              )}
            </div>
          )}
        </DetailsModal>
      )}
    </div>
  );
}

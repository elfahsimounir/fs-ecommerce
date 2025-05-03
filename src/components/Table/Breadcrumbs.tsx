"use client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function Breadcrumbs({title,link}:{title:any;link:any}) {
  return (
    <div className="my-5 px-2">
        <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    {title&&
    <>
            <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={link}>{title}</BreadcrumbLink>
        </BreadcrumbItem>
    </>
    }
  </BreadcrumbList>
</Breadcrumb>
    </div>
  );
}

import { Category } from "@/types/category";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";


const SingleItem = ({ item,onClick }: { item: Category;onClick }) => {


  return (
    <button onClick={()=>{
      onClick(item);      
    }} className="group flex flex-col items-center">
      
      {item.image&&
       <div className="max-w-[130px] w-32.5 bg-[#F2F3F8] h-32.5 rounded-full flex items-center justify-center mb-4">
       <Image src={item.image} alt="Category" width={82} height={62} />
     </div>
      }
     

      <div className="flex relative justify-center">
        <h3 className="inline-block pb-1 font-medium text-center text-dark duration-300 ease-in-out">
          {item.name}
        
        </h3>
        <span className="absolute   w-0 group-hover:w-full justify-center ease-in-out duration-300 flex bottom-0 bg-secondary h-[2px]"></span>
      </div>
    </button>
  );
};

export default SingleItem;

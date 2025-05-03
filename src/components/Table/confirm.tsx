"use client"
import { Button } from "@/components/ui/button"
import React from "react"

const Confirm = ({handleCancel,handleConfirm,message}:{handleCancel:any,handleConfirm:any,message:string})=>{

    return(
        <div className="fixed top-0 bg-black/20 left-0 w-full h-full z-50 flex justify-center items-center">
        <div className="rounded-md border bg-white/70 backdrop-blur px-5 py-3 relative">
        <span className=" text-dark text-sm">{message}</span>
        <div className="flex justify-end">
        <div className="flex gap-3 mt-5">
        <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
        <Button variant="default" onClick={handleConfirm}>Confirm</Button>
        </div>
        </div>
        </div> 
      </div> 
    )
}
export default Confirm
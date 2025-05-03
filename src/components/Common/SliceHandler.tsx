"use client"
import { useState } from "react"


const SliceHandler = ({string,maxChar}) => {
     const [open,setOpen] = useState(false)
    return <>
       <span className="flex flex-col ">
        {open ? string : string.length > maxChar ? string.slice(0, maxChar) + "..." : string}
        {string.length > maxChar && <span className="text-dark-3 text-[9px] cursor-pointer" onClick={() => setOpen(!open)}>{open ? "Voi plus" : "Voi mois"}</span>}
       </span>
    </>
}

export default SliceHandler
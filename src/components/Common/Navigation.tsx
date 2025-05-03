import Link from "next/link";

const Navigation= ({ href, children}) => {
    return  <>
     <Link
    href={href}
  >
    <span   className="">
    {children}
    </span>
  </Link>
    </>
}
export default Navigation;
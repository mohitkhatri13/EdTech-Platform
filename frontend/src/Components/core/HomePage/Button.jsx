import React from 'react'
import {Link} from "react-router-dom"

const Button = ({children, active, linkto}) => {
  return (
    <Link to={linkto}>

        <div className={`text-center text-[16px] px-6 py-3 rounded-md font-bold
        ${active ? "bg-yellow-50 text-black  hover:shadow-[0px_0px_3px_0px_rgba(257,257,0,1)] ":" bg-richblack-800 hover:shadow-[0px_0px_3px_0px_rgba(257,257,257,1)]"}
        hover:scale-95 transition-all duration-200
        `}>
            {children}
        </div>

    </Link>
  )
}

export default Button

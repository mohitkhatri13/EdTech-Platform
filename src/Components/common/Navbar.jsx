import React, { useEffect , useState } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoCartOutline } from "react-icons/io5";
import ProfileDropdown from "../core/HomePage/Auth/ProfileDropdown";
// import { apiConnector } from "../../services/apiconnector";
// import { categories } from "../../services/apis";
import { IoIosArrowDown } from "react-icons/io";
const subLinks = [
  {
    title: "python",
    link: "/catalog/python",
  },
  {
    title: "web dev",
    link: "/catalog/web-development",
  },
];

const Navbar = () => {

// const [subLinks , setSubLinks] = useState([]);

// const fetchSublinks = async()=>{
//     try{
//             const result  = await apiConnector("GET" , categories.CATEGORIES_API);
//                 setSubLinks(result.data.data);
//                 console.log("Printing sublinks reault " , result)
//     }
//     catch(error){
//         console.log("Could not fetch the catalog list ")
//     }
//    }
// useEffect(()=>{
//          fetchSublinks();
// } , [])



const {token} = useSelector((state)=>state.auth);
const {user} = useSelector((state)=>state.profile);
const{totalItems} = useSelector((state)=>state.cart)



  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  return (
    <div className="flex h-14 items-center justify-center border-b-2 border-b-richblack-500">
      <div className="w-11/12 flex max-w-maxContent items-center justify-between">
        <Link to="/">
          <img className="w-[150px]" src={logo}></img>{" "}
        </Link>
        {/* nav links */}
        <nav >
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="flex items-center gap-1 group relative">  
                    <p>{link.title}</p>
                    <IoIosArrowDown />

                    <div className=" z-20 invisible opacity-0 flex absolute top-[50%]  left-[50%] translate-x-[-70px] translate-y-[20px] flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                     transition-all duration-200  lg:w-[200px] sm:w-[100px] group-hover:opacity-100 group-hover:visible">
                    
                    <div className="  flex z-19 absolute top-[-2px] left-[50%] translate-x-[-14px] z-200 h-2 w-2 flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                       rotate-45 ">
                    </div>
                    {
                        subLinks.length ? (
                            subLinks.map((subLink , index)=>(
                               <Link to={`${subLink.link}`} key={index}>
                                <p>{subLink.title}</p>
                               
                               </Link> 
                            ))
                        ):(<div></div>)
                    }
                  </div>
                  </div>

                ) : (
                  <div>
                    <Link to={link?.path}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* login signup dashboard */}
        <div className="flex gap-x-4 items-center">
                  {
                 user && user?.accountType!= "Instructor" && (
                    <Link to="/dashboard/cart" className="relative">
                        <IoCartOutline />
                        {
                            totalItems>0 && (
                                <span>
                                    {totalItems}
                                </span>
                            )
                        }
                    </Link>
                 )}
                 {
                    token===null  && (
                        <Link to="/login">
                        <button className="border border-richblack-700 bg-richblack-800 text-richblack-25 p-1 px-4 rounded-md  hover:scale-95">Login</button>
                        </Link>
                    )
                 }

{
                    token===null  && (
                        <Link to="/signup">
                        <button  className="border border-richblack-700 bg-richblack-800 text-richblack-25 p-1 px-4 rounded-md  hover:scale-95">Sign-up</button>
                        </Link>
                    )
                 }

                 {
                    token!==null && <ProfileDropdown/>
                 }
                 
            
        </div>
      </div>
    </div>
  );
};

export default Navbar;

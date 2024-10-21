// import React, { useEffect, useState } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileDropdown from "../core/HomePage/Auth/ProfileDropdown";
import { useState, useEffect } from "react";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [subLinks, setSubLinks] = useState([]);
  const [toggleMenu, setToggleMenu] = useState(false);

  
  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(result?.data?.allCategories);

      console.log("Printing sublinks result ", result?.data?.allCategories);

      // console.log("Printing sublinks result ", result?.data?.allCategories);

    } catch (error) {
      console.log("Could not fetch the catalog list ");
    }
  };
  useEffect(() => {
    fetchSublinks();
  }, []);

  const closeMenu = () => {
    setToggleMenu(false);
  };

  const location = useLocation();
  // for path matching to color change
  const matchRoute = (route) => {
    // location.pathname  return - /about/more/...
    //  to retrive only about use split method here not needed because path is single
    return matchPath({ path: route }, location.pathname);
  };
  return (
    <div className="flex h-14 items-center justify-center border-b-2 border-b-richblack-500">
      <div className="w-11/12 flex max-w-maxContent items-center justify-between">
        <Link to="/">
          <img className="w-[150px]" alt="" src={logo}></img>{" "}
        </Link>
        {/* nav links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="flex items-center gap-1 group relative">
                    <p>{link.title}</p>
                    <IoIosArrowDown />

                    <div
                      className=" z-20 invisible opacity-0 flex absolute top-[50%]  left-[50%] translate-x-[-70px] lg:translate-y-[20px] flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                     transition-all duration-200  w-[200px] scale-75  lg:scale-100 group-hover:opacity-100 group-hover:visible"
                    >
                      <div
                        className=" z-[-10] flex z-19 absolute top-[-2px] left-[50%] translate-x-[-14px] z-200 h-2 w-2 flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                       rotate-45"
                      ></div>
                      {Array.isArray(subLinks) && subLinks.length ? (
                        subLinks.map((subLink, i) => (
                          <Link
                            to={`/catalog/${subLink.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()}`}
                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                            key={i}
                          >
                            <p className="text-sm lg:text-[1rem]">
                              {subLink.name}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <div></div>
                      )}
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
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100 mt-3" />
              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="border border-richblack-700 bg-richblack-800 text-richblack-25 p-1 px-4 rounded-md  hover:scale-95">
                Login
              </button>
            </Link>
          )}

          {token === null && (
            <Link to="/signup">
              <button className="border border-richblack-700 bg-richblack-800 text-richblack-25 p-1 px-4 rounded-md  hover:scale-95">
                Sign-up
              </button>
            </Link>
          )}

          {token !== null && <ProfileDropdown />}
        </div>
        {!toggleMenu && (
          <AiOutlineMenu
            fontSize={24}
            fill="#AFB2BF"
            className=" block md:hidden text-xl cursor-pointer "
            onClick={() => setToggleMenu(!toggleMenu)}
          />
        )}

        {toggleMenu && (
          <div className="fixed top-0 right-0 w-[33%] h-[100vh] backdrop-blur-2xl bg-[#fffefc44]  flex flex-col items-center  z-50  md:hidden ">
            <RxCross1
              onClick={closeMenu}
              className="absolute top-4 left-1 cursor-pointer"
            />
            <ul className="flex flex-col text-richblack-800 mt-10 text-xl gap-y-4">
              {NavbarLinks.map((link, index) => (
                <li key={index} onClick={closeMenu}>
                  {link.title === "Catalog" ? (
                    <div className="flex items-center gap-1 group relative">
                      <p>{link.title}</p>
                      <IoIosArrowDown />

                      <div
                        className=" z-20 invisible opacity-0 flex absolute top-[50%]  left-[50%] translate-x-[-70px] lg:translate-y-[20px] flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                     transition-all duration-200  w-[200px] scale-75  lg:scale-100 group-hover:opacity-100 group-hover:visible"
                      >
                        <div
                          className=" z-[-10] flex z-19 absolute top-[-2px] left-[50%] translate-x-[-14px] z-200 h-2 w-2 flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                       rotate-45 "
                        ></div>
                        {Array.isArray(subLinks) && subLinks.length ? (
                          subLinks.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                              key={i}
                            >
                              <p className="text-sm lg:text-[1rem]">
                                {subLink.name}
                              </p>
                            </Link>
                          ))
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Link to={link?.path}>
                        <p
                          className={`${
                            matchRoute(link?.path)
                              ? "text-yellow-25"
                              : "text-richblack-800"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

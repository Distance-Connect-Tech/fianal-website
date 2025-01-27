"use client"

import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setShowNavbar(false); // Hide the navbar when scrolling down
    } else {
      setShowNavbar(true); // Show the navbar when scrolling up
    }
    setLastScrollY(window.scrollY); // Update the last scroll position
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup on component unmount
  }, [lastScrollY]);

  return (
    <div
      className={`w-[80%] flex items-center m-auto my-8 h-[68px] rounded-[50px] bg-[#9FBAF1] justify-between pr-6 pl-4 fixed transition-transform duration-300 ${
        showNavbar ? ' transform translate-y-[60px] ' : 'transform -translate-y-[100px] '
      }`}
    >
      <div className="flex gap-2 justify-center items-center">
        <img src="/logo.png" alt="logo" className="w-[35px] h-[37px] m-auto" />
        <div className="cursor-pointer text-white font-inter text-[17px] font-bold leading-[24px] tracking-[0.17px]">
          Distance Connect
        </div>
      </div>
      <div className="text-white font-inter text-[16px] font-medium leading-normal flex gap-4 justify-center items-center">
        <div className="cursor-pointer">Solutions</div>
        <div>Resources</div>
        <div>Pricing</div>
        <div>Contact Us</div>
      </div>
      <div className="flex gap-4 justify-center items-center">
        <button className="flex w-[134px] h-[41px] flex-col justify-center items-center gap-[12px] flex-shrink-0 rounded-[25px] border-[0.5px] border-[rgba(94,127,203,0.6)] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.08)] text-[#3D568F] font-roboto text-[16px] font-medium leading-[24px] bg-white">
          Login
        </button>
        <button className="flex w-[134px] h-[41px] flex-col justify-center items-center gap-[12px] flex-shrink-0 rounded-[25px] border-[0.5px] border-[rgba(94,127,203,0.6)] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.08)] text-[#3D568F] font-roboto text-[16px] font-medium leading-[24px] ">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Navbar;

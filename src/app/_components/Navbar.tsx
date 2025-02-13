"use client"

import { User } from '@prisma/client';
import { CircleHelp } from 'lucide-react';
import { Headphones } from 'lucide-react';
import { Settings } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
const  Navbar = ({loggedId} : {loggedId: boolean}) => {
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
    <div className='w-full m-auto'>
      {/* Mobile nav */}
      <div className='flex w-full relative  lg:hidden justify-between items-center h-[55px] p-6 bg-white shadow-[0px_1px_3.7px_0px_rgba(0,0,0,0.10)] '>
        <Sheet>
        <div className='flex gap-2 justify-center items-center'> 
          <img src="/logo.png" alt="logo" className="w-[35px] h-[37px] m-auto" />
          <div className='text-black text-center mt-1 font-inter text-[15px] font-semibold leading-normal' >
            Distance Connect
          </div>
          <div>
          </div>
        </div>
        <SheetTrigger>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="18" viewBox="0 0 26 18" fill="none">
  <line x1="24.0713" y1="1" x2="1.00029" y2="0.999998" stroke="#3D568F" strokeWidth="2" strokeLinecap="round"/>
  <line x1="24.0713" y1="8.87158" x2="1.00029" y2="8.87158" stroke="#3D568F" strokeWidth="2" strokeLinecap="round"/>
  <line x1="24.0713" y1="16.6738" x2="1.00029" y2="16.6738" stroke="#3D568F" strokeWidth="2" strokeLinecap="round"/>
  </svg>
        </SheetTrigger>
        <SheetContent>
    <SheetHeader className=' h-full'>
      <SheetTitle className='hidden'>
        hello
      </SheetTitle>

      <div className='flex flex-col gap-4 justify-between h-full '>
        <div className='flex flex-col  text-left  gap-4 justify-start items-center mt-4'>
          <div className='text-[#5D5A88] mt-2 w-full text-[18px] font-normal leading-[18px] '>Home</div>
          <div className='text-[#5D5A88] mt-2 w-full text-[18px] font-normal leading-[18px] '>About</div>
          <div className='text-[#5D5A88] mt-2 w-full text-[18px] font-normal leading-[18px] '>Blog</div>
          <div className='text-[#5D5A88] mt-2 w-full text-[18px] font-normal leading-[18px] '>Use Cases</div>
          <div className='text-[#5D5A88] mt-2 w-full text-[18px] font-normal leading-[18px] '>Pricing</div>
          <div className='text-[#5D5A88] mt-2 w-full text-[18px] font-normal leading-[18px] '>Contact</div>
        </div>
        <div className='flex flex-col gap-16'>
          <div className='flex flex-col gap-6'>
          <div className='text-[#5D5A88] flex  items-center gap-2 text-[16px] font-medium leading-[16px]'><CircleHelp /> <span >FAQs</span></div>
          <div className='text-[#5D5A88] flex  items-center gap-2 text-[16px] font-medium leading-[16px]'><Headphones /> <span >Support</span></div>
          <div className='text-[#5D5A88] flex  items-center gap-2 text-[16px] font-medium leading-[16px]'><Settings /> <span >Settings</span></div>

          </div>
          <div className='flex gap-4 justify-center flex-col items-center'>
            <button className='flex items-center justify-center w-[199px] p-[18px_22px] gap-1 rounded-lg border border-[#E1E4ED] bg-[#F8FAFF]'>
              Login
            </button>
            <button className='flex text-white items-center justify-center w-[199px] p-[18px_22px] gap-1 rounded-lg bg-[#6D758F] shadow-md'>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </SheetHeader>
  </SheetContent>

        </Sheet>
         
      </div>
    {/* md --> ipad air vertical
    lg-->ipad pro vertical
    xl--> desktop */}



    <div
      className={`w-[80%] z-[200] hidden lg:flex left-[50%] translate-x-[-50%] items-center m-auto  h-[68px] rounded-[50px] bg-[#9FBAF1] justify-between pr-6 pl-4 fixed transition-transform duration-300 ${
        showNavbar ? ' transform translate-y-[60px] ' : 'transform -translate-y-[100px] '
      }`}
    >
      <div className="flex gap-2 justify-center items-center">
        <img src="/logo.png" alt="logo" className="w-[35px] h-[37px] m-auto" />
        <div className="cursor-pointer text-white font-inter lg:text-[14px] xl:text-[17px] font-bold leading-[24px] tracking-[0.17px]">
          Distance Connect
        </div>
      </div>
      <div className="text-white font-inter lg:text-[12px] xl:text-[16px] font-medium leading-normal flex lg:gap-4 xl:gap-8 justify-center items-center">
        <div className="cursor-pointer">Solutions</div>
        <div>Resources</div>
        <div>Pricing</div>
        <div>Contact Us</div>
      </div>
      {!loggedId ? 
        <div className="flex gap-4 justify-center items-center">
        <a href='/auth/login' className="flex lg:w-[100px] xl:w-[134px] h-[41px] flex-col justify-center items-center gap-[12px] flex-shrink-0 rounded-[25px] border-[0.5px] border-[rgba(94,127,203,0.6)] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.08)] text-[#3D568F] font-roboto text-[16px] font-medium leading-[24px] bg-white">
          Login
        </a>
        <a href="/auth/login?screen_hint=signup" className="flex lg:w-[100px] xl:w-[134px] h-[41px] flex-col justify-center items-center gap-[12px] flex-shrink-0 rounded-[25px] border-[0.5px] border-[rgba(94,127,203,0.6)] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.08)] text-[#3D568F] font-roboto text-[16px] font-medium leading-[24px] ">
         Sign Up
        </a>
      </div>
      :
      <div className="flex gap-4 justify-center items-center">
        <a href='/auth/logout' className="flex lg:w-[100px] xl:w-[134px] h-[41px] flex-col justify-center items-center gap-[12px] flex-shrink-0 rounded-[25px] border-[0.5px] border-[rgba(94,127,203,0.6)] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.08)] text-[#3D568F] font-roboto text-[16px] font-medium leading-[24px] bg-white">
          Logout
        </a>
        
      </div>
      }
    </div>

    </div>
  );
};

export default Navbar;

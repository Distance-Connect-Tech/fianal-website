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

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons" 
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import Link from 'next/link';
const  Navbar = ({loggedId, blogs}  : {loggedId: boolean, blogs: any}) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  //get only top 4 blogs
  const top4Blogs = blogs?.slice(0, 4);
  const components = top4Blogs?.map((blog: any) => ({
    title: blog?.fields?.title,
    href: `/blog/${blog?.fields?.slug}`,
    description: blog?.fields?.shortDescription,
    imageUrl: blog?.fields?.featuredImage?.fields?.file?.url,
    imageAlt: blog?.fields?.featuredImage?.fields?.title,
  }));

  console.log(blogs)


  console.log(components)

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
      <div className='flex w-full  relative  lg:hidden justify-between items-center h-[55px] p-6 bg-white shadow-[0px_1px_3.7px_0px_rgba(0,0,0,0.10)] '>
        <Sheet>
        <Link href="/" className='flex gap-2 justify-center items-center'> 
          <img src="/logo.png" alt="logo" className="w-[35px] h-[37px] m-auto" />
          <div className='text-black text-center mt-1 font-inter text-[15px] font-semibold leading-normal' >
            Distance Connect
          </div>
          <div>
          </div>
        </Link>
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
          <Link href="/blog" className='text-[#5D5A88] mt-2 w-full text-[18px] font-normal leading-[18px] '>Resources</Link>
          <div className='text-[#5D5A88] mt-2 w-full text-[18px] font-normal leading-[18px] '>Use Cases</div>
          <div className='text-[#5D5A88] mt-2 w-full text-[18px] font-normal leading-[18px] '>Pricing</div>
          <Link href="/contact-us" className='text-[#5D5A88] mt-2 w-full text-[18px] font-normal leading-[18px] '>Contact</Link>
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
      className={`w-[80%] shadow-md z-[200] hidden lg:flex left-[50%] translate-x-[-50%] items-center m-auto  h-[68px] rounded-[50px] bg-[#9FBAF1] justify-between pr-6 pl-4 fixed transition-transform duration-300 ${
        showNavbar ? ' transform translate-y-[30px] ' : 'transform -translate-y-[100px] '
      }`}
    >
      <div className="flex gap-2 justify-center items-center">
        <img src="/logo.png" alt="logo" className="w-[35px] h-[37px] m-auto" />
        <div className="cursor-pointer text-white font-inter lg:text-[14px] xl:text-[17px] font-bold leading-[24px] tracking-[0.17px]">
          Distance Connect
        </div>
      </div>
      <div className="text-white font-inter lg:text-[12px] xl:text-[16px] font-medium leading-normal flex lg:gap-4 xl:gap-8 justify-center items-center">
        {/* <div className="cursor-pointer">Solutions</div>
        <Link href="/blog" className='cursor-pointer'>Resources</Link>
        <div>Pricing</div>
        <Link href="/contact-us" className='cursor-pointer'>Contact Us</Link> */}
           <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className=''>
          <NavigationMenuTrigger >Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <img src="/logo.png" alt="logo" className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                    Solutions offered
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Startups">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Mentors">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Students">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component : any) => (
                <ListItem
                  key={component.title}
                  // title={component.title}
                  href={component.href}
                >
                  <div className='flex gap-2 items-start'>
                   
                    <img src={component.imageUrl} alt={component.imageAlt} className="w-[60px] mt-2 h-[60px] rounded-md" />
                  <div>
                  <div className='text-black text-[14px] font-medium leading-[24px]'>
                      {component.title}
                    </div>
                    {component.description}
                  </div>
                  </div>
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/contact-us" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Contact Us
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
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

 
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
})

ListItem.displayName = "ListItem";
export default Navbar;

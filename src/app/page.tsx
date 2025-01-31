
import {  api, HydrateClient } from "@/trpc/server";
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";
import LogoStrip from "./_components/LogoStrip";


export default async function Home() {
  const {getUser} = getKindeServerSession();
  const user = await getUser();
  // console.log(user)

    if(user){
      const dbUser  = await api.user.checkUser({ kindeId: user.id })
      console.log("DB User")

      if(dbUser){  
        if(!dbUser.isRegistered){
          console.log("User is not registered")
          return redirect("/register");
        }
      }
    }
  



  return (

    <div className="h-[3000px] relative">
      <img src="/bg.png" alt="bg" className="absolute top-0 right-[0] "/>

    <HydrateClient>
      <div className="w-full flex justify-center items-center relative">

      <Navbar/>
      </div>

      <LoginLink postLoginRedirectURL="http://localhost:3000/sync-user-to-db">Sign In</LoginLink>

      <HeroSection/>
      <LogoStrip/>
        
    
    </HydrateClient>
    </div>
  );
}

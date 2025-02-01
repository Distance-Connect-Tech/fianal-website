import { auth0 } from "@/lib/auth0";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";
import LogoStrip from "./_components/LogoStrip";

export default async function Home() {

  // Fetch the user session
  const session = await auth0.getSession();
  const user = session?.user;
  let loggedId = false;
  

      if(user){

      const dbUser  = await api.user.checkUser({ kindeId: user?.sub! })
      console.log("DB User", dbUser)
      
      if(dbUser){ 
        loggedId = true; 
        if(!dbUser.isRegistered){
          console.log("User is not registered")
          return redirect("/register");
        }
      }else{
        return redirect("/sync-user-to-db");
      }
    }





    


    return (

    <div className="h-[3000px] relative">
      <img src="/bg.png" alt="bg" className="absolute top-0 right-[0] "/>

      <div className="w-full flex justify-center items-center relative">

      <Navbar loggedId={loggedId}/>
      </div>

      <HeroSection/>
      <LogoStrip/>
        
    
    </div>
  );
}

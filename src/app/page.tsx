import { auth0 } from "@/lib/auth0";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";
import LogoStrip from "./_components/LogoStrip";
import KeyBenefits from "./_components/KeyBenefits";
import Solutions from "./_components/Solutions";
import Guide from "./_components/Guide";
import FeatureMentor from "./_components/FeatureMentor";
import OurStory from "./_components/OurStory";
import Potential from "./_components/Potential";
import Testimonials from "./_components/Testimonials";
import Faq from "./_components/Faq";
import Footer from "./_components/Footer";

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

    <div className="h-[4000px] relative">
      <img src="/bg.png" alt="bg" className="absolute top-0 right-[0] "/>

      <div className="w-full flex justify-center items-center relative">

      <Navbar loggedId={loggedId}/>
      </div>

      <HeroSection/>
      <LogoStrip/>
      <KeyBenefits/>
      <Solutions/>
      <div className="relative">
  <Guide />
</div>
<div className="relative mt-20"> {/* Increased top margin for FeatureMentor */}
  <FeatureMentor />
</div>

<OurStory/>
<Potential/>
<Testimonials/>
<Faq/>
<div className="lg:mt-10">
<Footer/>

</div>
        
    
    </div>
  );
}

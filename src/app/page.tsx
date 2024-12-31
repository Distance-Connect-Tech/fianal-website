
import {  api, HydrateClient } from "@/trpc/server";
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";


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
    <HydrateClient>
      {
        user ? (
          <div>
            <h1>Welcome {user.given_name}</h1>
            <p>Email: {user.email}</p>
            <LogoutLink>Log out</LogoutLink>

          </div>
        ) : (<>
          <LoginLink postLoginRedirectURL="http://localhost:3000/sync-user-to-db">Sign In</LoginLink>
        <RegisterLink postLoginRedirectURL="http://localhost:3000/sync-user-to-db">Sign Up</RegisterLink>
        </>
        )

      }
        
    
    </HydrateClient>
  );
}

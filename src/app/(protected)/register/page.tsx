import { api } from '@/trpc/server'
import { getKindeServerSession, LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import RegisterForm from './_components/RegisterForm';

export default async function RegisterPage() {

    const {getUser} = getKindeServerSession();
    const user = await getUser();
  
    const dbUser = await api?.user?.checkUser({ kindeId: user?.id })
    console.log("--------------------- ",dbUser)
    if(user && dbUser?.isRegistered){
      if(dbUser?.role === "STUDENT"){
        return redirect("/student-dashboard")
      }
      if(dbUser.role === "MENTOR"){
        return redirect("/mentor-dashboard")
      }
      if(dbUser.role === "STARTUP"){
        return redirect("/startup-dashboard")
      }
      return redirect("/")
    }

    const userInfo = {
        firstName : user?.given_name ?? '',
        lastName : user?.family_name ?? '',
    }


  return (
    <>
    <RegisterForm user={userInfo!} />
    </>
  );
}

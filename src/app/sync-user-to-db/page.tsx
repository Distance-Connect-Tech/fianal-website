import "server-only";
import { db } from "@/server/db";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

const SyncUser = async () => {
  const {getUser} = getKindeServerSession();
  const user = await getUser();

  if(!user){
    throw new Error("User not found");
  }
  if(!user.email){
    return notFound();
  }

try {
  await db.user.upsert({
    where:{
        kindeId: user.id
    },
    update :{
        name : user.given_name + " " + user.family_name,
        avatarUrl : user.picture,
        email: user.email
    },
    create:{
        kindeId : user.id,
        email : user.email,
        name : user.given_name + " " + user.family_name,
        avatarUrl : user.picture
    }
})
} catch (error) {
    console.log(error);
    return notFound();
}
    
    return redirect("/register");

};

export default SyncUser;
// "use client";

// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import {StudentForm} from "./StudentForm";
// import {MentorForm} from "./MentorForm";
// import {StartupForm} from "./StartupForm";


// const RegisterForm = () => {

//     const [role, setRole] = useState<string>("")
//     // const { user, error, isLoading } = useUser();
//     console.log(user)
//     const userprop = {
//       given_name: user?.given_name || "",
//       family_name: user?.family_name || "",
//       picture: user?.picture  || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
//     }
//   return (
//     <div>
//         <h1 className='text-xl font-bold text-center'>Select Role</h1>
//         <div className="h-4"></div>
//         <div className="flex justify-center gap-4">
//           <Button onClick={() => setRole("STUDENT")} >Student</Button>
//           <Button onClick={() => setRole("MENTOR")} >Mentor</Button>
//           <Button onClick={() => setRole("STARTUP")} >Startup</Button>
//         </div>
//         <div className="h-4"></div>
//         <div className="flex justify-center w-[80%] m-auto">
//         { role === "STUDENT" && user && <StudentForm user={userprop}/> }
//         { role === "MENTOR" && user && <MentorForm user={userprop} /> }
//         { role === "STARTUP" && user && <StartupForm user={userprop} /> }
//         </div>

//     </div>
//   )
// }

// export default RegisterForm
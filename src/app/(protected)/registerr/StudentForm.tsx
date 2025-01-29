"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { studentFormSchema, StudentFormValues } from "@/schemas/student-form-shema"
import { api } from "@/trpc/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
type StudentFormProps = {
  user :{
    given_name: string | null;
    family_name: string | null;
    picture: string | null;
  }
}
export function StudentForm({user} : StudentFormProps) {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(user?.picture || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png")  
  const router = useRouter()

  console.log("avatar" , avatarSrc)

const createStudentUpdateUser = api.student.createStudentUpdateUser.useMutation({
    onSuccess: () => {
      console.log("Student created successfully")
    },
    onError: (error) => {
      console.error(error)
    },
})




  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    
    defaultValues: {
      university: "",
      course: "",
      yearOfStudy: undefined,
      linkedInUrl: "",
      firstName: user?.given_name || "", 
      lastName: user?.family_name || "",
    },  
  })

  const onSubmit = (data: StudentFormValues) => {
    const role: "STUDENT" = "STUDENT"
    const studentUserData = { 
      name : data?.firstName + " " + data?.lastName,
      university : data?.university,
      course : data?.course,
      yearOfStudy : data?.yearOfStudy,
      linkedInUrl : data?.linkedInUrl,
      role: role,
      isRegistered: true,
      avatarUrl: avatarSrc!,
     }

     console.log(studentUserData)
     try {
       createStudentUpdateUser.mutate(studentUserData)
       router.push("/student-dashboard") 
     } catch (error) {
       console.error(error)
     }    

    
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setAvatarSrc(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input 
                placeholder="Enter your First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input 
                placeholder="Enter your Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    
        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University</FormLabel>
              <FormControl>
                <Input placeholder="Enter your university" {...field} />
              </FormControl>
              <FormDescription>
                The name of the university you're attending.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <FormControl>
                <Input placeholder="Enter your course" {...field} />
              </FormControl>
              <FormDescription>
                The name of the course you're studying.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearOfStudy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year of Study</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your year of study" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FIRST">First</SelectItem>
                  <SelectItem value="SECOND">Second</SelectItem>
                  <SelectItem value="THIRD">Third</SelectItem>
                  <SelectItem value="FOURTH">Fourth</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The current year of your study.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedInUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn URL</FormLabel>
              <FormControl>
                <Input placeholder="https://www.linkedin.com/in/yourprofile" {...field} />
              </FormControl>
              <FormDescription>
                Your LinkedIn profile URL.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={avatarSrc!} alt="Profile picture" />
                    <AvatarFallback>PP</AvatarFallback>
                  </Avatar>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      handleProfilePictureChange(event)
                      onChange(event.target.files?.[0])
                    }}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Upload a profile picture (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}


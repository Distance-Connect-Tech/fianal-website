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
import { api } from "@/trpc/react"
import { useRouter } from "next/navigation"
import { StartupFormValues, startupFormSchema } from "@/schemas/startup-form-schema"
import { useState } from "react"

type StartupFormProps = {
  user: {
    given_name: string | null
    family_name: string | null
    picture : string | null
  }
}

export function StartupForm({ user }: StartupFormProps) {
  const router = useRouter()
  const [avatar, setAvatar] = useState<string | null>(user?.picture || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png")

  const createStartup = api.startup.createStartupUpdateUser.useMutation({
    onSuccess: () => {
      console.log("Startup created successfully")
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      startupName: "", 
      startupEmail: "",
      industry: "",
      website: "",
      linkedInUrl: "",
      firstName: user?.given_name || "",
      lastName: user?.family_name || "",
    },
  })


  const onSubmit = (data: StartupFormValues) => {
    const role : "STARTUP" = "STARTUP"
    const startupData = {
      startupName: data.startupName,
      startupEmail: data.startupEmail!,
      industry: data.industry,
      website: data.website,
      linkedInUrl: data.linkedInUrl,
      role: role,
      avatarUrl: avatar!,
      name: `${data.firstName} ${data.lastName}`,
    }

    console.log(startupData)
    try {
      createStartup.mutate(startupData)
      router.push("/startup-dashboard")
    } catch (error) {
      console.error(error)
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
          name="startupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Startup Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your startup name" {...field}  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startupEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Startup Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your startup email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Input placeholder="Enter your industry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="Enter your website" {...field} />
              </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}



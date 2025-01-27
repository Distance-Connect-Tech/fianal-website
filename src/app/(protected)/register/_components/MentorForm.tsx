"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { api } from "@/trpc/react"
import { useRouter } from "next/navigation";

const hiringFields = [
  { label: "Python", value: "python" },
  { label: "UX/UI", value: "uxui" },
  { label: "Machine Learning", value: "machine-learning" },
  { label: "Soft Skills", value: "soft-skills" },
] as const

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters",
  }),
  currentCompany : z.string().min(2, {
    message: "Company name is required"
  }),
  jobTitle: z.string().min(2, {
    message: "Job title is required"
  }),
  experience: z.string().min(2, {
    message: "Experience is required"
  }),
  industry : z.string().min(2, {
    message: "Industry is required"
  }),
  pinCode : z.string().min(2, {
    message: "Pin code is required"
  }),
  state : z.string().min(2, {
    message: "State is required"
  }),
  role: z.string().min(2, {
    message: "Role is required"
  }),
  hiringFields: z.array(z.string()).min(1, {
    message: "At least one hiring field is required",
  }),
})

export default function MentorForm({user} : {user : {firstName : string, lastName : string, }}) {
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [commandOpen, setCommandOpen] = useState(false)

  const router = useRouter();

    const createMentorUpdateUser = api.mentor.createMentorUpdateUser.useMutation({
      onSuccess: () => {
        console.log("Mentor created successfully");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      currentCompany: "",
      jobTitle: "",
      experience: "",
      industry: "",
      pinCode: "",
      state: "",
      role: "MENTOR",
      hiringFields: [],
      
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const role: "MENTOR" = "MENTOR";

    const mentorUserData = {
      name: values?.firstName + " " + values?.lastName,
      currentCompany: values?.currentCompany,
      jobTitle: values?.jobTitle,
      experience: values?.experience,
      industry: values?.industry,
      pinCode: Number(values?.pinCode),
      state: values?.state,
      role: role,
      hiringFields: selectedFields,
      isRegistered: true,
      avatarUrl: "https://i.sstatic.net/l60Hf.png",
    };
    
    try {
      createMentorUpdateUser.mutate(mentorUserData);
      router.push("/mentor-dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  const toggleField = (field: string) => {
    setSelectedFields((current) => {
      const newFields = current.includes(field)
        ? current.filter((f) => f !== field)
        : [...current, field];
  
      // Defer `form.setValue` to after `setSelectedFields` completes
      setTimeout(() => {
        form.setValue("hiringFields", newFields);
      });
  
      return newFields;
    });
  };
  
  const removeField = (field: string) => {
    setSelectedFields((current) => {
      const newFields = current.filter((f) => f !== field);
  
      // Defer `form.setValue` to after `setSelectedFields` completes
      setTimeout(() => {
        form.setValue("hiringFields", newFields);
      });
  
      return newFields;
    });
  };
  

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-black font-inter text-[32px] font-medium leading-[36px]
">Give your Brief Introduction</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Previous form fields remain unchanged */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex flex-col  relative">
                        <FormLabel  className="top-[0px] px-1 text-[#8A8A8A] font-inter text-[14px] font-normal leading-[16px] left-[10px] peer-focus:text-black bg-white  absolute ">
                            First Name
                        </FormLabel>
                    <FormControl className="floating-input  peer w-[300px]">
                       <Input placeholder={""} type="text" {...field}  required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem className="flex flex-col  relative">
                    <FormLabel  className="top-[0px] px-1 text-[#8A8A8A] font-inter text-[14px] font-normal leading-[16px] left-[10px] peer-focus:text-black bg-white  absolute ">
                        Last Name
                    </FormLabel>
                <FormControl className="floating-input  peer w-[300px]">
                   <Input placeholder={""} type="text" {...field}  required />
                </FormControl>
                <FormMessage />
              </FormItem>
                )}
              />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentCompany"
                  render={({ field }) => (
                    <FormItem className="flex flex-col  relative">
                    <FormLabel  className="top-[0px] px-1 text-[#8A8A8A] font-inter text-[14px] font-normal leading-[16px] left-[10px] peer-focus:text-black bg-white  absolute ">
                       Current Company
                    </FormLabel>
                <FormControl className="floating-input  peer w-[300px]">
                   <Input placeholder={""} type="text" {...field}  required />
                </FormControl>
                <FormMessage />
              </FormItem>
                  )}
                />
              <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col  relative">
                    <FormLabel  className="top-[0px] px-1 text-[#8A8A8A] font-inter text-[14px] font-normal leading-[16px] left-[10px] peer-focus:text-black bg-white  absolute ">
                    Job Title
                </FormLabel>
                  <FormControl className="floating-input text-[#8A8A8A]  peer w-[300px]">

                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                    <FormItem className="flex flex-col  relative">
                     <FormLabel  className="top-[0px] px-1 text-[#8A8A8A] font-inter text-[14px] font-normal leading-[16px] left-[10px] peer-focus:text-black bg-white  absolute ">
                    Experience
                </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="floating-input text-[#8A8A8A]  peer w-[300px]">
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="4-6">4-6 years</SelectItem>
                        <SelectItem value="7-10">7-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem className="flex flex-col  relative">
                    <FormLabel  className="top-[0px] px-1 text-[#8A8A8A] font-inter text-[14px] font-normal leading-[16px] left-[10px] peer-focus:text-black bg-white  absolute ">
                    Industry
                </FormLabel>
                  <FormControl className="floating-input text-[#8A8A8A]  peer w-[300px]">

                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pinCode"
              render={({ field }) => (
                <FormItem className="flex flex-col  relative">

<FormLabel  className="top-[0px] px-1 text-[#8A8A8A] font-inter text-[14px] font-normal leading-[16px] left-[10px] peer-focus:text-black bg-white  absolute ">
                    Pin Code
                </FormLabel>
                <FormControl className="floating-input text-[#8A8A8A]  peer w-[300px]">
                    <Input className="remove" type="number" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex flex-col  relative">
             
                  <FormLabel  className="top-[0px] px-1 text-[#8A8A8A] font-inter text-[14px] font-normal leading-[16px] left-[10px] peer-focus:text-black bg-white  absolute ">
                    State
                </FormLabel>
                <FormControl className="floating-input text-[#8A8A8A]  peer w-[300px]">
                    <Input placeholder="" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            </div>
            <FormField        
              control={form.control}
              name="hiringFields"
              render={() => (
                <FormItem className="flex flex-col  relative">
                
                  <FormLabel  className="top-[0px] px-1 text-[#8A8A8A] font-inter text-[14px] font-normal leading-[16px] left-[10px] peer-focus:text-black bg-white  absolute ">
                  Select your hiring fields
                </FormLabel>
                <FormControl className="floating-input text-[#8A8A8A] peer w-[110%]">

                    <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={`w-full justify-start h-auto min-h-[2.5rem] ${
                            selectedFields.length > 0 ? "h-auto" : ""
                          }`}
                        >
                          {selectedFields.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedFields.map((field) => (
                                <Badge key={field} variant="secondary" className="flex items-center gap-1">
                                {hiringFields.find((f) => f.value === field)?.label}
                                {/* <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent interaction with the Popover
                                    removeField(field); // Remove the field
                                  }}
                                /> */}
                                <div
                                className="h-3 w-3 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent interaction with the Popover
                                  removeField(field); // Remove the field
                                }}
                                >X</div>
                              </Badge>
                              ))}
                            </div>
                          ) : (
                            ""
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search fields..." />
                          <CommandList>
                            <CommandEmpty>No fields found.</CommandEmpty>
                            <CommandGroup>
                              {hiringFields.map((field) => (
                                <CommandItem
                                  key={field.value}
                                  onSelect={() => {
                                    toggleField(field.value)
                                    setCommandOpen(false)
                                  }}
                                >
                                  {field.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      
    </div>
  )
}


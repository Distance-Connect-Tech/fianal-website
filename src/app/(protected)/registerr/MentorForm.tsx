"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mentorFormSchema, MentorFormValues } from "@/schemas/mentor-form-schema";
import { api } from "@/trpc/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type MentorFormProps = {
  user: {
    given_name: string | null;
    family_name: string | null;
    picture: string | null;
  };
};

export function MentorForm({ user }: MentorFormProps) {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(
    user?.picture || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
  );
  const router = useRouter();

  console.log("avatar", avatarSrc);

  const createMentorUpdateUser = api.mentor.createMentorUpdateUser.useMutation({
    onSuccess: () => {
      console.log("Mentor created successfully");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const form = useForm<MentorFormValues>({
    resolver: zodResolver(mentorFormSchema),
    defaultValues: {
      positionTitle: "",
      industryExperience: "",
      yearsOfExperience: "",
      linkedInUrl: "",
      professionalIdUrl: "",
      companyEmail: "",
      firstName: user?.given_name || "",
      lastName: user?.family_name || "",
    },
  });

  const onSubmit = (data: MentorFormValues) => {
    const role: "MENTOR" = "MENTOR";
    const mentorUserData = {
      name: data?.firstName + " " + data?.lastName,
      positionTitle: data?.positionTitle,
      industryExperience: data?.industryExperience,
      yearsOfExperience: data?.yearsOfExperience,
      linkedInUrl: data?.linkedInUrl,
      professionalIdUrl: data?.professionalIdUrl,
      companyEmail: data?.companyEmail,
      role: role,
      isRegistered: true,
      avatarUrl: avatarSrc!,
    };

    console.log(mentorUserData);
    try {
      createMentorUpdateUser.mutate(mentorUserData);
      router.push("/mentor-dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarSrc(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

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
                <Input placeholder="Enter your First Name" {...field} />
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
                <Input placeholder="Enter your Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="positionTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your position/title" {...field} />
              </FormControl>
              <FormDescription>Your professional title or role.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="industryExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry Experience</FormLabel>
              <FormControl>
                <Input placeholder="Enter your industry experience" {...field} />
              </FormControl>
              <FormDescription>Brief about your industry experience.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input placeholder="Enter your years of experience" {...field} />
              </FormControl>
              <FormDescription>Total professional experience in years.</FormDescription>
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
              <FormDescription>Your LinkedIn profile URL.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="professionalIdUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional ID URL</FormLabel>
              <FormControl>
                <Input placeholder="URL to your professional ID" {...field} />
              </FormControl>
              <FormDescription>Provide a professional ID link (if applicable).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Email</FormLabel>
              <FormControl>
                <Input 
                placeholder="Enter your company email"
                 {...field} />
              </FormControl>
              <FormDescription>Your Company email </FormDescription>
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
                      handleProfilePictureChange(event);
                      onChange(event.target.files?.[0]);
                    }}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>Upload a profile picture (optional).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

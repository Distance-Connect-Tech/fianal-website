"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { api } from '@/trpc/react'

  
function MeetingForm({setFormValue} : {setFormValue:Function}) {

    const [eventName,setEventName]=useState<String>();
    const [duration,setDuration]=useState<Number>(30);
    const [meetUrl,setMeetUrl]=useState<String>("https://meet.google.com/");
    const [description, setDescription]=useState<String>();
    const [loading, setLoading] = useState(false);
    const router=useRouter();
    const createMeetingEvent = api.meetingEvent.createMeetingEvent.useMutation({
        onSuccess: () => {
            console.log('New Meeting Event Created!');
            toast('New Meeting Event Created!');
            router.push('/mentor-dashboard/meeting/meeting-type');
            setLoading(false);
        },
        onError: (error) => {
            toast.error(error.message);
        },
        
    });
    
  

    useEffect(()=>{
        setFormValue({
            eventName:eventName,
            duration:duration,
            meetUrl:meetUrl,
            description:description
        })
    },[eventName,duration,meetUrl,description])


    const onCreateClick=async()=>{
        setLoading(true);

        await createMeetingEvent.mutateAsync({
            eventName:eventName as string,
            duration:duration as number,
            meetUrl: meetUrl as string,
            description:description as string
        })
    }


    
  return (  
    <div className='p-8 '>
       <Link href={'/dashboard'}>
         <h2 className='flex gap-2'>
            <ChevronLeft/> Cancel</h2>
            </Link>
        <div className='mt-4'>
            <h2 className='font-bold text-2xl my-4'>Create New Event</h2>
            <hr></hr>
        </div>
        <div className='flex flex-col gap-3 my-4'>
            <h2 className='font-bold'>Event Name *</h2>
            <Input placeholder="Name of your meeting event"
            onChange={(event)=>setEventName(event.target.value)}
            />

            <h2 className='font-bold'>Duration *</h2>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" className="max-w-40">{duration.toString()} Min</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={()=>setDuration(15)}>15 Min</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setDuration(30)}>30 Min</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setDuration(45)}>45 Min</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setDuration(60)}>60 Min</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <h2 className='font-bold'>Location *</h2>
            
            <Input placeholder='Add Url'
            onChange={(event)=>setMeetUrl(event.target.value)}
            />

            <h2 className='font-bold'>Description</h2>
            <Textarea placeholder='Add Notes'
            onChange={(event)=>setDescription(event.target.value)}
            />  
        </div>

        <Button className={`w-full mt-5 ${loading&&'bg-gray-300'}`}
        disabled={loading || !eventName || !duration || !meetUrl || !description}
        onClick={()=>onCreateClick()}
        >
        Create
        </Button>

    </div>
  )
}

export default MeetingForm
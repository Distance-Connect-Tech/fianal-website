"use client"
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { CalendarCheck, Clock, LoaderIcon, MapPin, Timer } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import TimeDateSelection from './TimeDateSelection'
import UserFormInfo from './UserFormInfo'
import { useRouter } from 'next/navigation'
import { JSONValue } from 'node_modules/superjson/dist/types'
import { api } from '@/trpc/react'
import { Resend } from 'resend';
import { render } from '@react-email/render';
import Email from '@/../emails/index'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'



type EventInfo = {
  id : string;
  eventName: string;
  duration: number;
  meetUrl: string;
  description: string | null;
}

type MentorUserDetails = {
  name: string | null;
  email: string;
  daysAvailable: JSONValue;
  mentorUserId : string;
} 

type ScheduledMeeting = {
  selectedTime: string;
  userNote: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  duration: number;
  meetUrl: string;
  mentorUserId: string;
  selectedDate: Date;
  formatedDate: string;
  formatedTimeStamp: string;
  eventId: string;
  studentUserId: string;
}

function MeetingTimeDateSelection({eventInfo,mentorUserDetails} :{eventInfo : EventInfo, mentorUserDetails : MentorUserDetails} ) {
    const [date,setDate]=useState(new Date())
    const [timeSlots,setTimeSlots]=useState<string[]>([]);
    const [enableTimeSlot,setEnabledTimeSlot]=useState<boolean>(false);
    const [selectedTime,setSelectedTime]=useState<string>();
    const [userNote,setUserNote]=useState<string>('');
    const [prevBooking,setPrevBooking]=useState<ScheduledMeeting[]>([]);
    const router=useRouter();
    const [loading,setLoading]=useState(false);



    const { data: prevBookingData } = api.scheduledMeetings.getScheduledMeetingsList.useQuery(
      {
        selectedDate: date,
        eventId: eventInfo.id,
      }
    );

    const sendEmaill = api.email.sendEmail.useMutation({
      onSuccess: () => {
        console.log('Email Sent!');
      },
      onError: (error) => {
        console.log(error);
      },
    });
    
    
    useEffect(() => {
      if (prevBookingData) {
        setPrevBooking(prevBookingData!);
      }
    }, [prevBookingData]);



    useEffect(()=>{
        eventInfo?.duration&&createTimeSlot(eventInfo?.duration)
    },[eventInfo])


    const createScheduledMeeting = api.scheduledMeetings.createScheduledMeeting.useMutation({
        onSuccess:async ()=>{
            console.log('Meeting Scheduled successfully!')
            await sendEmail()
            setLoading(false)
            router.push('/confirmation')
        },
        onError:(error)=>{
            console.log(error)
        }
    })



    const createTimeSlot=(interval: number)=>{
        const startTime = 8 * 60; // 8 AM in minutes
        const endTime = 22 * 60; // 10 PM in minutes
        const totalSlots = (endTime - startTime) / interval;
        const slots = Array.from({ length: totalSlots }, (_, i) => {
      const totalMinutes = startTime + i * interval;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedHours = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';
      return `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    });
 
    // console.log(slots)  
    setTimeSlots(slots); 
    }

    /**
     * On Date Change Handle Method
     * @param {*} date 
     */
    const handleDateChange=(date: Date)=>{
        setDate(date);
        const day=format(date,'EEEE');
        
        if((mentorUserDetails?.daysAvailable as Record<string, any>)?.[day])
        {
          setEnabledTimeSlot(true)
        }
        else{
           
            setEnabledTimeSlot(false)
        }
    }


    const getCombinedTimestamp = (date: Date, time: string) => {
      const [hours, minutesPart] = time.split(':');
      const minutes = minutesPart ? parseInt(minutesPart.slice(0, 2), 10) : 0;
      const isPM = time.toLowerCase().includes('pm');
  
      // Adjust hours for AM/PM
      const adjustedHours = isPM ? (hours === '12' ? 12 : parseInt(hours ?? '0', 10) + 12) : (hours === '12' ? 0 : parseInt(hours ?? '0', 10));
  
      // Set the hours and minutes into the Date object
      const updatedDate = new Date(date);
      updatedDate.setHours(adjustedHours, minutes, 0, 0);
  
      return updatedDate.getTime(); // Returns a timestamp in milliseconds
  };

    const handleScheduleEvent=async()=>{

        setLoading(true)
       await createScheduledMeeting.mutateAsync({
            mentorUserId:mentorUserDetails.mentorUserId,
            selectedTime:selectedTime ?? '',
            selectedDate:date ,
            formatedDate:format(date,'PPP'),
            formatedTimeStamp:getCombinedTimestamp(date,selectedTime!).toString(),
            duration:eventInfo.duration,
            meetUrl:eventInfo.meetUrl,
            eventId:eventInfo.id,
            userNote:userNote
        })

    }

    /**
     * Used to Send an email to User
     * @param {*} user 
     */
    const sendEmail= async ()=>{
      if(mentorUserDetails.name && date && eventInfo.duration && selectedTime && eventInfo.meetUrl &&  mentorUserDetails.email){
        
          sendEmaill.mutateAsync({
            date: format(date, 'PPP').toString(),
            mentorName: mentorUserDetails?.name,
            duration: eventInfo?.duration.toString(),
            meetingTime: selectedTime,
            meetingUrl: eventInfo?.meetUrl
          })
      }
      else{
          alert('Email not sent')
      }

    }


  
  return (
    <div className='p-5 py-10 shadow-lg m-5 border-t-8
    mx-10
    md:mx-26
    lg:mx-56
    my-10'
    >
       <Image src='/logo.svg' alt='logo'
       width={150}
       height={150}/>
       <div className='grid grid-cols-1 md:grid-cols-3 mt-5'>
            {/* Meeting Info  */}
            <div className='p-4 border-r'>
                <h2>{mentorUserDetails?.name}</h2>
                <h2
                className='font-bold text-3xl'
                >{eventInfo?.eventName?eventInfo?.eventName:'Meeting Name'}</h2>
                <div className='mt-5 flex flex-col gap-4'>
                    <h2 className='flex gap-2'><Clock/>{eventInfo?.duration} Min </h2>
                    <h2 className='flex gap-2'><MapPin/>Meeting </h2>
                    <h2 className='flex gap-2'><CalendarCheck/>{format(date,'PPP')}  </h2>
                  {selectedTime&&  <h2 className='flex gap-2'><Timer/>{selectedTime}  </h2>}
                  
                    <Link href={eventInfo?.meetUrl?eventInfo?.meetUrl:'#'}
                    className='text-primary'
                    >{eventInfo?.meetUrl}</Link>
                </div>
            </div>
            {/* Time & Date Selction  */}
          <TimeDateSelection
            date={date}
            enableTimeSlot={enableTimeSlot}
            handleDateChange={handleDateChange}
            setSelectedTime={setSelectedTime}
            timeSlots={timeSlots}
            selectedTime={selectedTime!}
            prevBooking={prevBooking}
           />
     

       </div>
       <div className='flex gap-3 justify-end'>
    
       <Button  
       onClick={handleScheduleEvent}
       > 
       {loading?<LoaderIcon className='animate-spin'/>:'Schedule' }
      </Button>
       </div>
    </div>
  )
}

export default MeetingTimeDateSelection
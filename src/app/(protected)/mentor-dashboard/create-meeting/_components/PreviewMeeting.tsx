import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Clock, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'


type FormValue = {
    eventName:String,
    duration:Number,
    email:String,
    description:String
}

function PreviewMeeting({formValue} : {formValue:FormValue}) {

    const [date,setDate]=useState(new Date())
    const [timeSlots,setTimeSlots]=useState<string[]>([]);

    useEffect(()=>{
        formValue?.duration&&createTimeSlot(formValue?.duration)
    },[formValue])



    const createTimeSlot=(interval : any )=>{
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
 
    setTimeSlots(slots); 
    }

  return (
    <div className='p-5 py-10 shadow-lg m-5 border-t-8'
    
    >
       <Image src='/logo.svg' alt='logo'
       width={150}
       height={150}/>
       <div className='grid grid-cols-1 md:grid-cols-3 mt-5'>
            {/* Meeting Info  */}
            <div className='p-4 border-r h-full'>
    <h2>Business Name</h2>
    <h2 className='font-bold text-3xl'>
        {formValue?.eventName ? formValue?.eventName : 'Meeting Name'}
    </h2>
    <div className='mt-5 flex flex-col gap-4'>
        <h2 className='flex gap-2'>
            <Clock />
            {formValue?.duration.toString()} Min
        </h2>
        <h2 className='flex gap-2'>
            <MapPin />
            <div  className='text-primary'>
                Google Meet
            </div>
        </h2>
    </div>
    {
        formValue?.description && (
            <h2 className='font-bold mt-5'>Description</h2>
        )
    }
    <div
        className='text-primary overflow-auto break-words'
        style={{ maxWidth: '100%', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
    >
        {formValue?.description}
    </div>
</div>

            {/* Time & Date Selction  */}
            <div className='md:col-span-2 flex px-4'>
                <div className='flex flex-col'>
                    <h2 className='font-bold text-lg'>Select Date & Time</h2>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(day) => day && setDate(day)}
                        className="rounded-md border mt-5"
                       disabled={(date : Date)=>date<=new Date()}
                    />
                </div>
                <div className='flex flex-col w-full overflow-auto gap-4 p-5'
                style={{maxHeight:'400px'}}
                >
                    {timeSlots?.map((time,index)=>(
                        <Button 
                        key={index}
                        className="border-primary
                         text-primary" variant="outline">{time}</Button>
                    ))}
                </div>
            </div>
       </div>
    </div>
  )
}

export default PreviewMeeting
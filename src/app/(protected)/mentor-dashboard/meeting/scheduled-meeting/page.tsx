"use client"
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScheduledMeetingList from './_components/ScheduledMeetingList'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { format } from 'date-fns'
import { api } from '@/trpc/react';

function ScheduledMeeting() {

    const {user}=useKindeBrowserClient();
   


    const {data :scheduledMeetingsListByMentorList, isLoading, isError} = api.scheduledMeetings.getScheduledMeetingsListByMentor.useQuery();
    


    const filterMeetingList=(type : string)=>{
        const currentTimestamp = new Date().getTime();
        if(type=='upcoming')
        {
            return scheduledMeetingsListByMentorList?.filter(item=>Number(item?.formatedTimeStamp)>=Number(currentTimestamp));
        }
        else{
            return scheduledMeetingsListByMentorList?.filter(item=>Number(item?.formatedTimeStamp)<Number(currentTimestamp));

        }
    }
console.log(new Date())

  return (
    <div className='p-10'>
        <h2 className='font-bold text-2xl'>Scheduled Meetings</h2>
        <hr className='my-5'></hr>
        {isLoading && <div>Loading...</div>}
        <Tabs defaultValue="upcoming" className="w-[400px]">
        <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
            <ScheduledMeetingList
            meetingList={filterMeetingList('upcoming')!}
            /> </TabsContent>
        <TabsContent value="expired">
        <ScheduledMeetingList
            meetingList={filterMeetingList('expired')!}
            /> 
        </TabsContent>
        </Tabs>

    </div>
  )
}

export default ScheduledMeeting
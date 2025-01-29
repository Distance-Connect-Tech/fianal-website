import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>mentor-dashboard
      <div>
        <Link href={"/mentor-dashboard/meeting"}>Meeting</Link>
      </div>
    </div>
  )
}

export default page
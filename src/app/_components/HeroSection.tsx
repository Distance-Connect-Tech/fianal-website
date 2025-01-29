import React from 'react'

const HeroSection = () => {
  return (
    <div className='h-[640px] flex justify-center items-center  '>
        <div className='flex w-[80%] justify-between items-center'>
            <div className='flex flex-col gap-4'>
                <h1 className='text-[#3D568F] font-inter text-[52px] font-bold leading-[63px]'>
                Find Your Perfect Mentor <br/>
                For Growth
                </h1>
                <h2 className='text-[#3D568F]  font-inter text-[24px] font-light leading-[32px]'>
                Lorem Ipsum is simply dummy text of the printing
                <br/> and typesetting industry. Lorem Ipsum has been 
                </h2>
                <div className='h-4'></div>
                <div className='flex gap-4 '>
                    <button className='text-white font-roboto text-[19px] font-medium leading-[24px] flex w-[208px] h-[50px] p-[8px_16px] justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#3D568F] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.15)]'>
                    Book Free Demo
                    </button>
                    <button className='flex w-[240px] h-[50px] p-[8px_16px] flex-col justify-center items-center flex-shrink-0 text-[#3D568F] font-roboto text-[19px] font-medium leading-[24px] rounded-[8px] border border-[#3D568F] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.15)]'>
                    Learn more
                    </button>
                </div>
            </div>
            <div>
            <img src='bg2.svg' className='w-[383px] h-[398px] flex-shrink-0 object-contain'/>
            </div>
        </div>

    </div>
  )
}

export default HeroSection
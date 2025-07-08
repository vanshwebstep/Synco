import React from 'react'
   
const HeaderBanner = ({ title }) => {
console.log('titi',title)
    return (
     <section
      className="headerbanner mt-8 py-7 bg-no-repeat bg-cover bg-center rounded-4xl flex items-center p-10"
      style={{
        backgroundImage: "url('/members/headerbanner.png')",
      }}
    >
      <div className='flex gap-4 items-center'>
        <div className="max-w-[40px]">
          <img src="/members/Category.png" className='w-full' alt="" />
        </div>
        <h2 className="text-black font-bold text-[38px] flex items-center gap-2">
          {title}
        </h2>
      </div>
    </section>
    )
}

export default HeaderBanner

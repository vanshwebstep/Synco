import React from 'react';

const HeaderBanner = ({ title, icon: Icon }) => {
  return (
    <section
      className="headerbanner mt-8 py-7 bg-no-repeat bg-cover bg-center rounded-4xl flex items-center p-10"
      style={{
        backgroundImage: "url('/members/headerbanner.png')",
      }}
    >
      <div className='flex gap-4 items-center'>
        <div className="md:max-w-[40px] max-w-[20px] text-black">

          <img src={Icon} className="w-full" alt="Default Icon" />

        </div>
        <h2 className="text-black font-bold md:text-[38px] text-lg flex items-center gap-2">
          {title}
        </h2>
      </div>
    </section>
  );
};

export default HeaderBanner;

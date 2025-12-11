import { Download, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ContractList = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="bg-white border border-[#E2E1E5] rounded-3xl overflow-hidden border-b-0">
        <div className="flex justify-between items-center border-b border-[#E2E1E5] p-5">
          <h3 className="font-semibold text-2xl">
            Contract List
          </h3>
          <button className="text-white bg-[#237FEA] rounded-xl p-3 flex gap-2"><Plus/>Add Template</button>
        </div>

        {["Head Coach Contract", "Lead Coach Contract", "Head Coach Contract","Support Coach Contract","Regional Manager Contract"].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white p-4  border-b border-[#EFEEF2]">
            <div className="flex items-center gap-3">
              <span className="text-[#3E3E47] font-semibold">{item}</span>
            </div>
            <div className="flex justify-between gap-2 items-center">
              <Download className='text-gray-500'/>
              <img src="/reportsIcons/Pen.png" onClick={()=> navigate (`/configuration/coach-pro/contracts/update?id=${'1'}`)} alt="" className="w-5 h-5 cursor-pointer" />
              <img src="/reportsIcons/delete-02.png" className="w-5 h-5 cursor-pointer" alt="" />
            </div>
          </div>
        ))}
      </div>

    </div>

  )
}

export default ContractList

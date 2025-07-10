import { useVenue } from "../contexts/VenueContext";

const Create = () => {
const {formData, setFormData } = useVenue();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Venue Submitted:", formData);

  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="md:text-[24px] font-semibold mb-4 flex gap-2 items-center border-[#E2E1E5] border-b p-5"><img src="/members/Arrow - Left.png" className="w-6" alt="" />Add New Venue</h2>
      <form onSubmit={handleSubmit} className="space-y-2  p-5 pt-1">

        <div>
          <label className="block font-semibold text-[16px] pb-2">Area</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-[16px] pb-2">Name of Venue</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-[16px] pb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-[16px] pb-2">Facility</label>
          <select
            name="facility"
            value={formData.facility}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm text-[#717073]"
          >
            <option value="">Facility</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
          </select>
        </div>

        <div className="flex py-2 items-center justify-between gap-6">
          {/* Parking Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="block font-semibold text-[16px]">Parking</span>
            <input
              type="checkbox"
              name="parking"
              checked={formData.parking}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div className={`w-10 h-6 flex items-center bg-[#5372FF] rounded-full p-1 transition-all duration-300 ${formData.parking ? 'justify-end' : 'justify-start'}`}>
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </div>
          </label>

          {/* Congestion Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="block font-semibold text-[16px]">Congestion</span>
            <input
              type="checkbox"
              name="congestion"
              checked={formData.congestion}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div className={`w-10 h-6 flex items-center bg-[#5372FF] rounded-full p-1 transition-all duration-300 ${formData.congestion ? 'justify-end' : 'justify-start'}`}>
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </div>
          </label>
        </div>


        <div>
          <textarea
            rows={3}
            name="parkingNote"
            value={formData.parkingNote}
            onChange={handleInputChange}
            placeholder="Add a parking note"
            className="w-full border bg-[#FAFAFA] border-[#E2E1E5] rounded-xl p-4 text-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-[16px] pb-2">How to enter facility</label>
          <textarea
            name="entryNote"
            value={formData.entryNote}
            onChange={handleInputChange}
            className="w-full border bg-[#FAFAFA] border-[#E2E1E5] rounded-xl p-4 text-sm"
            rows={3}
            placeholder="Add notes"
          />
        </div>

        <div>
          <label className="block font-semibold text-[16px] pb-2">Term Date Linkage</label>
          <select
            name="termDateLinkage"
            value={formData.termDateLinkage}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm text-[#717073]"
          >
            <option value="">Select Term Date Group</option>
            <option value="Term A">Term A</option>
            <option value="Term B">Term B</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[16px] pb-2">Subscription Plan Linkage</label>
          <select
            name="subscriptionLinkage"
            value={formData.subscriptionLinkage}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm text-[#717073]"
          >
            <option value="">Subscription Plan Linkage</option>
            <option value="Plan A">Plan A</option>
            <option value="Plan B">Plan B</option>
          </select>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={() =>
              setFormData({
                area: "", name: "", address: "", facility: "",
                parking: false, congestion: false, parkingNote: "",
                entryNote: "", termDateLinkage: "", subscriptionLinkage: ""
              })
            }
            className="w-1/2 mr-2 py-3 font-semibold border border-[#E2E1E5] rounded-xl text-[18px] text-[#717073] hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-1/2 ml-2 py-3 font-semibold bg-[#237FEA] text-white rounded-xl text-[18px] hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;

import React from "react";
import { HashLoader } from "react-spinners";

const Loader = ({ loading = true, size = 50 }) => {
  return (
    <div className="flex items-center justify-center min-h-[150px]">
      <HashLoader color="#FFDE14" loading={loading} size={size} />
    </div>
  );
};

export default Loader;

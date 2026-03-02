import React from "react";
import { LoaderIcon } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoaderIcon className="animate-spin text-white size-10" />
    </div>
  );
};

export default PageLoader;

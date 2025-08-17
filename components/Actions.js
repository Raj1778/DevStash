import Image from "next/image";
import { FcSurvey } from "react-icons/fc";
import { FcPlus } from "react-icons/fc";
import { FcFolder } from "react-icons/fc";
export default function Action() {
  return (
    <div className="flex flex-col md:flex-row gap-10 items-center justify-center ">
      {/* Projects Card */}
      <div className="p-3 w-36 border rounded-md flex flex-row gap-4 items-center justify-center text-white">
        <div className="h-12 w-16 relative flex items-center  text-5xl text-white text-center justify-center">
          <FcFolder />
        </div>
        <div className="p-1">
          <h1>Projects</h1>
        </div>
      </div>
      {/* Notes Card (React Icon) */}
      <div className="p-3 w-36 border rounded-md flex flex-row gap-4 items-center justify-center text-white">
        <div className="h-12 w-16 flex items-center justify-center text-5xl text-white text-center">
          <FcSurvey />
        </div>
        <div className="p-1">
          <h1>Notes</h1>
        </div>
      </div>
      {/* Notes Card (Image) */}
      <div className="p-3 w-36 border rounded-md flex flex-row gap-4 items-center justify-center text-white">
        <div className="h-12 w-16 relative flex items-center text-5xl text-white text-center justify-center">
          <FcPlus />
        </div>
        <div className="p-1">
          <h1>Notes</h1>
        </div>
      </div>
    </div>
  );
}

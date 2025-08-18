import { FcSurvey, FcPlus, FcFolder } from "react-icons/fc";

export default function Action() {
  const actions = [
    { icon: <FcFolder />, title: "Projects" },
    { icon: <FcSurvey />, title: "Notes" },
    { icon: <FcPlus />, title: "Add Blog" },
  ];

  return (
    <div className="flex overflow-x-auto gap-6 p-2 mx-4 my-6 scrollbar-hide md:flex-wrap md:justify-center">
      {actions.map((action, index) => (
        <div
          key={index}
          className="h-16 w-48 flex-shrink-0 bg-zinc-900 rounded-xl flex flex-row gap-4 items-center justify-center text-white p-3"
        >
          <div className="h-12 w-16 flex items-center justify-center text-5xl text-white text-center">
            {action.icon}
          </div>
          <div className="p-1">
            <h1>{action.title}</h1>
          </div>
        </div>
      ))}
    </div>
  );
}

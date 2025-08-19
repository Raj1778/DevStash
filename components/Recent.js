const Recent = () => {
  const RecentWork = [
    { title: "Zyngle Project" },
    { title: "Raj's Blog" },
    { title: "DevStash" },
    { title: "Next.js Tutorial" },
  ];

  return (
    <>
      <div className="flex items-center px-6 pt-8 mx-2">
        <h1 className="text-white text-2xl">Continue Working</h1>
      </div>

      {/* ✅ Wrapper for horizontal scroll */}
      <div className="flex overflow-x-auto gap-8 md:gap-12 p-2 mx-12 md:mx-24 my-4 scrollbar-hide md:flex-wrap">
        {RecentWork.map((item, index) => (
          <RecentCard key={index} title={item.title} />
        ))}
      </div>

      <hr />
    </>
  );
};

const RecentCard = ({ title }) => {
  return (
    <div
      className="h-16 w-36 min-w-24 rounded-xl flex items-center justify-center text-white 
                    bg-gradient-to-tr from-[#592E83] to-[#000046]"
    >
      <h1 className="text-center">{title}</h1>
    </div>
  );
};

export default Recent;

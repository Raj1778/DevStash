const Recent = ({ loading = false }) => {
  const RecentWork = [
    { title: "Zyngle Project" },
    { title: "Raj's Blog" },
    { title: "DevStash" },
    { title: "Next.js Tutorial" },
  ];

  if (loading) {
    return (
      <>
        <div className="flex overflow-x-auto gap-8 md:gap-12 p-2 mx-12 md:mx-24 my-4 scrollbar-hide md:flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-36 min-w-24 rounded-xl bg-gray-700/50 animate-pulse" />
          ))}
        </div>
        <hr />
      </>
    );
  }

  return (
    <>
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

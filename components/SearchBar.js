import { IoSearch } from "react-icons/io5";
const SearchBar = () => {
  return (
    <div className="flex justify-center">
      <input
        type="search"
        placeholder="    🔍    Start Typing..."
        className="w-full mx-10 my-2 bg-zinc-900 text-white p-2 rounded-md outline-none"
      />
    </div>
  );
};

export default SearchBar;

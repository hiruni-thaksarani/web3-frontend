import Link from "next/link";
import logo from "./w3g-logo3.png";
import Image from "next/image";


export default function Navbar() {
  const handleLogout = () => {
    // Delete token from storage
    localStorage.removeItem("token");
    // Redirect to logout page
    window.location.href = "/"; // Redirect to the appropriate logout page
  };

  return (
    <header className={`z-10 fixed top-0 left-0 right-0  flex items-center justify-between h-24 py-2 px-10 bg-mainColor`}>

        <div className='ml-4'>
        {/* <img src={logo}
        width={10}
        height={20}
        className="w-36 h-20" alt="" /> */}
        {/* <Image
      src="./w3g-logo.png"
      width={500}
      height={500}
      alt="Picture of the author"
    /> */}

       
      </div>

      <div className='ml-64'>
        <Link href="/UserOnBoarding" className="text-white text-xl">User Onboarding</Link>
      </div>
      
      <div className='ml-20'>
        <Link href="/UserList" className="text-white text-xl">Users List</Link>
      </div>

      <div className="flex items-center w-1/3 ml-44">
        <div className="w-3/5 mx-2 rounded bg-white">
          <input
            className="w-full border-none bg-transparent px-4 py-2 text-gray-800 outline-none focus:outline-none "
            type="search"
            name="search"
            placeholder="Search..."
            // onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Log Out Button */}
      <div>
        <button className="text-mainColor py-2 rounded-lg text-xl mr-10 px-2 bg-white" onClick={handleLogout}>Log Out</button>
      </div>
    </header>
  );
}

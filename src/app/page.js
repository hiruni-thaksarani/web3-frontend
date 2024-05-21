import Image from "next/image";
import Navbar from "../components/Navbar";
import UserOnboarding from "./_pages/UserOnBoarding";
import UserLgoin from "../app/UserLogoin/page";
import FcmTokenComp from "../utils/hooks/firebaseForeground";

export default function Home() {
  return (
    
    <>
   
      <UserLgoin />
    </>
  );
}

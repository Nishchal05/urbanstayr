import Image from "next/image";
import LandingHerosection from "./_component/landingHerosection";
import RentYourProperty from "./_component/rentyourproperty";

export default function Home() {
  return (
    <div>
     <LandingHerosection/>
     <RentYourProperty/>
    </div>
  );
}

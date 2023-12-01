import Footer from "@/components/landingPage/Footer";
import Navbar from "@/components/landingPage/Navbar";
import About from "@/components/landingPage/sections/About";
import GetStarted from "@/components/landingPage/sections/GetStarted";
import Hero from "@/components/landingPage/sections/Hero";
import Team from "@/components/landingPage/sections/Team";
import World from "@/components/landingPage/sections/World";

export default function Home() {
  return (
    <div className="bg-gray-900 overflow-hidden">
      <Navbar />
      <Hero />
      <div className="relative">
        <About />
        <div className="gradient-03 z-0" />
        <Team />
      </div>
      <div className="relative">
        <GetStarted />
        <div className="gradient-04 z-0" />
      </div>
      <World />
      <div className="relative">
        <div className="gradient-04 z-0" />
      </div>
      <Footer />
    </div>
  )
}

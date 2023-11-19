
import Navbar from "./ui/landingPage/Navbar";
import Hero from "./ui/landingPage/sections/Hero";
import About from "./ui/landingPage/sections/About";
import Team from "./ui/landingPage/sections/Team";
import GetStarted from "./ui/landingPage/sections/GetStarted";
import World from "./ui/landingPage/sections/World";
import Footer from "./ui/landingPage/Footer";
const Homepage = () => {
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

export default Homepage
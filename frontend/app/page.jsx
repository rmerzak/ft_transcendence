import { About, Team, GetStarted, Hero, Insights, WhatsNew, World } from "./sections"
import { Footer, Navbar } from "./ui/landingPage"
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
      <WhatsNew />
    </div>
    <World />
    <div className="relative">
      <Insights />
      <div className="gradient-04 z-0" />
    </div>
    <Footer />
  </div>
  )
}

export default Homepage
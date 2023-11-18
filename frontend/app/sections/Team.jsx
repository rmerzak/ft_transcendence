'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "../ui";
import { staggerContainer } from "../utils/motion";
import { TitleText,TypingText} from '../ui/landingPage'
import TeamCard from "../ui/landingPage/TeamCard";
import { exploreWorlds } from "../constants";
const Team = () => {
  const [active, setActive] = useState('world-1');
  return(
  <section className={`${styles.paddings}`}>
    <motion.div variants={staggerContainer} initial='hidden' whileInView="show" viewport={{once:false, amount:0.25}} className={`${styles.innerWidth} mx-auto flex flex-col`}>
    <TypingText title="| The Team" textStyles="text-center"/>
    <TitleText title={<>Check the team <br className="md:block hidden"/></>} textStyles="text-center"/>
    <div className="mt-[50px] flex lg:flex-row flex-col min-h-[70vh] gap-5">
      {
        exploreWorlds.map((world, index) => (
          <TeamCard key={world.id} {...world} index={index} active={active} handleClick={setActive} />
        ))
      }
    </div>
    </motion.div>
  </section>)
};

export default Team;

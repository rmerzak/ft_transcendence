'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "../..";
import { staggerContainer } from "../../../utils/motion";
import { TitleText, TypingText } from '../CustomTexts'
import TeamCard from "../TeamCard";
import { team } from "../../../constants/index.tsx";
const Team = () => {
  const [active, setActive] = useState('profile-5');
  return (
    <section className={`${styles.paddings}`}>
      <motion.div variants={staggerContainer} initial='hidden' whileInView="show" viewport={{ once: false, amount: 0.25 }} className={`${styles.innerWidth} mx-auto flex flex-col`}>
        <TypingText title="| The Team" textStyles="text-center" />
        <TitleText title={<>Check the team <br className="md:block hidden" /></>} textStyles="text-center" />
        <div className="mt-[50px] flex lg:flex-row flex-col min-h-[70vh] gap-5">
          {
            team.map((profile, index) => (
              <TeamCard key={profile.id} {...profile} index={index} active={active} handleClick={setActive} />
            ))
          }
        </div>
      </motion.div>
    </section>)
};

export default Team;

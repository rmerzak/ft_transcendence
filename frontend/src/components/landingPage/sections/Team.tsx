'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "../..";
import { staggerContainer } from "@/utils/motion";
import { TitleText, TypingText } from '../CustomTexts'
import TeamCard from "../TeamCard";
import { team } from "../../../constants";
const Team = () => {
  const [active, setActive] = useState<string>('profile-5');
  return (
    <section className="sm:p-16 xs:p-8 px-6 py-12">
      <motion.div variants={staggerContainer(1,2)} initial='hidden' whileInView="show" viewport={{ once: false, amount: 0.25 }} className="2xl:max-w-[1280px] w-full mx-auto flex flex-col">
        <TypingText title="| The Team" />
        <TitleText title="Check the team " />
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

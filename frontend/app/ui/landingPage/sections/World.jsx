'use client';

import { motion } from "framer-motion";
import styles from "../..";
import { TypingText, TitleText } from "..";
import { fadeIn, staggerContainer } from "../../../utils/motion";
const World = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <motion.div variants="hidden" whileInView="show" viewport={{once:'false' , amount:0.25}} className={`${styles.innerWidth} mx-auto flex flex-col`}>
      <TypingText title="| PingPong in the world" textStyles="text-center" />
      <TitleText title={<>PingPong is used by players all over the world</>} textStyles="text-center" />
      <motion.div variants={fadeIn('up','tween' ,0.3, 1)} className="relative mt-[68px] flex w-full h-[550px]">
        <img src="/map.png" alt="image" className="w-full h-full object-contain"/>
        <div className="absolute md:bottom-20 md:right-20 top-1/2 right-10 md:w-[70px] md:h-[70px] w-[30px] h-[30px] rounded-full bg-[#5d6680]">
          <img src="/people-01.png" alt="people" className="w-full h-full"/>
        </div>
        <div className="absolute md:top-20 md:left-20 bottom-1/2 left-50  md:w-[70px] md:h-[70px] w-[30px] h-[30px] rounded-full bg-[#5d6680]">
          <img src="/people-02.png" alt="people" className="w-full h-full"/>
        </div>
        <div className="absolute md:top-1/2 md:left-[45%] top-1/2 left-[45%] md:w-[70px] md:h-[70px] w-[30px] h-[30px] rounded-full bg-[#5d6680]">
          <img src="/people-03.png" alt="people" className="w-full h-full"/>
        </div>
      </motion.div>
    </motion.div>
  </section>
);

export default World;

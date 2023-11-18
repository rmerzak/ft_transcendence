'use client';
import { motion } from "framer-motion";
import { TypingText } from "..";
import styles from "../..";
import { FadeIn, fadeIn, staggerContainer, textVariant } from "../../../utils/motion";
const About = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <div className="gradient-02 z-0 " />
    <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.25 }} className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}>
      <TypingText title="| About PingPong" textStyles="text-center" />
      <motion.p variants={fadeIn('up', 'tween', 0.2, 1)} className="mt-[8px] font-normal sm:text-[32px] text-[20px text-center text-neutral-400">
        Dive into the future of gaming with <span className="font-extrabold text-white p-1"> PingPong </span> our revolutionary single-page app. Experience real-time 'Pong' battles, chat with friends, join channels, and track your game stats—all in one dynamic platform. It's more than just a game; it's the ultimate fusion of gameplay and social connection.
        <span className="font-extrabold text-white p-1"><br />
          Welcome to the PingPong revolution!
        </span>
      </motion.p>
      <motion.img
        variants={fadeIn('up', 'tween', 0.3, 1)}
        src="/arrow-down.svg"
        alt="arrow down"
        className="w-[18px] h-[28px] object-contain mt-[28px]"
      />
    </motion.div>
  </section>
);

export default About;


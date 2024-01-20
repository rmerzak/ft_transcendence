'use client';
import { motion } from "framer-motion";
import { TypingText, TitleText } from "../CustomTexts";
import StartSteps from "../StartSteps";
import styles from "../..";
import { fadeIn, staggerContainer, Variants } from "@/utils/motion";
import { startingFeatures } from "@/constants/index";
const GetStarted = () => (
  <section className="sm:p-16 xs:p-8 px-6 py-12 relative z-10">
    <motion.div
    variants={staggerContainer(1, 1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className="2xl:max-w-[1280px] w-full mx-auto flex lg:flex-row flex-col gap-8"
    >
      <motion.div
        variants={Variants('left')}
        className="flex-1 flex justify-center items-center"
      >
        <img
          src="/ping.webp"
          alt="get-started"
          className="w-[90%] h-[90%] object-contain"
        />
      </motion.div>
      <motion.div
        variants={fadeIn('left', 'tween', 0.2, 1)}
        className="flex-[0.75] flex justify-center flex-col"
      >
        <TypingText title="| How PingPong Works" />
        <TitleText title="Get started with just a few clicks" />
        <div className="mt-[31px] flex flex-col max-w-[370px] gap-[24px]">
          {startingFeatures.map((feature, index) => (
            <StartSteps
              key={feature}
              number={`${index + 1}`}
              text={feature}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  </section>
);

export default GetStarted;

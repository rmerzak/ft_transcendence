

'use client';
import {motion} from 'framer-motion';
import styles from '../index';
import { navVariants } from '../../utils/motion';
const Navbar = () => (
  <motion.nav variants={navVariants} initial="hidden" whileInView="show" className="sm:px-16 px-6 py-8 relative">
   <div className="absolute w-[50%] inset-0 gradient-01" />
    <div
      className="2xl:max-w-[1280px] w-full mx-auto flex justify-between gap-8"
    >
      <img src="/pingsvg.svg" alt="menu" className="w-[30px] h-[30px] object-contain md:w-[50px] md:h-[50px]"/>
      <h2 className="font-extrabold md:text-[24px] text-[16px] leading-[30.24px] text-white"> PingPong
      </h2>
      <a href='/auth/login' className='flex items-center h-fit md:py-4 py-2 md:px-6 px-3 bg-[#25618b] rounded-[32px] md:gap-[12px] gap-[8px]'>
          <img src="/42_logo.svg" alt="head" className='md:w-[24px] md:h-[24px] h-[10px] w-[10px] object-contain' />
          <span className='font-normal md:text-[16px] text-[8px] text-white'>ENTER PINGPONG</span>
        </a>
    </div>
  </motion.nav>
);

export default Navbar;

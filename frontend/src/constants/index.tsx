import { Icon } from "@iconify/react";
import {SideNaveItems} from "./types";
export const team = [
  {
    id: 'profile-1',
    imgUrl: '/aaammari.png',
    title: 'aaammari',
  },
  {
    id: 'profile-2',
    imgUrl: '/ymoutaou.png',
    title: 'ymoutaou',
  },
  {
    id: 'profile-3',
    imgUrl: '/mberri.png',
    title: 'mberri',
  },
  {
    id: 'profile-4',
    imgUrl: '/ylambark.png',
    title: 'ylambark',
  },
  {
    id: 'profile-5',
    imgUrl: '/rabi.png',
    title: 'rmerzak',
  },
];

export const startingFeatures = [
  'Login and find a game that suits you and you want to enter',
  'Enter the game by reading basmalah to be safe',
  'No need to beat around the bush, just stay on the gas and have fun',
];

export const newFeatures = [
  {
    imgUrl: '/vrpano.svg',
    title: 'A new world',
    subtitle:
        'we have the latest update with new world for you to try never mind',
  },
  {
    imgUrl: '/headset.svg',
    title: 'More realistic',
    subtitle:
        'In the latest update, your eyes are narrow, making the world more realistic than ever',
  },
];

export const insights = [
  {
    imgUrl: '/planet-06.png',
    title: 'The launch of the Metaverse makes Elon musk ketar-ketir',
    subtitle:
        'Magna etiam tempor orci eu lobortis elementum nibh tellus molestie. Diam maecenas sed enim ut sem viverra alique.',
  },
  {
    imgUrl: '/planet-07.png',
    title: '7 tips to easily master the madness of the Metaverse',
    subtitle:
        'Vitae congue eu consequat ac felis donec. Et magnis dis parturient montes nascetur ridiculus mus. Convallis tellus id interdum',
  },
  {
    imgUrl: '/planet-08.png',
    title: 'With one platform you can explore the whole world virtually',
    subtitle:
        'Quam quisque id diam vel quam elementum. Viverra nam libero justo laoreet sit amet cursus sit. Mauris in aliquam sem',
  },
];

export const socials = [
  {
    name: 'twitter',
    url: '/twitter.svg',
  },
  {
    name: 'linkedin',
    url: '/linkedin.svg',
  },
  {
    name: 'instagram',
    url: '/instagram.svg',
  },
  {
    name: 'facebook',
    url: '/facebook.svg',
  },
];

export const navItems: SideNaveItems[] = [
  {
    title: 'Home',
    path: '/dashboard/home',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: 'Profile',
    path: '/dashboard/profile',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: 'Chat',
    path: '/dashboard/chat',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: 'Friends',
    path: '/dashboard/friends',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: 'Game',
    path: '/dashboard/game',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  }
]

export const Menu = [
  {
    name: 'Profile',
    url: '/dashboard/profile',
  },
  {
    name: 'Settings',
    url: '/dashboard/profile',
  },
  {
    name: 'Logout',
    url: '/dashboard/profile',
  },
];
'use client'
import { ContextGlobal } from '@/context/contex';
import React, { useContext } from 'react'

const Dashboard = () => {
  const { socket, setSocket }: any = useContext(ContextGlobal);
  return (
    <div>
      socket {socket?.id}
    </div>
  )
}

export default Dashboard


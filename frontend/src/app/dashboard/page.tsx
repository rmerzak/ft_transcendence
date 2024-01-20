'use client'
import { ContextGlobal } from '@/context/contex';
import React, { useContext } from 'react'

const Dashboard = () => {
  const { socket, setSocket, chatSocket }: any = useContext(ContextGlobal);
  return (
    <div>
      socket {socket?.id}******
      chatSocket {chatSocket?.id}
    </div>
  )
}

export default Dashboard


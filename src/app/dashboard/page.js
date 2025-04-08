'use client'
import { AuthContext } from '@/context/auth';
import React, { useContext } from 'react'

const Dashboard = () => {
  const globalData = useContext(AuthContext);
  const isLogged = globalData.isLogged
  console.log(globalData);
  if(!isLogged){
    return(<>Please Login first</>)
  }
  return (
    <div>Dashboard here</div>
  )
}

export default Dashboard;
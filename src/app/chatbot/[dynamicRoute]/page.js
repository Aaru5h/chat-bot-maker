"use client"
import { useParams } from 'next/navigation'
import React from 'react'

export default function Page(){
  const params = useParams();
  console.log(params);
  return <div>{params.dynamicRoute}</div>
}
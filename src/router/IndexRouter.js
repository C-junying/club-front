import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '@/views/login/Login'
import Index from '@/views/index/Index'
import BackStage from '@/views/backstage/BackStage'

export default function IndexRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/backstage/*" element={<BackStage />} />
        <Route path="/" element={<Index />} />
        {/* <Route path="/" element={localStorage.getItem('token') ? <Home /> : <Navigate to="/login" />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

import React from 'react';
import { Layout } from 'antd';
import SideMenu from '@/components/back-stage/SideMenu';
import TopHeader from '@/components/back-stage/TopHeader';
import BottomFooter from '@/components/back-stage/BottomFooter';
import './BackStage.css';
import { Outlet } from 'react-router-dom';
const { Content } = Layout;
export default function BackStage() {
  return (
    <Layout>
      <SideMenu />
      <Layout>
        <TopHeader />
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'auto',
            background: 'white',
          }}>
          <div
            style={{
              padding: 18,
              minHeight: 560,
              background: 'white',
            }}>
            {/* <BackStageRouter /> */}
            <Outlet />
          </div>
        </Content>
        <BottomFooter />
      </Layout>
    </Layout>
  );
}

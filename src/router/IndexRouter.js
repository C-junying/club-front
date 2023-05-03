import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import Login from '@/views/login/Login'
import Register from '@/views/register/Register'
import Index from '@/views/index/Index'
import BackStage from '@/views/backstage/BackStage'
import Home from '@/views/backstage/home/Home'
import UserList from '@/views/backstage/user-manage/UserList'
import RoleList from '@/views/backstage/right-manage/RoleList'
import MenuList from '@/views/backstage/right-manage/MenuList'
import Error from '@/components/back-stage/Error'
import AuthRouter from './AuthRouter'
import AreaList from '@/views/area/AreaList'
import ClubList from '@/views/club/club/ClubList'
import ActivityList from '@/views/activity/activity/ActivityList'

// const LazyLoad = (path) => { //传入在view 下的路径
//   const Comp = React.lazy(() => import(`../view${path}`))
//   return (
//       <React.Suspense fallback={<> 加载中...</>}>
//           <Comp />
//       </React.Suspense>
//   )
// }

export default function IndexRouter() {
  const routes = useRoutes([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/',
      element: <Index />,
    },
    {
      path: '/backstage',
      element: <AuthRouter element={<BackStage />} />,
      children: [
        {
          path: '',
          element: <Navigate to="home" />,
        },
        {
          path: 'home',
          element: <Home />,
        },
        {
          path: 'users/list',
          element: <UserList />,
        },
        {
          path: 'admin/role',
          element: <RoleList />,
        },
        {
          path: 'admin/menu',
          element: <MenuList />,
        },
      ],
    },
    {
      path: '/club',
      element: <AuthRouter element={<BackStage />} />,
      children: [
        {
          path: 'list',
          element: <ClubList />,
        },
      ],
    },
    {
      path: '/activity',
      element: <AuthRouter element={<BackStage />} />,
      children: [
        {
          path: 'list',
          element: <ActivityList />,
        },
      ],
    },
    {
      path: '/area',
      element: <AuthRouter element={<BackStage />} />,
      children: [
        {
          path: 'list',
          element: <AreaList />,
        },
      ],
    },
    {
      path: '*',
      element: <Error />,
    },
  ])
  return routes
}

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
import ClubTypeList from '@/views/club/club-type/ClubTypeList'
import ActivityTypeList from '@/views/activity/activity-type/ActivityTypeList'
import ClubApply from '@/views/club/club-apply/ClubApply'
import ClubApplyList from '@/views/club/club-apply/ClubApplyList'
import ClubPriview from '@/components/club/ClubPriview'
import AuditApplyList from '@/views/club/club-apply/AuditApplyList'
import TeacherList from '@/views/backstage/teacher/TeacherList'
import MyClub from '@/views/club/club/my-club/MyClub'
import MyClubIntro from '@/views/club/club/my-club/MyClubIntro'
import ClubInformation from '@/views/club/club/my-club/ClubInformation'
import ClubMember from '@/views/club/club/my-club/ClubMember'
import ClubReport from '@/views/club/club/my-club/ClubReport'
import ClubActivity from '@/views/club/club/my-club/ClubActivity'

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
        {
          path: 'teacher/list',
          element: <TeacherList />,
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
        {
          path: 'club-type/list',
          element: <ClubTypeList />,
        },
        {
          path: 'club-apply/apply',
          element: <ClubApply />,
        },
        {
          path: 'club-apply/list',
          element: <ClubApplyList />,
        },
        {
          path: 'club-apply/list/preview/:applyId',
          element: <ClubPriview />,
        },
        {
          path: 'club-apply/audit/list/preview/:applyId',
          element: <ClubPriview />,
        },
        {
          path: 'club-apply/audit/list',
          element: <AuditApplyList />,
        },
        {
          path: 'my-club',
          element: <MyClub />,
        },
        {
          path: 'my-club/:clubId/intro',
          element: <MyClubIntro />,
          children: [
            {
              path: '',
              element: <Navigate to="information" />,
            },
            {
              path: 'information',
              element: <ClubInformation />,
            },
            {
              path: 'member',
              element: <ClubMember />,
            },
            {
              path: 'activity',
              element: <ClubActivity />,
            },
            {
              path: 'report',
              element: <ClubReport />,
            },
          ],
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
        {
          path: 'activity-type/list',
          element: <ActivityTypeList />,
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

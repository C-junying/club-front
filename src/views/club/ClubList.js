import React, { useEffect, useState } from 'react'
import { Table, Input } from 'antd'
import { NavLink } from 'react-router-dom'
import { dateFormat } from '@/utils/time'
import { http } from '@/utils/http'
import HeanderTitle from '@/components/other/HeanderTitle'

const { Search } = Input
// 社团列表
export default function ClubList() {
  // table
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    http.post('/club/getClubsAll').then((res) => {
      setDataSource(res.data.data)
    })
  }, [])
  const columns = [
    {
      title: '社团名称',
      dataIndex: 'club_name',
      key: 'club_name',
      render: (key, item) => {
        return (
          <NavLink to={`/club/my-club/${item['club_id']}/intro`}>
            <b>{key}</b>
          </NavLink>
        )
      },
    },
    {
      title: '社长',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (key) => {
        return <b>{key}</b>
      },
    },
    {
      title: '社团类型',
      dataIndex: 'type_name',
      key: 'type_name',
    },
    {
      title: '社团场地',
      dataIndex: 'area_name',
      key: 'area_name',
    },
    {
      title: '社团logo',
      dataIndex: 'picture',
      key: 'picture',
      render: (pic) => {
        return pic !== null && pic !== '' ? <img src={pic} alt="无" style={{ width: 50 }} /> : ''
      },
    },
    {
      title: '创建时间',
      dataIndex: 'reply_time',
      key: 'reply_time',
      render: (time) => {
        return dateFormat(time)
      },
    },
  ]
  // 搜索
  const onSearch = (value) => {
    let href = '/club/searchClubsAll'
    if (value === '') {
      href = '/club/getClubsAll'
    }
    http.post(href, { keywords: value }).then((res) => {
      setDataSource(res.data.data)
    })
  }
  return (
    <>
      <div id="user_top" style={{ justifyContent: 'space-between' }}>
        <HeanderTitle title="社团列表" />
        <div></div>
        <Search
          className="user_search"
          placeholder="社团名称 社长 社团类型"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />
      </div>
      <Table
        id="table-antn-menu"
        columns={columns}
        rowKey="club_id"
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          hideOnSinglePage: true,
          showSizeChanger: true,
          defaultPageSize: 5,
          total: dataSource.length,
          showTotal: (total) => `总共：${total}个`,
        }}
        dataSource={dataSource}
      />
    </>
  )
}

import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Avatar } from 'antd'
import HeanderTitle from '@/components/other/HeanderTitle'
import { http } from '@/utils/http'

import { group } from '@/utils/myMethod'
import { useNavigate } from 'react-router-dom'
const { Meta } = Card
// 我的社团
export default function MyClub() {
  const navigate = useNavigate()
  // 表格数据
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    http.post('/club/getUserClubs').then((res) => {
      setDataSource(group(res.data.data, 3))
    })
  }, [])
  const onClick = (item) => {
    navigate(`${item}/intro`)
  }
  return (
    <>
      <HeanderTitle title="我的社团" />

      {dataSource.map((row, idx) => {
        return (
          <Row gutter={32} key={idx} style={{ marginBottom: 20, marginLeft: 25 }}>
            {row.map((club) => {
              return (
                <Col span={7} key={club['club_id']} onClick={() => onClick(club['club_id'])}>
                  <Card
                    hoverable
                    style={{ background: '#FAFAFAD0' }}
                    cover={<img alt="example" src={club['picture']} style={{ height: 150 }} />}>
                    <Meta
                      avatar={<Avatar src={club['type_picture']} />}
                      title={club['club_name']}
                      description={club['type_name']}
                    />
                  </Card>
                </Col>
              )
            })}
          </Row>
        )
      })}
    </>
  )
}

import React, { useState } from 'react'
import { Steps, Button, Form } from 'antd'
import HeanderTitle from '@/components/other/HeanderTitle'
import '../../index.css'
import ApplyComponent from '@/components/other/ApplyComponent'
import ClubApplyComponent from '../../../components/club/ClubApplyComponent'

const items = [
  {
    title: '基本信息',
    description: '申请内容',
  },
  {
    title: '社团内容',
    description: '社团主体内容',
  },
  {
    title: '社团提交',
    description: '保存草稿或者提交审核',
  },
]
export default function ClubApply() {
  // 控制下一步，上一步
  const [current, setCurrent] = useState(0)
  const [applyForm] = Form.useForm()
  //   申请信息
  const [applyInfo, setApplyInfo] = useState({})
  const [clubContentForm] = Form.useForm()
  // 社团信息
  const [clubContent, setClubContent] = useState({})
  const handleNext = () => {
    if (current === 0) {
      applyForm
        .validateFields()
        .then((res) => {
          console.log(res)
          setApplyInfo(res)
          setCurrent(current + 1)
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      clubContentForm
        .validateFields()
        .then((res) => {
          console.log(res)
          setClubContent(res)
          setCurrent(current + 1)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
  // 上一页
  const handlePrevious = () => {
    setCurrent(current - 1)
  }
  // 保存
  const handleSave = (auditState) => {
    console.log(auditState)
  }
  return (
    <div>
      <HeanderTitle title="申请社团" />
      <Steps current={current} items={items} />
      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : 'active'}>
          <ApplyComponent form={applyForm} />
        </div>
        <div className={current === 1 ? '' : 'active'}>
          <ClubApplyComponent form={clubContentForm} />
        </div>
      </div>
      {/* 下一步 上一步 保存 提交 */}
      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存申请
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
      </div>
    </div>
  )
}

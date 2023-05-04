import React from 'react'
import './index.css'
export default function HeanderTitle(props) {
  const title = props.title
  const subTitle = props.subTitle
  return (
    <div className="header-title">
      <div className="title">{title}</div>
      <div className="sub-title" hidden={!subTitle}>
        {subTitle}
      </div>
    </div>
  )
}

import * as React from 'react';
import './styles.css';

type Props = {
  title: string
  index: number
  setSelectedTab: (index: number) => void
}

const TabTitle: React.FC<Props> = ({ title, setSelectedTab, index }) => {
  const [isActive, setIsActive] = React.useState(false);
  const SelectedTab=(index:any)=>{
    setSelectedTab(index)
    setIsActive(current=>!current)
  }

  return (
      <button className={isActive ? 'nav-link active':'nav-link'} type='button' onClick={() => SelectedTab(index)}>{title}</button>
  )
}

export default TabTitle
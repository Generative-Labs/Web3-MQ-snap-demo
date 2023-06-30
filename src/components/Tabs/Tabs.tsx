import { ReactNode, useState } from "react";
import './Tabs.scss'

interface TabItemType {
  label: string,
  key: number | string,
  children: ReactNode,
}
interface ITabsProps {
  defaultActiveKey?: number | string
  items: TabItemType[]
}

export function Tabs(prop: ITabsProps) {
  const { items, defaultActiveKey } = prop;
  const [segmentValue, setSegmentValue] = useState<number | string>(defaultActiveKey || items[0].key);
  return (
    <div className="mq-tabs">
      <div className="tablist">
        {items.map(({ key, label}) => (
          <div className="tabOuter" key={key}>
            <div
              className={`tab ${key === segmentValue  ? 'active': ''}`}
              key={label}
              onClick={() => setSegmentValue(key)}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
      <div className="tabscontent">
        {items.find(item => item.key === segmentValue)?.children}
      </div>
    </div>
  )
}
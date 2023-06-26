import { EmptyList } from "../../../components/EmptyList";
import { ChatIcon } from "../../../icons";
import { ChannelItemType } from "../../../services/snap/dto";
import './list.scss'
import { Item } from "./Item";

interface IProp {
  list: ChannelItemType[] | any[]
}

export function List({ list }: IProp) {

  if (!list?.length) {
    return (
      <div className="mq-chat-list">
        <EmptyList icon={<ChatIcon />} title="Your message list is empty" />
      </div>
    )
  }
  return (
    <div className="mq-chat-list">
      {list.map((channel) => {
        return (
          <Item key={channel.chatid} channel={channel} />
        )
      })}
    </div>
  )
}
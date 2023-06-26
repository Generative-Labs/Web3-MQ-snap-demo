import { EmptyList } from "../../../../EmptyList"
import { ContactIcon } from "../../../../icons"
import { ContactListItemType } from "../../../../services/snap/dto"
import Item from "./Item"


interface IProp {
  list: ContactListItemType[]
}

export function List({ list }: IProp) {
  if (!list?.length) {
    return <EmptyList icon={<ContactIcon />} title="Your contact list is empty"/>
  }
  return (
    <div>
      {list.map((item) => {
        return (
          <Item key={item.wallet_address} user={item}/>
        )
      })}
    </div>
  )
}
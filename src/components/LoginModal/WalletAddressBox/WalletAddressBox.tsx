import { getShortAddressByAddress } from "../../../services/utils/utils";
import { MetaMaskIcon } from "../../../icons";

import ss from './index.module.scss'
interface IProps {
  address: string;
}

export const RenderWalletAddressBox = ({ address = '' }: IProps) => {
  if (!address) return <div></div>;
  return (
    <div className={ss.addressBox}>
      <MetaMaskIcon />
      <div className={ss.centerText}>MetaMask</div>
      <div className={ss.addressText}>{getShortAddressByAddress(address)}</div>
    </div>
  );
}
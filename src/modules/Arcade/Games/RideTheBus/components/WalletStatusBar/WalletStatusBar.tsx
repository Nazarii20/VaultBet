import React from 'react';
import CustomButton from '../CustomButton/CustomButton';
import { panelsLight } from '../../utils/variables';
import MoneyState from '../MoneyState/MoneyState';
import './WalletStatusBar.css';

export default function WalletStatusBar() {
  return (
    <section className="wallet-section">
      <MoneyState />

      <div className="walltet-section__buttons">
        <CustomButton
          backgroundColor={panelsLight}
          paddingBlock="8"
          paddingBlockMobile="16"
          paddingInline="24"
          paddingInlineMobile="18"
          borderRadius="8"
          isBorderExist={true}
        >
          Deposit
        </CustomButton>

        <CustomButton
          backgroundColor={panelsLight}
          paddingBlock="8"
          paddingBlockMobile="16"
          paddingInline="24"
          paddingInlineMobile="18"
          borderRadius="8"
          isBorderExist={true}
        >
          Withdrawal
        </CustomButton>
      </div>
    </section>
  )
}

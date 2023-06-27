import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import cx from 'classnames';

import { CloseBtnIcon } from '../../icons';

import ss from './index.module.scss';

interface IProps {
  visible: boolean;
  appType?: string;
  closeModal: () => void;
  containerId?: string;
  modalHeader?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  dialogClassName?: string;
  title?: string;
  leftBtn?: React.ReactNode;
}

export const Modal = React.memo((props: PropsWithChildren<IProps>) => {
  const {
    visible,
    appType = 'pc',
    closeModal,
    containerId = '',
    modalHeader,
    leftBtn = null,
    children,
    style = {},
    className = '',
    title = '',
    dialogClassName = '',
  } = props;
  const [active, setActive] = useState<boolean>(false);
  const [aniClassName, setAniClassName] = useState<string>('');
  const [contentClassName, setContentClassName] = useState<string>('');
  const bodyOverflow = useRef(window.getComputedStyle(document.body).overflow);

  const onTransitionEnd = () => {
    setAniClassName(visible ? 'enterDone' : 'exitDone');
    setContentClassName(visible ? 'contentEnterDone' : 'contentExitDone');
    if (!visible) {
      setActive(false);
    }
  };

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      setActive(true);
      setAniClassName('enter');
      setContentClassName('contentEnter');
      setTimeout(() => {
        setAniClassName('enterActive');
        setContentClassName('contentEnterActive');
      });
    } else {
      document.body.style.overflow = bodyOverflow.current;
      setAniClassName('exit');
      setContentClassName('contentExit');
      setTimeout(() => {
        setAniClassName('exitActive');
        setContentClassName('contentExitActive');
      });
    }
    return () => {
      document.body.style.overflow = bodyOverflow.current;
    };
  }, [visible]);

  const handleClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  if (!visible && !active) {
    return null;
  }
  return createPortal(
    <div
      style={style}
      className={cx(ss.modal, ss[aniClassName], className)}
      onTransitionEnd={onTransitionEnd}
      onClick={handleClick}
    >
      <div
        className={cx(ss.dialog, dialogClassName, ss[contentClassName], {
          [ss.mobileStyle]: appType !== 'pc',
        })}
      >
        {modalHeader || (
          <div className={ss.titleContainer}>
            <div className={ss.leftBtn}>{leftBtn}</div>
            <div className={ss.title}>{title}</div>
            <CloseBtnIcon onClick={closeModal} className={ss.closeBtn} />
          </div>
        )}
        {children}
      </div>
    </div>,
    document.getElementById(containerId) || document.body
  );
});

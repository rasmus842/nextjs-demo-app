import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: Boolean;
  title: String;
  buttonText?: String;
  children: React.ReactNode;
  onCancel: () => void;
};

export default function Modal({
  isOpen,
  title,
  buttonText,
  children,
  onCancel
}: ModalProps) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const defaultButtonText = 'Cancel';

  const submit = () => {
    onCancel();
  };

  const close = () => {
    onCancel();
  };

  return isBrowser && isOpen
    ? createPortal(
        <>
          <div className="text-black bg-gray-500 z-20 w-1/3 h-1/3 absolute top-1/3 left-1/3 border-black border-2 rounded p-3 ">
            <header>
              <h2>{title}</h2>
            </header>
            {children}
            <button onClick={submit}>{buttonText ?? defaultButtonText}</button>
          </div>
          <Backdrop onClick={close} />
        </>,
        document.getElementById('portal')!
      )
    : null;
}

interface BackdropProps {
  onClick: () => void;
}

function Backdrop({ onClick }: BackdropProps) {
  return (
    <div
      className="z-10 w-full h-full absolute top-0 left-0 bg-black opacity-50"
      onClick={onClick}
    ></div>
  );
}

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const Header = () => {
  const router = useRouter();
  const linkClasses = 'hover:cursos-pointer hover:opacity-70';

  /*
button {
    background-color: #44449B;
    color: #DDEDF4;
    border: none;
    border-radius: 4px;
    padding: 8px;
    align-self: center;
}
  */

  return (
    <header className="fixed top-0 w-full flex items-center gap-9 p-2 text-gray-100 bg-slate-900 whitespace-nowrap">
      <div className="flex items-center gap-2 text-2xl">
        <p>
          <strong>Next-js TODO app</strong>
        </p>
      </div>
      <ul className="flex ml-auto gap-3">
        <Link className={linkClasses} href="/">
          Home
        </Link>
        <Link className={linkClasses} href="/about">
          About
        </Link>
        <Link className={linkClasses} href="/contact">
          &#9993; Contact
        </Link>
        <Link className={linkClasses} href="/shop">
          Shop
        </Link>
        <Link className={linkClasses} href="/account">
          &#128100; My Account
        </Link>
      </ul>
      <button
        onClick={() => router.push('/cart')}
        className={'bg-purple-700 px-2 py-1 rounded ' + linkClasses}
      >
        &#128722; My Cart
      </button>
    </header>
  );
};

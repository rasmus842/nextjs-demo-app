import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from '~/utils/use-session';

const linkClasses = 'hover:cursor-pointer hover:opacity-70';

export const Header = () => {
  const session = useSession();

  const router = useRouter();

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
        {!session.isAuthorised && (
          <>
            <Link className={linkClasses} href="/login">
              Login
            </Link>
            <Link className={linkClasses} href="/signup">
              Sign up
            </Link>
          </>
        )}
        {session.isAuthorised && (
          <Link className={linkClasses} href="/account">
            &#128100; My Account
          </Link>
        )}
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

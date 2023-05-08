import React from 'react';
import Link from 'next/link';

const Menu = () => {
    return (
        <nav className="menu-nav">
            <ul className="menu-ul">
                <li className="menu-li">
                    <Link href="/" className="menu-a">
                        Home
                    </Link>
                </li>
                <li className="menu-li">
                    <Link href="/instructions" className="menu-a">
                        Instructions (How to)
                    </Link>
                </li>

                <li className="menu-li">
                    {/* <Link href="/all-books" className="menu-a">
                        All Books
                    </Link> */}
                </li>
            </ul>
        </nav>
    );
};

export default Menu;
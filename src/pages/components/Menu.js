import React from 'react';
import Link from 'next/link';

const Menu = () => {
    return (
        <nav className="menu-nav">
            <h1 className="logo-name">Beanbook</h1>
            <ul className="menu-ul">
                <li className="menu-li">
                    <Link href="/" className="menu-a">
                        Create Book
                    </Link>
                </li>
                <li className="menu-li">
                    <Link href="/all-books" className="menu-a">
                        All Books
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;

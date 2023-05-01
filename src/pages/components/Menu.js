// Menu.js
import React from 'react';

const Menu = () => {
    return (
        <nav className="menu-nav">
            <h1 className="logo-name">Beanbook</h1>
            <ul className="menu-ul">
                <li className="menu-li">
                    <a className="menu-a" href="/">
                        Create Book
                    </a>
                </li>
                <li className="menu-li">
                    <a className="menu-a" href="/all-books">
                        All Books
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;

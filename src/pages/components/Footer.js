import React from 'react';
import ShareButtons from '../components/ShareButtons';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer>
            <>
                <Link href="/instructions/">
                    <p>Instructions</p>
                </Link>
                <ShareButtons />
                <p>App by <a href="https://appai.dev">https://appai.dev</a></p>
            </>
            <div className="shooting-stars"></div>
        </footer>
    );
};

export default Footer;

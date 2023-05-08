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
                <br />
                <p>App made with ❤️</p>
                <p>by <a href="https://appai.dev">AppAI.dev</a></p>
                <br />
                <ShareButtons />
            </>
            <div className="shooting-stars"></div>
        </footer>
    );
};

export default Footer;

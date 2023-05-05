import React from 'react';
import ShareButtons from '../components/ShareButtons';

const Footer = () => {
    return (
        <footer>
            <>
                <p><a href="/instructions">Instructions</a></p>
                <ShareButtons />
                <p>App by <a href="https://appai.dev">https://appai.dev</a></p>
            </>
            <div className="shooting-stars"></div>
        </footer>
    );
};

export default Footer;

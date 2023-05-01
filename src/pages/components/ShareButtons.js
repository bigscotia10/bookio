import React from 'react';
import styles from './ShareButtons.module.css';

const ShareButtons = () => {
    const shareUrl = encodeURIComponent('https://your-app-url.com');
    const shareText = encodeURIComponent('Check out this cool app!');

    return (
        <div className={styles.shareButtons}>
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.facebook}
            >
                Share on Facebook
            </a>
            <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.twitter}
            >
                Share on Twitter
            </a>
            <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=My%20App%20Title&summary=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkedin}
            >
                Share on LinkedIn
            </a>
        </div>
    );
};

export default ShareButtons;

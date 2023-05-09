import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import styles from './ShareButtons.module.css';

const ShareButtons = () => {
    const shareUrl = encodeURIComponent('https://your-app-url.com');
    const shareText = encodeURIComponent('Check out this cool app!');

    return (
        <div className={styles.shareButtons}>
            <a href="https://www.facebook.com/sharer/sharer.php?u=https://littlebean.appai.dev/" target="_blank" rel="noopener noreferrer" className={styles.facebook}>
                <FontAwesomeIcon icon={faFacebook} />
            </a>

            <a href="https://twitter.com/intent/tweet?url=https://littlebean.appai.dev/&text=Check%20out%20LittleBean!&via=LittleBeanApp" target="_blank" rel="noopener noreferrer" className={styles.twitter}>
                <FontAwesomeIcon icon={faTwitter} />
            </a>

            <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://littlebean.appai.dev/" target="_blank" rel="noopener noreferrer" className={styles.linkedin}>
                <FontAwesomeIcon icon={faLinkedin} />
            </a>

        </div>
    );
};

export default ShareButtons;

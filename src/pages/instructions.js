import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';
import styles from './AllBook.module.css'; // Import the CSS module for this page

function Instructions() {

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Header />
            </header>
            <nav className={styles.menu}>
                <Menu />
            </nav>
            <h1 className={styles.title}>Instructions</h1>
            <div className={styles.instructionsContainer}>
                <ol className={styles.instructionsList}>
                    <li className={styles.instructionsListItem}>Fill out a creative title for your book idea.</li>
                    <li className={styles.instructionsListItem}>Select an already curated book idea, or write your own book details.</li>
                    <li className={styles.instructionsListItem}>Describe your idea in the provided text area and hit the Generate Text button.</li>
                    <li className={styles.instructionsListItem}>The app will automatically generate book content for you to use.</li>
                    <li className={styles.instructionsListItem}>After the book content is generated, update each page as you'd like.</li>
                    <li className={styles.instructionsListItem}>Once you're happy with each page's content, hit the Generate Image button.</li>
                    <li className={styles.instructionsListItem}>The app will bring back relevant images for each book page.</li>
                    <li className={styles.instructionsListItem}>Once you're done, hit the Save Book button to save your book and download it.</li>
                    <li className={styles.instructionsListItem}>If you have any feedback, feel free to get in touch with us here: <a href="https://appai.dev/#contact" target="_blank" rel="noopener noreferrer" className={styles.feedbackLink}>https://appai.dev/#contact</a></li>
                </ol>
            </div>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default Instructions;

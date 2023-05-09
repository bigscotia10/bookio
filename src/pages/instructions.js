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
                    <li className={styles.instructionsListItem}>Create a book title.</li>
                    <li className={styles.instructionsListItem}>Choose or write book details.</li>
                    <li className={styles.instructionsListItem}>Describe your idea.</li>
                    <li className={styles.instructionsListItem}>Click &apos;Generate Text&apos; for automatic content.</li>
                    <li className={styles.instructionsListItem}>Edit content as needed.</li>
                    <li className={styles.instructionsListItem}>Generate images for each page.</li>
                    <li className={styles.instructionsListItem}>Save your book when satisfied.</li>
                    <li className={styles.instructionsListItem}>Contact us for feedback: <a href="https://appai.dev/#contact" target="_blank" rel="noopener noreferrer" className={styles.feedbackLink}>https://appai.dev/#contact</a></li>
                </ol>
            </div>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default Instructions;

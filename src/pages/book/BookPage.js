import React from 'react';
import styles from './Book.module.css'; // Import the CSS module for this page
import Header from '../components/Header';
import Menu from '../components/Menu';
import Footer from '../components/Footer';

// Rest of your BookPage.js code...


export default function BookPage({ book }) {
    if (!book) {
        return <div>Please provide a valid book data.</div>;
    }
    return (
        <>
            <header className={styles.headerSection}>
                <Header />
            </header>
            <nav className={styles.menuSection}>
                <Menu />
            </nav>
            <main className={styles.bookPageSection}>
                <BookPage book={book} />
            </main>
            <footer className={styles.footerSection}>
                <Footer />
            </footer>
        </>
    );
}

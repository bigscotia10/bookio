import React from 'react';
import styles from './Book.module.css'; // Import the CSS module for this page


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

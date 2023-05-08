import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import Link from 'next/link';
import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';
import styles from './AllBook.module.css'; // Import the CSS module for this page

function AllBooks() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        async function fetchBooks() {
            const booksRef = collection(db, 'books');
            const booksQuery = query(booksRef, orderBy('title'));
            const booksSnapshot = await getDocs(booksQuery);

            const booksData = await Promise.all(
                booksSnapshot.docs.map(async (bookDoc) => {
                    const bookData = bookDoc.data();

                    // Fetch the first page of the book
                    const pagesRef = collection(bookDoc.ref, 'pages');
                    const pagesQuery = query(pagesRef, orderBy('pageIndex'), limit(1));
                    const pagesSnapshot = await getDocs(pagesQuery);

                    if (pagesSnapshot.docs.length > 0) {
                        bookData.firstPage = pagesSnapshot.docs[0].data();
                    }

                    return {
                        id: bookDoc.id,
                        ...bookData,
                    };
                })
            );

            setBooks(booksData);
        }

        fetchBooks();
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Header />
            </header>
            <nav className={styles.menu}>
                <Menu />
            </nav>
            <h1 className={styles.title}>All Books</h1>
            <div className={styles.booksContainer}>
                {books.map((book, index) => (
                    <div key={book.id} className={styles.bookContainer}>
                        <h2>
                            <Link href={`/book/${book.id}`}>{book.title}</Link>
                        </h2>
                        {book.firstPage && book.firstPage.image && (
                            <img
                                src={book.firstPage.image}
                                alt={`Illustration for the first page of ${book.title}`}
                                className={styles.full_width_image}
                            />
                        )}
                        <p className={styles.description}>{book.description}</p>
                        {((index + 1) % 3 === 0) && <div className={styles.rowSeparator} />}
                    </div>
                ))}
            </div>
            <footer>
                <Footer />
            </footer>
        </div>
    );

}

export default AllBooks;

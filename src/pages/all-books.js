import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import Link from 'next/link';

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
        <div>
            <h1>All Books</h1>
            <div>
                {books.map((book) => (
                    <div key={book.id} style={{ margin: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
                        <h2>
                            <Link href={`/book/${book.id}`}>
                                {book.title}
                            </Link>
                        </h2>
                        {book.firstPage && book.firstPage.image && (
                            <img src={book.firstPage.image} alt={`Illustration for the first page of ${book.title}`} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
                        )}
                        <p>{book.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllBooks;

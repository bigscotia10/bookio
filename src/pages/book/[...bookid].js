import { useRouter } from 'next/router';
import BookPage from '../components/BookPage';
import { db } from '../../firebase'; // Import the Firestore instance
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';

export default function Book({ book }) {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return <BookPage book={book} />;
}

export async function getServerSideProps({ params }) {
    const bookid = params.bookid[0];

    const bookRef = doc(collection(db, 'books'), bookid);
    const bookDoc = await getDoc(bookRef);

    if (!bookDoc.exists()) {
        return {
            notFound: true,
        };
    }

    const bookData = bookDoc.data();

    // Fetch pages subcollection data
    const pagesQuery = query(collection(bookRef, 'pages'), orderBy('pageIndex', 'asc'));
    const pagesSnapshot = await getDocs(pagesQuery);
    const pagesData = pagesSnapshot.docs.map(doc => doc.data());

    // Add pages data to the book data object
    bookData.pages = pagesData;

    return {
        props: {
            book: bookData,
        },
    };
}

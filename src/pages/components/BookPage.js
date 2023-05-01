import React from 'react';

export default function BookPage({ book }) {
    if (!book) {
        return <div>Please provide a valid book data.</div>;
    }

    return (
        <div>
            <div className="styles.bookPage"></div>
            <h1 className="styles.bookTitle">{book.title}</h1>
            <p className="styles.bookDescription">{book.description}</p>
            {book.pages && book.pages.map((page, index) => (
                <div key={index} className="styles.pageContent">
                    <h2>Page {index + 1}</h2>
                    <p>{page.text}</p>
                    {page.image && <img src={page.image} alt={`Illustration for page ${index + 1}`} />}
                </div>
            ))}
        </div>
    );
}

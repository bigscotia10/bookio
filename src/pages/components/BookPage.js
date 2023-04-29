import React from 'react';

export default function BookPage({ book }) {
    if (!book) {
        return <div>Please provide a valid book data.</div>;
    }

    return (
        <div>
            <h1>{book.title}</h1>
            <p>{book.description}</p>
            {book.pages && book.pages.map((page, index) => (
                <div key={index}>
                    <h2>Page {index + 1}</h2>
                    <p>{page.text}</p>
                    {page.image && <img src={page.image} alt={`Illustration for page ${index + 1}`} />}
                </div>
            ))}
        </div>
    );
}

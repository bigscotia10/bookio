import { useState, useEffect } from 'react';
import axios from 'axios';
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';
import { db } from '../firebase';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';
import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';

export default function Home() {
  const [bookTitle, setBookTitle] = useState('');
  const [bookImage, setBookImage] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookContent, setBookContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [manualAdd, setManualAdd] = useState(false);
  const [loadingImageIndex, setLoadingImageIndex] = useState(-1);
  const [isContentGenerated, setIsContentGenerated] = useState(false);
  const router = useRouter();

  const descriptionPrompts = {
    // 'Hey Lisa': `Eamon, a 3-year-old boy, asks Lisa questions about outdoor topics like mountains, animals, weather, and trees. The questions start with "Hey Lisa," and Lisa provides a response. Create a story with alternating pages of Eamon's questions and Lisa's answers.`,
    'Wee Muckys Adventures': `Wee Mucky is a female West Highland Terrier who loves chasing squirrels and eating cheese. Write a story about her humorous adventures in Portland, Oregon, Cape May, New Jersey, and New York City.`,
    // 'Egogo Adventures': `Egogo, a 3-year-old toddler, can transform into different animals, such as crabs, and behave like them. Create a story about his cute and funny adventures in Portland, Oregon, with his best friend BK.`,
    // 'Its Marmie Day': `Egogo, a 3-year-old toddler, and his grandmother Marmie go on different adventures around Portland, OR. They go to the zoo, the icecreme shop, for hikes, as well as fun bike rides.`,
    // 'Papa and Tata': `Papa and Tata, Eamons grandparents live Cape May. Eamon goes to visit Papa and Tata and they go on fun adventures to the beach and to find shells and spot dolphins.`,
    'Seaweed Monster': 'A green seaweed monster called the Waye Aye Man, who lives in the caves of Roker, Sunderland and steals peoples left over fish and chips.',
    'Porsche the Speedster': 'Porsche, a little car named Speedster, is a brave and adventurous car that loves to drive through super fast helping people kids get to the toy shop faster than ever before.',
    'Super Fast: The Train': 'In a world where toy trains transform into lifesize trains: Super Fast, the fastest train ever built. Super Fasts mission is to held toddlers find hidden chocolate in the secret island of Chocoslania',
    'Spyker Jet: The Scottish Sheep Saving Hero': 'Spyker Jet is a kids toy airplane that toddlers can fly around the highlands of scotland helping the local lost sheep find their way home.',
  };

  async function generateAll() {
    setIsLoading(true); // Set loading state to true before generating images
    // Generate images for each page
    for (let i = 0; i < bookContent.length; i++) {
      console.log(`Generating image for page ${i}`);
      await generateImage(i, bookContent[i].text);
      console.log(`Generated image for page ${i}`);
    }
    setIsLoading(false); // Set loading state to false after generating images
    setShowPages(true);
  }

  function removeImage(pageIndex) {
    const updatedContent = [...bookContent];
    updatedContent[pageIndex].image = null;
    setBookContent(updatedContent);
  }

  function Page({ id, index, text, image, onGenerateImage, onRemoveImage }) {
    return (
      <div key={id}>
        <h3>Page {index + 1}</h3>
        <p>{text}</p>
        {image ? (
          <div>
            <img src={image} alt={`Illustration for page ${index + 1}`} />
            <button onClick={() => onRemoveImage(index)}>Remove Image</button>
          </div>
        ) : (
          <button onClick={() => onGenerateImage(index, text)}>Generate Image</button>
        )}
      </div>
    );
  }

  async function generateImage(index, text) {
    console.log(`Generating image for page ${index}`);
    if (index < 0 || index >= bookContent.length) {
      console.error(`Invalid index ${index} for bookContent.`);
      return;
    }
    setLoadingImageIndex(index); // Set loadingImageIndex to the current page index

    const prompt = `Illustrate a scene for a children's book with the following description: ${bookDescription}. On this page, ${text}`;
    // const prompt = `Illustrate a scene from a children's book. The scene is: ${text}`; // Use the "text" variable here


    try {
      console.log('About to send axios request for image generation');
      const response = await axios.post('https://api.openai.com/v1/images/generations', {
        model: 'image-alpha-001',
        prompt: prompt,
        n: 1,
        size: '512x512',
        response_format: 'url',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
      });

      const imageUrl = response.data.data[0].url;

      // Use the API route to fetch the image as a Data URL
      const responseImage = await axios.get(`/api/fetch-image?url=${encodeURIComponent(imageUrl)}`);
      const dataUrl = responseImage.data.dataUrl;

      // Set book content state with new image
      const updatedContent = [...bookContent];
      updatedContent[index].image = dataUrl;
      setBookContent(updatedContent);

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingImageIndex(-1); // Reset loadingImageIndex when the API call is complete
    }
  }

  async function generateContent() {
    setIsLoading(true);
    const description = bookDescription;
    const prompt = descriptionPrompts[description] ? descriptionPrompts[description] : description;

    try {
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: `Using the description provided, create a children's story divided into 10 sections or pages with only 2 sentences per page. The description is as follows:\n\n${prompt}\n\nSection 1: (Page 1)\n[Generate 2 sentences for Page 1]\n\nSection 2: (Page 2)\n[Generate 2 sentences for Page 2]\n\nSection 3: (Page 3)\n[Generate 2 sentences for Page 3]\n\nSection 4: (Page 4)\n[Generate 2 sentences for Page 4]\n\nSection 5: (Page 5)\n[Generate 2 sentences for Page 5]\n\nSection 6: (Page 6)\n[Generate 2 sentences for Page 6]\n\nSection 7: (Page 7)\n[Generate 2 sentences for Page 7]\n\nSection 8: (Page 8)\n[Generate 2 sentences for Page 8]\n\nSection 9: (Page 9)\n[Generate 2 sentences for Page 9]\n\nSection 10: (Page 10)\n[Generate 2 sentences for Page 10]`,
        max_tokens: 2048,
        n: 1,
      }
        , {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          }
        });

      const story = response.data.choices[0].text;

      // Remove section labels from the response text
      const cleanedText = story.replace(/Section \d+: \(Page \d+\)\n/g, '');

      const pages = cleanedText.trim().split('\n\n');
      const parsedPages = pages.map((page, index) => {
        const [text, image] = page.split('\n');
        return { id: `${index}`, text, image: image ? image.slice(7, -1) : '' };
      });

      setBookContent(parsedPages);
      setIsContentGenerated(true); // set isContentGenerated to true
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    setShowPages(true);
  }

  function addPage() {
    setBookContent([...bookContent, { text: '', image: '' }]);
    setShowPages(true);
  }

  function updatePage(event, page) {
    const value = event.target.value;
    const updatedContent = [...bookContent];
    updatedContent[page].text = value;
    setBookContent(updatedContent);
  }

  function updateImage(event, page) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result;
        const updatedContent = [...bookContent];
        updatedContent[page].image = imageDataUrl;
        setBookContent(updatedContent);
      };
      reader.readAsDataURL(file);
    }
  }

  function isAnyPageFilledIn() {
    return bookContent.some((page) => page.text.trim() !== '');
  }

  async function saveBookToFirebase() {
    if (!bookTitle) {
      setValidationMessage('Book title is required.');
      return;
    }

    if (!bookDescription) {
      setValidationMessage('Book description is required.');
      return;
    }

    setIsLoading(true); // Set loading state to true before saving

    try {
      const bookRef = doc(collection(db, 'books'));
      await setDoc(bookRef, {
        title: bookTitle,
        description: bookDescription,
      });

      console.log(`Book created with ID: ${bookRef.id}`);

      for (const [index, page] of bookContent.entries()) {
        console.log(`Creating page ${index}...`);

        const pageData = {
          pageIndex: index,
          text: page.text,
        };

        if (page.image) {
          const storage = getStorage();
          const imageRef = ref(storage, `books/${bookRef.id}/pages/${index}/image`);

          const response = await fetch(page.image);
          const blob = await response.blob();
          await uploadBytes(imageRef, blob);

          const downloadURL = await getDownloadURL(imageRef);
          pageData.image = downloadURL;
        }

        const pageRef = await addDoc(collection(bookRef, 'pages'), pageData);
        console.log(`Page ${index} created with ID: ${pageRef.id}`);
      }

      // Redirect to the book display page
      console.log('Book and pages saved to Firebase.');
      router.push(`/book/${bookRef.id}`);
    } catch (error) {
      console.error(error);
      if (error.code !== 'aborted' && error.code !== 'cancelled') {
        alert('There was an error saving the book. Please try again later.');
      }
    }
  }

  return (
    <div>
      <Header />
      <Menu />
      <label htmlFor="book-title">Book Title:</label>
      <input type="text" placeholder="What's your book title?" id="book-title" name="book-title" value={bookTitle} onChange={event => setBookTitle(event.target.value)} maxLength={250} required />
      <div>
        {/* Disabling the pick a story idea for now, add it back to include the predefined stories from the select list */}
        <select id="description-options" onChange={event => setBookDescription(event.target.value)}>
          <option value="">Optional, Pick a story idea</option>
          {Object.keys(descriptionPrompts).map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}

        </select>
      </div>

      <label htmlFor="book-description">Book Description:</label>
      <input type="text" placeholder="Tell us all about your book!" id="book-description" name="book-description" value={bookDescription} onChange={event => setBookDescription(event.target.value)} required />

      <button onClick={generateContent} disabled={isLoading}>

        {isLoading ? (
          "Please wait... AI is doing it's thing "
        ) : (
          "Generate Book"
        )}

      </button>

      {showPages && (
        <button id="imagesbutton" onClick={generateAll} disabled={bookContent.length === 0 || isLoading}>
          {isLoading ? "Please wait, AI images coming soon..." : "Generate Images"}
        </button>
      )}

      {manualAdd && (
        <div id="book-pages">
          {showPages && bookContent && bookContent.map((page, index) => (
            // Add the div element with the id attribute
            <div id={`page-${index}`} key={index}>
              {page.image ? (
                <img src={page.image} alt={`Page ${index + 1}`} />
              ) : (
                <div>
                  {/* <input type="file" id={`page-${index}-image`} name={`page-${index}-image`} onChange={event => updateImage(event, index)} /> */}
                  <button onClick={() => generateImage(index, bookContent[index].text)}>
                    {loadingImageIndex === 0 ? "Please wait, AI Images on their way..." : "Generate Image"}
                  </button>
                </div>
              )}
              <textarea value={page.text} data-page={index + 1} onChange={event => updatePage(event, index)} />
              {index === bookContent.length - 1 && (
                <button onClick={addPage}>Add Page</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* // Disabiling toggle button, that allows you to manually add pages. */}
      {/* <button onClick={() => {
        if (bookContent.length === 0) {
          setBookContent([{ text: '', image: '' }]);
        }
        setShowPages(prevShowPages => !prevShowPages);
      }}>Toggle Book Pages</button> */}


      <div id="book-pages">
        {showPages && bookContent && bookContent.map((page, index) => (
          // Add the div element with the id attribute
          <div id={`page-${index}`} key={index}>
            {/* // label for images here */}
            {/* <label htmlFor={`page-${index}-image`}>Page {index + 1} Image:</label> */}
            {page.image ? (
              <img src={page.image} alt={`Page ${index + 1}`} />
            ) : (
              <div>

              </div>
            )}
            <textarea value={page.text} data-page={index + 1} onChange={event => updatePage(event, index)} />
            {index === bookContent.length - 1 && (
              <button onClick={addPage}>Add Page</button>
            )}
          </div>
        ))}
      </div>

      {/* <button onClick={downloadAsPDF}>Download as PDF</button> */}
      {showPages && (
        <button id="imagesbutton" onClick={generateAll} disabled={bookContent.length === 0 || isLoading}>
          {isLoading ? "Please wait... " : "Generate Images"}
        </button>
      )}

      <button id="savebutton"
        onClick={saveBookToFirebase}
        disabled={!isAnyPageFilledIn() || !bookTitle || !bookDescription || isLoading}
      >
        {isLoading ? 'Loading...' : 'Save Book'}
      </button>
      <Footer />
    </div>
  );
}
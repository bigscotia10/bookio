import { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {
  const [bookTitle, setBookTitle] = useState('');
  const [bookImage, setBookImage] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookContent, setBookContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [manualAdd, setManualAdd] = useState(false);
  const [loadingImageIndex, setLoadingImageIndex] = useState(-1);

  ///////////////////////////////////////////
  // The following is for the select box and are predefined story options
  // const descriptionPrompts = {
  //   'Hey Lisa': `Eamon, a 3-year-old boy, asks Lisa questions about outdoor topics like mountains, animals, weather, and trees. The questions start with "Hey Lisa," and Lisa provides a response. Create a story with alternating pages of Eamon's questions and Lisa's answers.`,
  //   'Wee Muckys Adventures': `Wee Mucky is a female West Highland Terrier who loves chasing squirrels and eating cheese. Write a story about her humorous adventures in Portland, Oregon, Cape May, New Jersey, and New York City.`,
  //   'Egogo Adventures': `Egogo, a 3-year-old toddler, can transform into different animals, such as crabs, and behave like them. Create a story about his cute and funny adventures in Portland, Oregon, with his best friend BK.`,
  // };
  ///////////////////////////////////////////

  async function generateAll() {
    // Generate content
    await generateContent(bookDescription);

    // Generate images for each page
    for (let i = 0; i < bookContent.length; i++) {
      await generateImage(i);
    }

    setShowPages(true);
  }



  async function generateImage(index, isCover = false) {
    setLoadingImageIndex(isCover ? -2 : index);

    const prompt = `Illustrate the following scene for a children's book: ${isCover ? bookTitle : bookContent[index].text
      }`;

    try {
      const response = await axios.post('/api/generate-image', { prompt });
      const dataUrl = response.data.dataUrl;

      if (isCover) {
        setBookImage(dataUrl);
      } else {
        const updatedContent = [...bookContent];
        updatedContent[index].image = dataUrl;
        setBookContent(updatedContent);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingImageIndex(-1); // Reset loadingImageIndex when the API call is complete
    }
  }





  async function generateContent(bookDescription) {
    setIsLoading(true);
    setManualAdd(true);
    const prompt = bookDescription;

    //////////////////////////
    // prompt options from select box
    // const prompt = descriptionPrompts[description] || 'Default prompt if description not found';
    //////////////////////////

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
      const parsedPages = pages.map(page => {
        const [text, image] = page.split('\n');
        return { text, image: image ? image.slice(7, -1) : '' };
      });

      setBookContent(prevContent => {
        return parsedPages;
      });
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

  // function isContentEmpty() {
  //   return bookContent.every(page => page.text.trim() === '' && page.image.trim() === '');
  // }


  function updatePage(event, page) {
    const value = event.target.value;
    const updatedContent = [...bookContent];
    updatedContent[page].text = value;
    setBookContent(updatedContent);
  }

  async function downloadAsPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Add book title on the first page
    pdf.setFontSize(30);
    pdf.text(bookTitle || 'Book Title', 20, 40);

    // Add book description on the second page
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text(bookDescription || 'Story Description', 20, 40);

    for (let i = 0; i < bookContent.length; i++) {
      const page = document.getElementById(`page-${i}`);
      const canvas = await html2canvas(page, { scale: 1 });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // Add a new page for each page in bookContent except for the last page
      if (i !== 0 || i !== bookContent.length - 1) {
        pdf.addPage();
      }

      // Add image
      if (bookContent[i].image) {
        pdf.addImage(bookContent[i].image, 'JPEG', 20, 60, 100, 100);
      } else {
        pdf.addImage(imgData, 'JPEG', 20, 60, 100, 100);
      }

      // Add text
      const wrappedText = pdf.splitTextToSize(bookContent[i].text, 160);
      pdf.text(wrappedText, 20, 180);
    }

    pdf.save(`${bookTitle || 'book'}.pdf`);
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


  return (
    <div>
      <label htmlFor="book-title">Book Title</label>
      <input type="text" id="book-title" name="book-title" value={bookTitle} onChange={event => setBookTitle(event.target.value)} />

      <label htmlFor="book-image">Book Cover</label>
      {bookImage ? (
        <img src={bookImage} alt="Book" />
      ) : (
        <div>
          <input type="file" id="book-image" name="book-image" />
          <button onClick={() => generateImage(null, true)}>
            {loadingImageIndex === -2 ? "Loading..." : "Create Cover"}
          </button>

        </div>
      )}

      {/* ///////////////////////////// */}
      {/* The following is the select box for the predfined soties feaure */}
      {/* <div>
        <select id="description-options" onChange={event => setBookDescription(event.target.value)}>
          <option value="">Select a book series</option>
          {Object.keys(descriptionPrompts).map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}

        </select>
      </div> */}
      {/* ///////////////////////////// */}

      <label htmlFor="book-description">Story Description</label>
      <input type="text" id="book-description" name="book-description" value={bookDescription} onChange={event => setBookDescription(event.target.value)} />

      <button onClick={() => generateContent(bookDescription)} disabled={isLoading}>
        {isLoading ? (
          // Replace "Loading..." with <ClipLoader /> if you're using react-spinners
          "Loading..."
        ) : (
          "Create Story"
        )}
      </button>

      {/* //////////////////////////////
      The following is the auto-gen book button */}
      <button onClick={generateAll} disabled={isLoading}>
        {isLoading ? "Loading..." : "Create Story + Images"}
      </button>
      {/* //////////////// */}

      {manualAdd && (
        <div id="book-pages">
          {showPages &&
            bookContent &&
            bookContent.map((page, index) => (
              <div id={`page-${index}`} key={index}>
                {page.image ? (
                  <img src={page.image} alt={`Page ${index + 1}`} />
                ) : (
                  <div>
                    <input
                      type="file"
                      id={`page-${index}-image`}
                      name={`page-${index}-image`}
                      onChange={(event) => updateImage(event, index)}
                    />
                    <button onClick={() => generateImage(index, false)}>
                      {loadingImageIndex === index ? "Loading..." : "AI-Image"}
                    </button>

                  </div>
                )}
                <textarea
                  value={page.text}
                  data-page={index + 1}
                  onChange={(event) => updatePage(event, index)}
                />
              </div>
            ))}
        </div>
      )}




      {/* <button
        id="self-author"
        onClick={addPage}
        style={{ display: bookContent.length === 0 ? 'block' : 'none' }}
      >
        Add First Page
      </button>
      <button
        id="add-page"
        onClick={addPage}
        style={{ display: bookContent.length > 0 ? 'block' : 'none' }}
      >
        Add Page
      </button> */}


      <button id="download-btn" onClick={downloadAsPDF}>Download Book</button>
    </div >
  );
}
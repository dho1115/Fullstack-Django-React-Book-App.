import { useEffect, useState } from 'react';
import './App.css';
import { Container, Form, FormGroup, Input } from 'reactstrap';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("Default Title");
  const [releaseYear, setReleaseYear] = useState(0);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      console.log({ data });
      setBooks(prvBooks => ([...prvBooks, ...data]))
    } catch (error) {
      console.error({ error, errorMessage: error.message, errorCode: error.code });
    }
  }

  const addBook = async (e) => {
    e.preventDefault()
    const bookData = { title, release_year: releaseYear };
    try {
      if (Number(bookData.release_year) > 1000 && (bookData.title != 'Default Title' && bookData.title.length > 0)) {
        const response = await fetch(
          "http://127.0.0.1:8000/api/books/create/",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
          });
        
        console.log({ message: `SUCCESSFULLY POSTED ${JSON.stringify(bookData)}!!!`, data: await response.json() });
      } else {
        throw new Error("release year cannot be 0 and title cannot be blank or default title")
      }
    } catch (error) {
      if (error.response) {
        console.error({ error, status: error.response.status, errorMessage: error.message, errorCode: error.code });
      } else {
        console.error({ error, errorCode: error.code, errorMessage: error.message });
      }
    } finally {
      if ((title != 'Default Title') || (releaseYear != 0)) {
        setTitle("Default Title");
        setReleaseYear(0);
      }
    }
  }
  
  useEffect(() => {
    fetchBooks()
    return () => setBooks([]);
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1>BOOK WEBSITE</h1>
      </header>
      <div>
        Stopped @ 46:19 of React Django Crud Tutorial.
      </div>
      <Container className='p-3' style={{backgroundColor: 'maroon', borderRadius: '33px'}}>
        <Form onSubmit={addBook} style={{border: '1.5px solid black', borderRadius: '33px', backgroundColor: 'whitesmoke'}} className='p-5 m-1'>
          <FormGroup>
            <Input type='text' placeholder='TITLE.' value={title} onChange={e => setTitle(e.target.value)} />
            <div className='m-3'></div>
            <Input type='number' placeholder='RELEASE YEAR.' value={releaseYear} onChange={e => setReleaseYear(e.target.value)} />
          </FormGroup>
          <FormGroup>
          <button type="submit" className="btn btn-danger btn-lg btn-block" style={{width: '100%'}}>SUBMIT</button>
          </FormGroup>
        </Form>
      </Container>
      <section style={{textAlign: 'center', color: 'maroon'}}>
        <h1>ALL CURRENT BOOKS (from database):</h1>
      </section>
      <div>
        {
          books.map(val => (<h5 key={val.id}>{JSON.stringify(val)}</h5>))
        }
      </div>
    </div>
  );
}

export default App;

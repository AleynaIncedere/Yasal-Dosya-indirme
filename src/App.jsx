import { useState, useEffect } from 'react';
import Header from './components/Header';
import File from './components/File';
import Footer from './components/Footer';
import generateMessage from './utilities/generateMessage';
import './styles.css';
import { detect } from 'detect-browser';

export default function App({ serverGeneratedFileId }) {
  const [userData, setUserData] = useState({
    userId: crypto.randomUUID(),
    downloadRequested: false,
    downloadTimeStamp: undefined,
    requestedFileId: undefined,
    browser: undefined,
    location: { ip: undefined, city: undefined, country: undefined },
  });

  
  useEffect(() => {
    if (userData.downloadRequested) {
      generateMessage(userData); 
    }
  }, [userData.downloadRequested]); 

  function handleClick(event) {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        
        setUserData((prevUserData) => ({
          userId: prevUserData.userId, 
          downloadRequested: true, 
          downloadTimeStamp: new Date().toLocaleString(), 
          requestedFileId: event.target.dataset.fileId, 
          browser: detect(), 
          location: {
            ip: data.ip, 
            city: data.city, 
            country: data.country_name, 
          },
        }));
      })
      .catch((error) => {
        
        console.error('Error fetching location data:', error);
      });
  }

  return (
    <div>
      <Header />
      <main>
        <File />
        <div>
          <button
            className="download-button"
            data-file-id={serverGeneratedFileId}
            disabled={userData.downloadRequested} 
            onClick={handleClick}
          >
            {userData.downloadRequested ? 'İndiriliyor...' : 'İndir'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

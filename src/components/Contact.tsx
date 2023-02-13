import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';

type ContactParams = {
  landlordId: string;
};

type User = {
  email: string;
  name: string;
  timestamp: typeof Timestamp;
};

const Contact = () => {
  const [message, setMessage] = useState('');
  const [landlord, setlandlord] = useState<User | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { landlordId } = useParams<ContactParams>();

  useEffect(() => {
    (async () => {
      const docRef = doc(db, 'users', landlordId as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setlandlord(docSnap.data() as User);
      } else {
        toast.error('Could not get landlord data');
      }
    })();
  }, [landlordId]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className='contactLandlord'>
            <p className='landlordNmae'>{landlord?.name}</p>
          </div>
          <form className='messageForm'>
            <div className='messageDiv'>
              <label htmlFor='message' className='messageLabel'>
                Message
              </label>
              <textarea
                name='message'
                id='message'
                className='textarea'
                value={message}
                onChange={onChange}
              ></textarea>
            </div>
            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                'ListingName'
              )}&body=${message}`}
            >
              <button type='button' className='primaryButton'>
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};

export default Contact;

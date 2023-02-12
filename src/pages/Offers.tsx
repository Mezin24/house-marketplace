import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import ListingItem from '../components/ListingItem';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { ListingData, Listing } from '../components/Category';

const Offers = () => {
  const [listings, setListings] = useState<ListingData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const listingsRef = collection(db, 'listings');

        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        const querySnap = await getDocs(q);
        const listings: ListingData[] = [];

        querySnap.forEach((doc) => {
          listings.push({ id: doc.id, data: doc.data() as Listing });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    })();
  }, []);

  const onDelete = (id: string, name: string) => {};

  let content;

  if (loading) {
    content = <Spinner />;
  }

  if (listings && listings.length === 0) {
    content = <p>There are no current offers</p>;
  }

  if (listings && listings.length > 0) {
    content = (
      <>
        <main>
          <ul className='categoryListings'>
            {listings.map((listing) => (
              <ListingItem
                key={listing.id}
                listing={listing}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </main>
      </>
    );
  }

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers</p>
      </header>

      {content}
    </div>
  );
};

export default Offers;

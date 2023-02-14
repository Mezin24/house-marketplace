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
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import ListingItem from './ListingItem';
import Spinner from './Spinner';
import { toast } from 'react-toastify';

export interface Listing {
  name: string;
  type: string;
  userRef: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  offer: boolean;
  regularPrice: number;
  discountedPrice?: number;
  location: string;
  geolocation: Geolocation;
  imageUrls: any[];
  timestamp: string;
  id: string;
}

interface Geolocation {
  lat: string;
  lng: string;
}

export interface ListingData {
  data: Listing;
  id: string;
}

type CategoryParams = {
  categoryName: string;
};

const Category = () => {
  const [listings, setListings] = useState<ListingData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] =
    useState<null | QueryDocumentSnapshot<DocumentData>>(null);

  QueryDocumentSnapshot;

  const params = useParams<CategoryParams>();

  useEffect(() => {
    (async () => {
      try {
        const listingsRef = collection(db, 'listings');

        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(2)
        );

        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        console.log(lastVisible);
        setLastFetchedListing(lastVisible);
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
  }, [params.categoryName]);

  // Pagination / Load mode
  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      );

      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);
      const listings: ListingData[] = [];

      querySnap.forEach((doc) => {
        listings.push({ id: doc.id, data: doc.data() as Listing });
      });

      setListings((prev) => prev && [...prev, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings');
    }
  };

  const onDelete = (id: string, name: string) => {};

  let content;

  if (loading) {
    content = <Spinner />;
  }

  if (listings && listings.length === 0) {
    content = <p>No listings for {params.categoryName}</p>;
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

        <br />
        <br />
        {lastFetchedListing && (
          <p className='loadMore' onClick={onFetchMoreListings}>
            Load More
          </p>
        )}
      </>
    );
  }

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>
          {params.categoryName === 'rent'
            ? 'Places for rent'
            : 'Places for sale'}
        </p>
      </header>

      {content}
    </div>
  );
};

export default Category;

import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { FormData } from './CreateListing';
import { Listing } from '../components/Category';

const EditListing = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [listing, setListing] = useState<Listing | null>(null);

  const [formData, setFormData] = useState<FormData>({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: FileList,
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const { listingId } = useParams();
  const isMonted = useRef(true);

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser?.uid) {
      toast.error('You can not edit this listing');
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (isMonted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData((prev) => ({ ...prev, userRef: user.uid }));
        } else {
          navigate('/sign-in');
        }
      });
    }

    return () => {
      isMonted.current = false;
    };
  }, [isMonted]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      if (!listingId) return;
      const docRef = doc(db, 'listings', listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data() as Listing);
        setFormData({
          ...(docSnap.data() as FormData),
        });
        setLoading(false);
      } else {
        navigate('/');
        toast.error('Listing does not exist');
      }
    })();
  }, [listingId, navigate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    setLoading(true);

    if (discountedPrice && discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error('Discounted price must be less then regular price');
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error('Max 6 images');
      return;
    }

    // Store image in firebase
    const storeImage = async (image: any) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser?.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, `image/${fileName}`);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error('Images not uploaded');
      console.log(error);
      return;
    });

    const formDataCopy = {
      ...formData,
      imageUrls,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    delete formDataCopy.address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    if (!listingId) return;
    const docRef = doc(db, 'listings', listingId);
    await updateDoc(docRef, formDataCopy);

    setLoading(false);
    toast.success('Listing saved');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onMutate = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let boolean: boolean;

    if ((e.target as HTMLInputElement | HTMLButtonElement).value === 'true') {
      boolean = true;
    }
    if ((e.target as HTMLInputElement | HTMLButtonElement).value === 'false') {
      boolean = false;
    }

    if ((e.target as HTMLInputElement).files) {
      setFormData((prev) => ({
        ...prev,
        images: (e.target as HTMLInputElement).files,
      }));
    }

    if (!(e.target as HTMLInputElement).files) {
      setFormData((prev) => ({
        ...prev,
        [(e.target as HTMLInputElement).name]:
          boolean ?? (e.target as HTMLInputElement).value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='profile'>
      <header>
        <p className='pageHeader'>Edit a Listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Sell / Rent</label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              name='type'
              value='sale'
              onClick={onMutate}
            >
              Sale
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              name='type'
              value='rent'
              onClick={onMutate}
            >
              Rent
            </button>
          </div>
          <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type='text'
            name='name'
            value={name}
            onChange={onMutate}
            maxLength={32}
            minLength={10}
            required
          />

          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                className='formInputSmall'
                type='number'
                name='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                className='formInputSmall'
                type='number'
                name='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
          </div>

          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              name='parking'
              value='true'
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              name='parking'
              value='false'
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              name='furnished'
              value={'true'}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              name='furnished'
              value={'false'}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            name='address'
            value={address}
            onChange={onMutate}
            required
          />

          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              name='offer'
              value={'true'}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              name='offer'
              value={'false'}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              name='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                name='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            name='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Edit Listing
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditListing;

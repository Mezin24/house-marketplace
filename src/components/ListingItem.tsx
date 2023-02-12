import { Link } from 'react-router-dom';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import { ListingData } from './Category';

interface ListingItemProps {
  onDelete?: (id: string, name: string) => void;
  listing: ListingData;
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const ListingItem = ({ onDelete, listing }: ListingItemProps) => {
  const { id, data } = listing;
  return (
    <li className='categoryListing'>
      <Link to={`/category/${data.type}/${id}`} className='categoryListingLink'>
        <img
          src={data.imageUrls[0]}
          alt={data.name}
          className='categoryListingImg'
        />
        <div className='categoryListingDetails'>
          <p className='categoryListingLocation'>{data.location}</p>
          <p className='categoryListingName'>{data.name}</p>
          <p className='categoryListingPrice'>
            {data.offer
              ? formatter.format(data.discountedPrice)
              : formatter.format(data.regularPrice)}
            {data.type === 'rent' && ' / Month'}
          </p>
          <div className='categoryListingInfoDiv'>
            <img src={bedIcon} alt='bed' />
            <p className='categoryListingInfoText'>
              {data.bedrooms > 1
                ? `${data.bedrooms} Badrooms`
                : `${data.bathrooms} 'Badroom'`}
            </p>
            <img src={bathtubIcon} alt='bathtub' />
            <p className='categoryListingInfoText'>
              {data.bathrooms > 1 ? `${data.bedrooms} Bathrooms` : '1 Bathroom'}
            </p>
          </div>
        </div>
      </Link>

      {onDelete && (
        <DeleteIcon
          className='removeIcon'
          fill='rgb(231, 76,60)'
          onClick={() => onDelete(id, data.name)}
        />
      )}
    </li>
  );
};

export default ListingItem;

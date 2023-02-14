import { Link } from 'react-router-dom';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg';
import { ListingData } from './Category';
import { formatter } from '../utils/formatter';

interface ListingItemProps {
  onDelete?: (id: string, name: string) => void;
  listing: ListingData;
  onEdit?: (id: string) => void;
}

const ListingItem = ({ onDelete, listing, onEdit }: ListingItemProps) => {
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
            {data.offer && data.discountedPrice
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

      {onEdit && <EditIcon className='editIcon' onClick={() => onEdit(id)} />}
    </li>
  );
};

export default ListingItem;

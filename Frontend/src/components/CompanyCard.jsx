import React from 'react';
import { Heart, MapPin, Phone, Globe } from 'lucide-react';

export function CompanyCard({ company, isFavorited, onToggleFavorite }) {
  const { name, description, address, telephone, website } = company;

  const handleHeartClick = () => {
    onToggleFavorite(company._id);
  };

  return (
    <div className="company-card">
      
      <button 
        className="company-card-heart"
        onClick={handleHeartClick}
      >
        {isFavorited ? (
            <Heart size={20} className="favorited-heart" />
        ) : (
            <Heart size={20} />
        )}
      </button>

      <div className="company-card-header">
        <h2 className="company-card-title">{name}</h2>
        <p className="company-card-description">{description}</p>
      </div>

      <div className="company-card-content">
        <div className="info-item">
          <MapPin className="info-item-icon" />
          <p className="info-item-text">{address}</p>
        </div>

        <div className="info-item">
          <Phone className="info-item-icon" />
          <p className="info-item-text">{telephone}</p>
        </div>

        {website && (
          <div className="info-item">
            <Globe className="info-item-icon" />
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="info-item-text info-item-link"
            >
              {website}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
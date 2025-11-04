import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import favoriteService from '@/features/favorites/favoritesService';
import { CompanyCard } from '../components/CompanyCard'; 

export default function Page() {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("Mock Error: Failed to fetch!");

    // Fetch data
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setIsLoading(true);

                const data = await favoriteService.getFavorites();

                setFavorites(data.data);
                setIsError(false);
                setMessage('');
            } catch (error) {
                const errorMessage = 
                    error.response?.data?.message || 
                    error.message || 
                    "Failed to fetch favorites";
                
                setIsError(true);
                setMessage(errorMessage);
                setFavorites([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    useEffect(() => {
        if (isError && message) {
            toast.error(message);
        }
    }, [isError, message]);

    const handleToggleFavorite = async (companyId) => {
        try {

            await favoriteService.deleteFavorites(companyId);

            setFavorites((currentFavorites) =>
                currentFavorites.filter(
                    (fav) => fav.company._id !== companyId
                )
            );
            
            toast.info("Removed from favorites");
        } catch (error) {
            const errorMessage = 
                error.response?.data?.message || 
                "Failed to remove favorite";
            toast.error(errorMessage);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <p className="loading-text">Loading favorites...</p>;
        }

        if (favorites.length === 0) {
            return <p className="no-company-text">You haven't favorited any companies yet.</p>;
        }

        return (
            <div className="companies-grid">
                {favorites.map((favoriteItem) => (
                    <CompanyCard
                        key={favoriteItem._id}
                        company={favoriteItem.company}
                        isFavorited={true} 
                        onToggleFavorite={() => handleToggleFavorite(favoriteItem.company._id)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="page-favorites">
            <div>
                <h1 className="page-title">Favorite Companies</h1>
                <h3 className="page-subtitle">
                    Companies you've saved for later.
                </h3>
            </div>
            
            {renderContent()}
        </div>
    );
}
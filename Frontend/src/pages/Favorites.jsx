import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getFavorites, removeFavorite } from '@/features/favorites/favoritesSlice';
import { CompanyCard } from '../components/CompanyCard'; 

export default function Page() {
    const dispatch = useDispatch();
    const { favorites, isLoading, isError, message } = useSelector(state => state.favorites);

    useEffect(() => {
        dispatch(getFavorites());
    }, [dispatch]);

    useEffect(() => {
        if (isError && message) {
            toast.error(message);
        }
    }, [isError, message]);

    const handleToggleFavorite = async (companyId) => {
        try {
            // remove favorite
            await dispatch(removeFavorite(companyId)).unwrap();
            toast.info("Removed from favorites");
        } catch (error) {
            const errorMessage = error?.message || "Failed to remove favorite";
            toast.error(errorMessage);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <p className="loading-text">Loading favorites...</p>;
        }

        if (!favorites || favorites.length === 0) {
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
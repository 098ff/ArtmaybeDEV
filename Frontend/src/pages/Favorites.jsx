import React, { useEffect, useState } from 'react';
// TODO: Apply it with real data from api
// import { useSelector, useDispatch } from 'react-redux'; 
import { toast } from 'react-toastify';
// TODO: Apply it with real data from api
// import { getFavorites, removeFavorite, reset } from '../features/favorites/favoritesSlice'; 
import { CompanyCard } from '../components/CompanyCard'; 

// TODO: Remove this after finish fetch from api
const MOCK_FAVORITES = [
    {
        _id: "mock-1",
        name: "Mock Company Alpha (Test)",
        description: "This is a mock description for testing the UI.",
        address: "123 Fake St, Bangkok",
        telephone: "02-123-4567",
        website: "httpsa://alpha-test.com"
    },
    {
        _id: "mock-2",
        name: "Mock Solutions Inc. (Test)",
        description: "Another mock company to fill up the space.",
        address: "999 Test Ave, Chiang Mai",
        telephone: "053-987-6543",
        website: "httpsa://solutions-test.com"
    }
];


export default function Page() {
    // TODO: Apply it with real data from api
    // const dispatch = useDispatch(); 
    
    // TODO: Apply it with real data from api
    // const { favorites, isLoading, isError, message } = useSelector((state) => state.favorites);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("Mock Error: Failed to fetch!");


    // TODO: Apply it with real data from api
    useEffect(() => {
        setIsLoading(true);
        
        // จำลองการโหลดข้อมูล 1 วินาที
        const timer = setTimeout(() => {
            if (isError) {
                setIsLoading(false);
            } else {
                setFavorites(MOCK_FAVORITES);
                setIsLoading(false);
            }
        }, 1000); 

        return () => clearTimeout(timer);
    }, [isError]); 

    useEffect(() => {
        if (isError && message) { 
            toast.error(message);
        }
    }, [isError, message]);

    const handleToggleFavorite = (companyId) => {
        // TODO: Apply it with real data from api
        // dispatch(removeFavorite(companyId));
        
        // TODO: Apply it with real data from api
        setFavorites((currentFavorites) => 
            currentFavorites.filter(company => company._id !== companyId)
        );
        
        toast.info("Removed from favorites");
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
                {favorites.map((company) => (
                    <CompanyCard
                        key={company._id}
                        company={company}
                        isFavorited={true} 
                        onToggleFavorite={handleToggleFavorite} 
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
import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import companyService from '../features/companies/companiesService';
import favoriteService from '../features/favorites/favoritesService'; 
import { CompanyCard } from '../components/CompanyCard';

export default function Page() {
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false); 
    const [favoriteIds, setFavoriteIds] = useState(new Set());

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);

                const companiesPromise = companyService.getCompanies(page);
                const favoritesPromise = favoriteService.getFavorites(); 

                const [companiesData, favoritesData] = await Promise.all([
                    companiesPromise,
                    favoritesPromise
                ]);

                setCompanies(companiesData.data); 
                setHasNextPage(!!companiesData.pagination.next);
  
                const ids = favoritesData.data.map(fav => fav.company._id);
                setFavoriteIds(new Set(ids));
                
                setError(null);
            } catch (err) {
                const message = "Failed to fetch data. Please try again later.";
                setError(message);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [page]);

    //   Checking for Error 
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleToggleFavorite = async (companyId, isCurrentlyFavorited) => {
        try {
            if (isCurrentlyFavorited) {
                await favoriteService.deleteFavorites(companyId);
                
                setFavoriteIds(prevIds => {
                    const newIds = new Set(prevIds);
                    newIds.delete(companyId); 
                    return newIds;
                });
                
                toast.info("Removed from favorites");

            } else {
                await favoriteService.createFavorite(companyId);

                setFavoriteIds(prevIds => {
                    const newIds = new Set(prevIds);
                    newIds.add(companyId);
                    return newIds;
                });
                
                toast.success("Added to favorites");
            }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update favorite";
            toast.error(message);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <p className="loading-text">Loading companies...</p>;
        }

        if (companies.length === 0) {
            return <p className="no-company-text">No companies found.</p>;
        }

        return (
            <div className="companies-grid">
                {companies.map((company) => {
                    const isFavorited = favoriteIds.has(company._id);

                    return (
                        <CompanyCard 
                            key={company._id} 
                            company={company} 
                            isFavorited={isFavorited}
                            onToggleFavorite={() => handleToggleFavorite(company._id, isFavorited)}
                        />
                    );
                })}
            </div>
        );
    };

    const handlePrevPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1)); 
    };

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <div className="page-companies">
            {/* Topics */}
            <div>
                <h1 className="page-title">
                    Participating Companies
                </h1>
                <h3 className="page-subtitle">
                    Browse and save your favorite companies for the job fair!
                </h3>
            </div>

            {/* List of Companies */}
            {renderContent()}

            {/* Pagination Part */}
            <div className="pagination-controls">
                <button 
                    onClick={handlePrevPage} 
                    disabled={page <= 1 || isLoading}
                >
                    Previous
                </button>
                <span>
                    Page {page} 
                </span>
                <button 
                    onClick={handleNextPage} 
                    disabled={!hasNextPage || isLoading}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
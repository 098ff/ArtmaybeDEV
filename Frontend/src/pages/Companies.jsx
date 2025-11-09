import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { getCompanies } from '@/features/companies/companiesSlice';
import { getFavorites, addFavorite, removeFavorite } from '@/features/favorites/favoritesSlice';
import { CompanyCard } from '../components/CompanyCard';

export default function Page() {
    const dispatch = useDispatch();
    const companiesState = useSelector(state => state.companies);
    const favoritesState = useSelector(state => state.favorites);

    const [page, setPage] = useState(1);
    const LIMIT = 6;

    useEffect(() => {
        dispatch(getCompanies({ page, limit: LIMIT }));
        dispatch(getFavorites());
    }, [dispatch, page]);

    useEffect(() => {
        if (companiesState.isError) {
            toast.error(companiesState.message || "Failed to fetch companies");
        }
    }, [companiesState.isError, companiesState.message]);

    useEffect(() => {
        if (favoritesState.isError) {
            toast.error(favoritesState.message || "Failed to fetch favorites");
        }
    }, [favoritesState.isError, favoritesState.message]);

    const companiesList = companiesState.companies?.data || [];
    const hasNextPage = !!companiesState.companies?.pagination?.next;
    const isLoading = companiesState.isLoading || favoritesState.isLoading;

    const favoriteIds = new Set((favoritesState.favorites || []).map(fav => fav.company?._id));

    const handleToggleFavorite = async (companyId, isCurrentlyFavorited) => {
        try {
            if (isCurrentlyFavorited) {
                await dispatch(removeFavorite(companyId)).unwrap();
                toast.info("Removed from favorites");
            } else {
                await dispatch(addFavorite(companyId)).unwrap();
                toast.success("Added to favorites");
            }
        } catch (err) {
            const message = err || "Failed to update favorite";
            toast.error(message);
        }
    };

    const renderContent = () => {
        if (isLoading) return <p className="loading-text">Loading companies...</p>;
        if (companiesList.length === 0) return <p className="no-company-text">No companies found.</p>;

        return (
            <div className="companies-grid">
                {companiesList.map((company) => {
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

    const handlePrevPage = () => setPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setPage(prev => prev + 1);

    return (
        <div className="page-companies">
            <div>
                <h1 className="page-title">Participating Companies</h1>
                <h3 className="page-subtitle">Browse and save your favorite companies for the job fair!</h3>
            </div>

            {renderContent()}

            <div className="pagination-controls">
                <button onClick={handlePrevPage} disabled={page <= 1 || isLoading}>Previous</button>
                <span>Page {page}</span>
                <button onClick={handleNextPage} disabled={!hasNextPage || isLoading}>Next</button>
            </div>
        </div>
    );
}
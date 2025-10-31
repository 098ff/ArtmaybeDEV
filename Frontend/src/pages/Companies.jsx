import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import companyService from '../features/companies/companiesService';
import { CompanyCard } from '../components/CompanyCard';

export default function Page() {
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);

    const [hasNextPage, setHasNextPage] = useState(false); 

    //   Fetch Data
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setIsLoading(true);
                
                const data = await companyService.getCompanies(page); 

                // Company arr in data.data
                setCompanies(data.data); 
                // !! is for define boolean value
                // True: hasValue || emptyVal
                // False: undefined || null
                setHasNextPage(!!data.pagination.next);
                
                setError(null);
            } catch (err) {
                const message = "Failed to fetch companies. Please try again later.";
                setError(message);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanies();
    }, [page]); 

    //   Checking for Error 
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    //   Render .jsx 
    const renderContent = () => {
        if (isLoading) {
            return <p className="loading-text">Loading companies...</p>;
        }

        if (companies.length === 0) {
            return <p className="no-company-text">No companies found.</p>;
        }

        return (
            <div className="companies-grid">
                {companies.map((company) => (
                    <CompanyCard key={company._id} company={company} />
                ))}
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
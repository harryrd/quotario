
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';
import BusinessLogoUploader from './BusinessLogoUploader';
import BusinessForm from './BusinessForm';
import LoadingState from './LoadingState';

const BusinessDetails: React.FC = () => {
  const { user } = useAuth();
  const {
    businessDetails,
    setBusinessDetails,
    handleLogoChange,
    saveBusinessDetails,
    loading,
    saving
  } = useBusinessDetails(user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveBusinessDetails();
  };

  if (loading) {
    return <LoadingState message="Loading business details..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <BusinessLogoUploader
        logoUrl={businessDetails.logo_url}
        companyName={businessDetails.company_name}
        handleLogoChange={handleLogoChange}
        disabled={saving}
      />

      <BusinessForm
        businessDetails={businessDetails}
        setBusinessDetails={setBusinessDetails}
        saving={saving}
        onSubmit={handleSubmit}
      />
    </motion.div>
  );
};

export default BusinessDetails;

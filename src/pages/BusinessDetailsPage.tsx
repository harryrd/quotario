
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import BusinessDetails from '@/components/settings/BusinessDetails';

const BusinessDetailsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Business Details" showBack />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <div className="border rounded-md p-4">
            <BusinessDetails />
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default BusinessDetailsPage;

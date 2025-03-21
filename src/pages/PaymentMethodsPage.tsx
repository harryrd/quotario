
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import PaymentMethods from '@/components/settings/PaymentMethods';

const PaymentMethodsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Payment Methods" showBack />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <div className="border rounded-md p-4">
            <PaymentMethods />
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;

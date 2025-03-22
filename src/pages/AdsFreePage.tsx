
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CoffeeIcon, UtensilsIcon } from 'lucide-react';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AdsFreePage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentOption = (option: 'coffee' | 'meal') => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Thank you for your ${option === 'coffee' ? 'coffee' : 'meal'} support!`);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Ads Free" showBack />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <div className="max-w-md mx-auto">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Support the Developer</h2>
              <p className="text-muted-foreground mt-1">
                Remove ads and support ongoing development by treating us to a coffee or meal.
              </p>
            </div>
            
            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CoffeeIcon className="h-5 w-5" /> 
                    Coffee Support
                  </CardTitle>
                  <CardDescription>
                    $5 per year
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Remove all ads from the app and support basic maintenance and updates.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handlePaymentOption('coffee')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Support with Coffee'}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UtensilsIcon className="h-5 w-5" /> 
                    Meal Support
                  </CardTitle>
                  <CardDescription>
                    $10 per year
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Remove all ads and support new feature development and premium support.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={() => handlePaymentOption('meal')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Support with a Meal'}
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="mt-2">
                <p className="text-xs text-center text-muted-foreground">
                  Payments are processed securely through PayPal. Your support directly helps 
                  maintain and improve this application.
                </p>
              </div>
            </div>
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default AdsFreePage;

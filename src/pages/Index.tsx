import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
      <div className="text-center text-white">
        <h1 className="mb-4 text-4xl font-bold">iTourGab</h1>
        <p className="text-xl mb-6">Discover Gabaldon's Natural Wonders</p>
        <Button 
          onClick={() => navigate('/')}
          className="btn-hero"
        >
          Enter App
        </Button>
      </div>
    </div>
  );
};

export default Index;

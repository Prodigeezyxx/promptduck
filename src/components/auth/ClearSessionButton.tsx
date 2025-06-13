
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function ClearSessionButton() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClearSession = () => {
    // Clear guest session
    localStorage.removeItem('promptduck_guest_session');
    
    // Trigger storage event to update AuthProvider
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'promptduck_guest_session',
      newValue: null
    }));

    toast({
      title: "Session Cleared",
      description: "You've been signed out and can now access the landing page.",
    });

    // Navigate to landing page
    navigate('/');
  };

  // Return null to render nothing
  return null;
}

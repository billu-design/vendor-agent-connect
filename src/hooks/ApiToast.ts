import React from 'react';
import { useToast } from '@/lib/use-toast';

export function UserProfileForm() {
  const { apiToast } = useToast();
  const [userId, setUserId] = React.useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // This will show a loading toast, then success/error automatically
      const response = await apiToast({
        url: '/api/users',
        method: 'post',
        data: { userId },
        loadingTitle: 'Saving Profile',
        loadingDescription: 'Saving your profile changes...',
        successTitle: 'Profile Updated',
        successDescription: 'Your profile has been updated successfully',
        errorTitle: 'Update Failed',
        errorDescription: 'Could not update your profile'
      });
      
      console.log('API response:', response.data);
    } catch (error) {
      // Error is already handled by apiToast
      console.error('API error details:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={userId} 
        onChange={(e) => setUserId(e.target.value)} 
        placeholder="User ID"
      />
      <button type="submit">Save Profile</button>
    </form>
  );
}

// Another example showing GET request
export function DataFetchingComponent() {
  const { apiToast } = useToast();
  const [data, setData] = React.useState(null);
  
  const fetchData = async () => {
    try {
      const response = await apiToast({
        url: '/api/data',
        method: 'get',
        params: { limit: 10 },
        loadingTitle: 'Fetching Data',
        loadingDescription: 'Please wait while we load your data...',
        successTitle: 'Data Loaded',
        successDescription: 'Your data has been loaded successfully'
      });
      
      setData(response.data);
    } catch (error) {
      // Already handled by the toast
    }
  };
  
  return (
    <div>
      <button onClick={fetchData}>Load Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
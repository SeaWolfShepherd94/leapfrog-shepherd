import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();

  if (user === undefined || !isAuthenticated) {
    return <div></div>;
  }
  return (
    isAuthenticated && (
      <div>
        <img
          src={user.picture}
          alt={user.name}
          title={user.email}
          style={{
            position: 'absolute',
            right: 5,
            top: 5,
            borderRadius: '50%',
            height: '32px',
            width: '32px',
            padding: '8px'
          }}
        />
      </div>
    )
  );
};

export default Profile;

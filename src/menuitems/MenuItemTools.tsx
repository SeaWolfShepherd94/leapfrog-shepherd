import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import i18n from 'i18next';

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    overlfow: 'scroll',
    padding: '0px',
    fontFamily: 'sans-serif'
  }
};

export const selectStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    fontFamily: 'sans-serif'
  })
};

export const aggregationOptions = [
  {
    name: 'Count',
    value: 'count'
  },
  {
    name: 'Sum',
    value: 'sum'
  },
  {
    name: 'Min',
    value: 'min'
  },
  {
    name: 'Max',
    value: 'max'
  },
  {
    name: 'None',
    value: 'none'
  }
];

export const sortOptions = [
  {
    name: 'Asc',
    value: 'asc'
  },
  {
    name: 'Desc',
    value: 'desc'
  },
  {
    name: 'None',
    value: 'none'
  }
];

export const baseURL = process.env.REACT_APP_BASE_URL;

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();
  logout({ returnTo: window.location.origin });
  return <div />;
};

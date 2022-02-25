import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useGlobalState } from '../components/GlobalState';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import i18n from 'i18next';

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

export const baseURL = process.env.REACT_APP_BASE_URL;

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();
  logout({ returnTo: window.location.origin });
  return <div />;
};

import { useTranslation } from 'react-i18next';
import { IconButton } from '@material-ui/core';
import { IconFlagES, IconFlagUS } from 'material-ui-flags';
import React from 'react';

export const Footer: React.FC = () => {
  const { i18n } = useTranslation();

  function changeLanguage(language: string) {
    i18n.changeLanguage(language);
  }

  return (
    <div>
      <IconButton
        onClick={e => {
          changeLanguage('en');
        }}
        style={{ position: 'absolute', right: 150, top: 5 }}
        className='IconButton'
      >
        <IconFlagUS value='en' />
      </IconButton>
      <IconButton
        onClick={e => {
          changeLanguage('es');
        }}
        style={{ position: 'absolute', right: 100, top: 5 }}
        className='IconButton'
      >
        <IconFlagES value='es' />
      </IconButton>
    </div>
  );
};

export default Footer;

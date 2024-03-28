import React, { useState, useEffect } from 'react';
import { Menu, MenuItem } from '@mui/material'; // Import the ArrowDropDown icon
import { ExpandMore } from '@mui/icons-material'; // Import the ExpandMore icon
import icp from "../../../assets/images/icp.png";
import ckbtc from "../../../assets/images/ckBTC.png";
import vbt from "../../../assets/images/vbt.png";
import { useArcadeContext } from '@context/ArcadeContext';
// import './ArcadeNavbar.css';

interface Images {
  [key: string]: string | string;
}

function CurrencyDropdown() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(icp);
  const [selectedText, setSelectedText] = useState<string | null>('ICP');
  const { currency, setCurrency } = useArcadeContext();

  const images: Images = {
    'WICP': icp,
    'CKBTC': ckbtc,
    'VBT': vbt
  };

  const text: Images = { 'WICP': 'ICP', 'CKBTC': 'CKBTC', 'VBT': 'VBT' };

  useEffect(() => {
    const storedCurrency = localStorage.getItem('currency');
    // console.log("storedCurrency", storedCurrency)
    if (storedCurrency && images[storedCurrency]) {
      setCurrency(storedCurrency);
      setSelectedText(text[storedCurrency]);
      setSelectedImage(images[storedCurrency]);
    }
  }, []);

  useEffect(() => {
    setSelectedText(text[currency]);
    setSelectedImage(images[currency]);
  }, [currency])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (selectedCurrency: string) => {
    // console.log("selectedCurrency", selectedCurrency)
    setCurrency(selectedCurrency);
    setSelectedText(text[selectedCurrency]);
    setSelectedImage(images[selectedCurrency]);
    localStorage.setItem('currency', selectedCurrency);
    localStorage.setItem('loadingArcadeBalance', 'true')
    setAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='currency-dropdown-box' style={{ margin: '0 10px', width: selectedText === 'CKBTC' ? '120px' : '100%' }}>
      <button
        style={{
          display: 'flex',
          width: '100px',
          background: 'none',
          border: 'none',
          gap: '8px',
          alignItems: 'center',
          color: '#FFF',
          fontWeight: 700,
          cursor: 'pointer',
        }}
        onClick={handleMenuOpen}
      >
        {selectedImage && (
          <>
            <img src={selectedImage} alt="Selected" style={{ width: '30px' }} />
            <span>{selectedText}</span>
            <ExpandMore />
          </>
        )}
      </button>
      <Menu
        id="image-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {Object.keys(images).map((key) => (
          <MenuItem key={key} onClick={() => handleMenuItemClick(key)}>
            <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <img
                src={images[key]}
                alt={`Option ${key}`}
                style={{ width: '30px', height: 'auto', margin: '0.5px' }}
              />
              <span>{text[key]}</span>
            </span>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default CurrencyDropdown;

// Brand Colors
const brandColors = {
  primary: '#FF6B00', // Brighter Orange
  secondary: '#FFD700', // Brighter Yellow
};

// Theme Colors
export const Colors = {
  light: {
    // Text Colors
    text: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textTertiary: '#666666',
    
    // Background Colors
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundTertiary: '#F1F3F5',
    
    // Border Colors
    border: '#E6E8EB',
    borderSecondary: '#DFE3E6',
    
    // Brand Colors
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    
    // Component Colors
    card: '#FFFFFF',
    input: '#FFFFFF',
    inputBorder: '#DFE3E6',
    placeholder: '#666666',
  },
  dark: {
    // Text Colors
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textTertiary: '#808080',
    
    // Background Colors
    background: '#121212', // Slightly softer black
    backgroundSecondary: '#1E1E1E',
    backgroundTertiary: '#2D2D2D',
    
    // Border Colors
    border: '#2D2D2D',
    borderSecondary: '#404040',
    
    // Brand Colors
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    
    // Component Colors
    card: '#1E1E1E',
    input: '#1E1E1E',
    inputBorder: '#404040',
    placeholder: '#808080',
  },
};

// Export brand colors separately for direct access
export const Brand = brandColors;

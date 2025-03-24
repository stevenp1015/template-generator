import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
// Add this to the top of your index.js file
const fixCSSConflicts = () => {
    // Save original createElement
    const originalCreateElement = React.createElement;

    // Replace createElement with a version that fixes style conflicts
    React.createElement = function(type, props, ...children) {
        if (props && props.style) {
            const style = props.style;

            // Fix border conflicts
            if (style.border && (style.borderLeft || style.borderRight || style.borderTop || style.borderBottom)) {
                const borderColor = style.borderColor || (style.border.split(' ')[2] || 'inherit');
                const borderWidth = style.borderWidth || (style.border.split(' ')[0] || '1px');
                const borderStyle = style.borderStyle || (style.border.split(' ')[1] || 'solid');

                delete style.border;
                delete style.borderColor;
                delete style.borderWidth;
                delete style.borderStyle;

                // Set individual borders if not already set
                if (!style.borderTop) style.borderTop = `${borderWidth} ${borderStyle} ${borderColor}`;
                if (!style.borderRight) style.borderRight = `${borderWidth} ${borderStyle} ${borderColor}`;
                if (!style.borderBottom) style.borderBottom = `${borderWidth} ${borderStyle} ${borderColor}`;
                if (!style.borderLeft) style.borderLeft = `${borderWidth} ${borderStyle} ${borderColor}`;
            }

            // Fix padding conflicts
            if (style.padding && (style.paddingLeft || style.paddingRight || style.paddingTop || style.paddingBottom)) {
                const padding = style.padding.toString().split(' ');
                delete style.padding;

                // Handle different padding formats (1, 2, 3, or 4 values)
                if (!style.paddingTop) style.paddingTop = padding[0];
                if (!style.paddingRight) style.paddingRight = padding[1] || padding[0];
                if (!style.paddingBottom) style.paddingBottom = padding[2] || padding[0];
                if (!style.paddingLeft) style.paddingLeft = padding[3] || padding[1] || padding[0];
            }
        }

        return originalCreateElement(type, props, ...children);
    };
};

// Call this before your app renders
fixCSSConflicts();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

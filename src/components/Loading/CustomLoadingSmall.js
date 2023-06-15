import React from 'react';
const CustomLoadingSmall = () => {
    return (
        <>

            <style>
                {`
                    .loading-animation {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        
                    }

                    .loading-circle {
                        border: 3px solid #FFFFFF;
                        border-top: 3px solid #E61F23;
                        border-right: 3px solid #E61F23;
                        border-bottom: 3px solid #E61F23;
                        border-radius: 50%;
                        width: 28px;
                        height: 28px;
                        top:-14px;
                        left:-14px;
                        animation: spin 2s linear infinite;
                    }

    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div>
                <div className="loading-animation">
                    <div className="loading-circle"></div>
                
                </div>
                
            </div>
            
        </>
    );
}

export default CustomLoadingSmall;
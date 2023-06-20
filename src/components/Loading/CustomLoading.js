import React from 'react';
const CustomLoading = () => {
    return (
        <>

            <style>
                {`
                    .loading-animation {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width:120px;
                        height:120px;
                        
                    }

                    .loading-circle {
                        border: 6px solid #E8E8E8;
                        border-top: 6px solid #E61F23;
                        border-radius: 50%;
                        width: 94px;
                        height: 94px;
                        animation: spin 2s linear infinite;
                    }

                    .loading-text {
                        top:50px;
                        left:32px;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div className='position-relative'>
                <div className="loading-animation position-absolute top-0 start-0">
                    <div className="loading-circle"></div>
                
                </div>
                <span className="position-absolute roboto-b1 loading-text">Loading</span>
            </div>
            
        </>
    );
}

export default CustomLoading;
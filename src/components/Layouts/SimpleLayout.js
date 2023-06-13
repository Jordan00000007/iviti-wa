import React from 'react';
import CustomHeader from '../Header/CustomHeader';

const SimpleLayout = ({ children }) => {
    return (
        <div>
            <div style={{background:'var(--highlight_1)'}}>
                <div className="container p-0" >
                    <CustomHeader />
                </div>
            </div>
            <div style={{background:'var(--base_1)',overflowY: 'scroll',height:window.innerHeight-56}}  data-bs-spy="scroll">
                <div className="container p-0">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SimpleLayout;
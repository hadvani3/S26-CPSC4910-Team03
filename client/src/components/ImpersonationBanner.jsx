import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from './AuthContext';

export default function ImpersonationBanner() {
    const {isImpersonating, stopImpersonation,role} = useContext(AuthContext);
    const navigate = useNavigate();

    if(!isImpersonating) return null;

    const handleStop = () => {
        const originalRole = sessionStorage.getItem("originalRole");
        stopImpersonation();
        if (originalRole === 'admin') {
            navigate('/admin-page');
        }
        else if (originalRole === 'sponsor') {
            navigate('/sponsor-page');
        }
    };

    return (
        <div style = {{
            background: '#f59e0b',
            color : '#1f2937',
            padding : '10px 20px',
            textAlign : 'center',
            fontWeight: '700',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
            top : 0,
            zIndex: 1000,
        }}>
            You are currently immpersonating as a {role} user.
            <button 
                type = "button"
                onClick = {handleStop}
                style={{
                    padding : '6px 16px',
                    backgroundColor : '#1f2937',
                    color : 'white',
                    border : 'none',
                    borderRadius : '6px',
                    cursor : 'pointer',
                    fontWeight: '700',
                    fontSize: '13px',
                }}
                >
                    Stop Impersonation
            </button>
            </div>

    );
}
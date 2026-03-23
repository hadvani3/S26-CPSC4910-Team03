import { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
export default function DriverRemovalPage(){
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    return (
        <>
            <h1 class = "remove-title">Removal Of Driver Account</h1>

            <div className="glass-input-group">
                <label>Email</label>
                <input
                type="email"
                name="email"
                className="glass-input"
                placeholder="username@gmail.com"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            </div>

            <div className="glass-input-group">
                <label>Password</label>
                    <div className="glass-input-wrapper">
                        <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="glass-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={10} 
                        maxLength={20}
                        required
                        />
                        {/* The clickable eye icon */}
                        <div 
                            className="password-toggle" 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
            </div>

            <div style={{ 
                    paddingTop: '25px', 
                    borderTop: '2px solid #e0e0e0',
                    textAlign: 'center'
                }}>
                <button type = "button">Delete Account</button>
            </div>
        </>
    )
}
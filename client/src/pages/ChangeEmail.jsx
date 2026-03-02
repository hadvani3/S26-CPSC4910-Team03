import Nav from '../components/Nav'

export default function ChangeEmail(){
    const [oEmail, setOldEmail] = useState("");
    const [nEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (o, n, p) =>{

    }

    return(
        <>
            <Nav>
            <div className="container">
                <h1>Change Associated Email</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Old Email:
                        <input
                            type="email"
                            value={oEmail}
                            onChange={(o) => setOldEmail(o.target.value)}
                            required
                        />
                    </label>
                    <label>
                        New Email:
                        <input
                            type="email"
                            value={nEmail}
                            onChange={(n) => setNewEmail(n.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input 
                            type="password"
                            value={password}
                            onChange={(p) => setPassword(p.target.value)}
                            minLength={10} 
                            maxLength={20} 
                            required 
                        />
                    </label>
                    <div className="container">
                        <button type="submit" disabled={loading}>
                            {loading ? "Sending... " : "Change Account Email"}
                        </button>
                    </div>
                </form>
            </div>
            </Nav>
        </>
    );
}
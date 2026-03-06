import { Link } from 'react-router-dom';

export default function Nav() {
    //const [token, setToken] = useState(null);

    //useEffect(() => {
        //const storedToken = sessionStorage.getItem("token");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        //setToken(storedToken);
    //}, []);

    //if (token) {
        //return (
            //<ul className="nav-list">
                //<li><Link to="/about">About</Link></li>
                //<li><Link to="/home">Home</Link></li>
            //</ul>
        //);

    return (
        <ul className="nav-list">
            <li><Link to="/">Login</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/home">Home</Link></li>
        </ul>
    );
}

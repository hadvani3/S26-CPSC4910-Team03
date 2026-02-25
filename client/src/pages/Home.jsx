import Nav from '../components/Nav';

export default function Home() {
    return (
        <>
            <Nav />
            <div className="home-test">
                <h1>Home</h1>
                <p className="item"> Welcome to the home page!</p>
            </div>
        </>
    );
}
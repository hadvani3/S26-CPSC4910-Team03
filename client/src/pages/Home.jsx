import Nav from '../components/Nav';

export default function Home() {
    return (
        <>
            <Nav />
            <div className="home-test">
                <h1>Home</h1>
                <p className="item"> Welcome to the home page!</p>
            </div>
            <div className="wrap">
                <div className="home-test">
                    <h1>Basic Information</h1>
                    <p className = "item">
                        Here the driver incentive program rewards diligent behavior
                        and outstanding work in the form of points. Points can be
                        utilized to buy certain rewards that are listed within the
                        product catalog.
                    </p>
                </div>
                <div className="home-test">
                    <h1>Catalog</h1>
                    <p className = "item">
                        Where you can find various products that are available
                        for you to spend your points on.
                    </p>
                </div>
            </div>
        </>
    );
}
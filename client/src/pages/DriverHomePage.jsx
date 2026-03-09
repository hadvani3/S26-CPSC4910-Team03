export default function DriverHomePage(){
    return (
        <>
        <form class="search-container">
            <input type="text" class="search-bar" placeholder="Search..."></input>
            <button class="search-button">Search</button>
        </form>
        <div class = "home-test">
            <ul>
                <li>Welcome back!: </li>
                <li>Total pts: </li>
                <li>Points Earned this month: </li>
            </ul>
        </div>
        <div class = "wrap">
            <div class = "home-test">
                <h1>Sponsors Applied To</h1>
                <ul>
                    <li>Sponsor_a</li>
                    <li>Sponsor_b</li>
                    <li>Sponsor_c</li>
                    <li>Sponsor_d</li>
                    <li>Sponsor_e</li>
                    <li>Sponsor_f</li>
                </ul>
            </div>

            <div class = "home-test">
                <h1>Top Drivers</h1>
                <ol>
                    <li>Driver_1</li>
                    <li>Driver_2</li>
                    <li>Driver_3</li>
                    <li>Driver_4</li>
                    <li>Driver_5</li>
                    <li>Driver_6</li>
                </ol>
            </div>
        </div>
        <div class = "home-test">
            <h1>Apply To A Sponsor</h1>
            <button type = "button">Click Here</button>
        </div>
        
        </>
    );
}

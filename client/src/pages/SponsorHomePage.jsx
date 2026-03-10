import {Link} from 'react-router-dom';
import Nav from '../components/Nav';


export default function SponsorHomePage() {
    return (
        <>
        <Nav />
        <div class = "home-test">
            <ul>
                <li>Welcome back!: </li>
            </ul>
        </div>
        <div class = "wrap">
            <div class = "home-test">
                <h1>Drivers Associated With</h1>
                <ul>
                    <li>Driver_1</li>
                    <li>Driver_2</li>
                    <li>Driver_3</li>
                    <li>Driver_4</li>
                    <li>Driver_5</li>
                    <li>Driver_6</li>
                </ul>
            </div>

            <div class = "home-test">
                <h1>Applications</h1>
                <ol>
                    <li>Application_a</li>
                    <li>Application_b</li>
                    <li>Application_c</li>
                    <li>Application_d</li>
                    <li>Application_e</li>
                    <li>Application_f</li>
                </ol>
            </div>
        </div>
        <div class = "home-test">
            <h1>Approve Driver Applications</h1>
            <button type = "button">Click Here</button>
        </div>
        </>
    );
}
import {Link} from 'react-router-dom';
import Nav from '../components/Nav';

export default function AdminHomePage() {
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
                <h1>Drivers In The System</h1>
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
                <h1>Sponsors In The System</h1>
                <ul>
                    <li>Sponsor_a</li>
                    <li>Sponsor_b</li>
                    <li>Sponsor_c</li>
                    <li>Sponsor_d</li>
                    <li>Sponsor_e</li>
                    <li>Sponsor_f</li>
                </ul>
            </div>
        </div>
        <div class = "wrap">
            <div class = "home-test">
                <h1>Create Driver Users</h1>
                <button type = "button">Click Here</button>
            </div>
            <div class = "home-test">
                <h1>Delete Driver Users</h1>
                <button type = "button">Click Here</button>
            </div>
        </div>
        <div class = "wrap">
            <div class = "home-test">
                <h1>Create Sponsor Users</h1>
                <button type = "button">Click Here</button>
            </div>
            <div class = "home-test">
                <h1>Delete Sponsor Users</h1>
                <button type = "button">Click Here</button>
            </div>
        </div>
        </>
    );
}
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav';


export default function DriverHomePage(){

    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    //search for products from the homepage
    const searchCatalogue = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

    return (
        <>
        <form class="search-container" onSubmit={searchCatalogue}>
            <input type="text" value = {searchQuery} onChange = {(e) => setSearchQuery(e.target.value)} class="search-bar" placeholder="Search..."></input>
            <button class="search-button" type="submit">Search</button>
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

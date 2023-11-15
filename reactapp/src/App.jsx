import React, { Component } from 'react';
import NavigationBar from './Components/NavigationBar';
import HomeComponent from './Components/HomeComponent';

export default function App() {
    return(
        <div>
            <NavigationBar/>
            <main>
                <HomeComponent/>
            </main>
        </div>
    );
}

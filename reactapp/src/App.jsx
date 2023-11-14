import React, { Component } from 'react';
import NavigationBar from './Components/NavigationBar';
import HomeComponent from './Components/HomeComponent';
import Footer from './Components/Footer';

export default function App() {
    return(
        <div>
            <NavigationBar/>
            <main>
                <HomeComponent/>
            </main>
            <Footer/>
        </div>
    );
}

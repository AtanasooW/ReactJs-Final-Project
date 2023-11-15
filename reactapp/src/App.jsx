import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer';
import NavigationBar from './Components/NavigationBar';
import HomeComponent from './Components/HomeComponent';
import ShopComponent from './Components/ShopComponent';
import AddProduct from './Components/AddProduct';

export default function App() {
    return(
        <div>
            <NavigationBar/>
            <main>
                <Routes>
                    <Route index element={<HomeComponent/>}/>
                    <Route path="/shop" element={<ShopComponent/>}/>
                    <Route path="/addProduct" element={<AddProduct/>}/>

                </Routes>
            </main>
            <Footer/>
        </div>
    );
}

import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './Components/FooterComponent/Footer';
import NavigationBar from './Components/NavigationBarComponent/NavigationBar';
import HomeComponent from './Components/HomePageComponent/HomeComponent';
import ShopComponent from './Components/ShopPageComponent/ShopComponent';
import CreateProduct from './Components/CreateProductComponent/CreateProduct';
import UpdateProduct from './Components/UpdateProductComponent/UpdateProduct';
import DetailsComponent from './Components/DetailsPageComponent/DetailsComponent';

export default function App() {
    return(
        <div>
            <NavigationBar/>
            <main>
                <Routes>
                    <Route index element={<HomeComponent/>}/>
                    <Route path="/shop" element={<ShopComponent/>}/>
                    <Route path="/shop/:id" element={<DetailsComponent/>}/>
                    <Route path="/createProduct" element={<CreateProduct/>}/>
                    <Route path="/updateProduct/:id" element={<UpdateProduct/>}/>
                </Routes>
            </main>
            <Footer/>
        </div>
    );
}

    import ApiUrl from "../../Common/Url";
    import { useEffect, useState } from "react";
    import styles from "./ShopComponent.module.css"
    import ProductCard from "./ProductCardComponent/ProductCard";

    const formInitialState = {
        category : '',
        type : '',
        make : '',
        model : '',
        productsPerPage : 16,
        productSorting : 0,
        minPrice : 1,
        maxPrice : 1000
    }
    export default function ShopComponent(){
        const [data, setData] = useState([])
        const [fromValues, setFormValues] = useState(formInitialState)
        const [maxPrice, setMaxPrice] = useState(0);

        useEffect(() => {
            fetch(`${ApiUrl}/api/Shop/All`)
            .then(responese => responese.json())
            .then(d => setData(d))
        }, []);  
        useEffect(() => {
            if (data.products && data.products.length > 0) {
                const prices = data.products.map(product => product.price);
                setMaxPrice(Math.max(...prices));
            }
        }, [data]);  

        const changeHandler = (e) => {
            let value = e.target.value;
            console.log(value);

            setFormValues(state => ({
            ...state,
            [e.target.name]: value === "All" ? '' : value,
            }));
        };
        useEffect(() => {
            console.log(fromValues);
            const queryString = Object.keys(fromValues)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(fromValues[key])}`)
                .join('&');
        
            fetch(`${ApiUrl}/api/Shop/All?${queryString}`)
                .then(response => response.json())
                .then(filteredData => {
                    console.log(filteredData);  // Log the data to the console
                    setData(prevData => ({
                        ...prevData,
                        products: filteredData.products,
                        // Add other properties as needed
                    }));
                })
                .catch(error => console.error("Error fetching filtered data:", error));
        }, [fromValues]);
        
  
        console.log(data)
        return(
            <div className={styles.contentContainer}>
                {/* Options about the search */}

                <div className={styles.optionsContainer}>
                <form action="Get">
                    <div>
                        <label className={styles.biggerLabel} htmlFor="type">Type</label><br/>
                        <select className={styles.selectMenu} id="type" name="type" onChange={changeHandler} >
                            <option>All</option>
                            {data.types && data.types.map(element => (
                                <option key={element} value={element} >{element}</option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className={styles.biggerLabel} htmlFor="category">Category</label><br/>
                        <select className={styles.selectMenu}  id="category" name="category" onChange={changeHandler} >
                            <option>All</option>
                            {data.categories && data.categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className={styles.biggerLabel} htmlFor="make">Makes</label><br/>
                        <select className={styles.selectMenu} id="make" name="make" onChange={changeHandler} >
                            <option>All</option>
                            {data.makes && data.makes.map(make => (
                                <option key={make} value={make}>{make}</option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className={styles.biggerLabel} htmlFor="model">Models</label><br/>
                        <select className={styles.selectMenu} id="model" name="model" onChange={changeHandler} >
                            <option>All</option>
                            {data.models && data.models.map(model => (
                                <option key={model} value={model}>{model}</option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className={styles.biggerLabel} htmlFor="minPrice">Minimum price</label><br/>
                        <input className={styles.inputMenu} type="text" id="minPrice" name="minPrice" placeholder="1" value={fromValues.minPrice} onChange={changeHandler}/><br/>
                    </div>
                    <div>
                        <label className={styles.biggerLabel} htmlFor="maxPrice">Maximum price</label><br/>
                        <input className={styles.inputMenu} type="text" id="maxPrice" name="maxPrice" placeholder="1" value={maxPrice} onChange={changeHandler}/><br/>
                    </div>
                </form>
                </div>

                {/*----- Options about the search -----*/}
                <div className={styles.mainContainer}>
                    <div className={styles.sortContainer}>
                        <form action="Get">
                            <div>
                                <h1>ASN Club shop</h1>
                            </div>
                        <div className={styles.dropDownContainer}>

                        <div className={styles.productsPerPage}>
                            <label className={styles.biggerLabel} htmlFor="productsPerPage">Products per page</label>
                            <select className={styles.selectMenu} id="productsPerPage" name="productsPerPage" onChange={changeHandler} >
                                <option key={16} value={16}>16</option>
                                <option key={20} value={20}>20</option>
                                <option key={24} value={24}>24</option> 
                            </select>
                        </div >
                            <div className={styles.sortingContainer}>
                                <label className={styles.biggerLabel} htmlFor="productSorting">Sort by</label>
                                <select className={styles.selectMenu} id="productSorting" name="productSorting" onChange={changeHandler} >
                                    <option key={0} value={0}>Price Ascending</option>
                                    <option key={1} value={1}>Price Descending</option>
                                    <option key={2} value={2}>Rating Ascending</option>
                                    <option key={3} value={3}>Rating Descending</option>
                                    <option key={4} value={4}>On sale</option>
                                </select>
                            </div>
                        </div>
                        </form>
                    </div>
                    <div className={styles.productsContainer}>
                        {data.products && data.products.map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
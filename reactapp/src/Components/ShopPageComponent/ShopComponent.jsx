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
        console.log(fromValues)
        const queryString = Object.keys(fromValues)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(fromValues[key])}`)
        .join('&');
        
        fetch(`${ApiUrl}/api/Shop/All?${queryString}`)
        .then(responese => responese.json())
        .then(d => setData(d))
    }, [fromValues]);
    return(
        <div className={styles.contentContainer}>
            {/* Options about the search */}

            <div className={styles.optionsContainer}>
            <form action="Get">
                <div>
                    <label className={styles.biggerSpan} htmlFor="type">Type</label><br/>
                    <select id="type" name="type" onChange={changeHandler} >
                        <option>All</option>
                        {data.types && data.types.map(element => (
                            <option key={element} value={element} >{element}</option>
                            ))}
                    </select>
                </div>
                <div>
                    <label className={styles.biggerSpan} htmlFor="category">Category</label><br/>
                    <select id="category" name="category" onChange={changeHandler} >
                        <option>All</option>
                        {data.categories && data.categories.map(category => (
                            <option key={category} value={category} >{category}</option>
                            ))}
                    </select>
                </div>
                <div>
                    <label className={styles.biggerSpan} htmlFor="make">Makes</label><br/>
                    <select id="make" name="make" onChange={changeHandler} >
                        <option>All</option>
                        {data.makes && data.makes.map(make => (
                            <option key={make} value={make} >{make}</option>
                            ))}
                    </select>
                </div>
                <div>
                    <label className={styles.biggerSpan} htmlFor="model">Models</label><br/>
                    <select id="model" name="model" onChange={changeHandler} >
                        <option>All</option>
                        {data.models && data.models.map(model => (
                            <option key={model} value={model} >{model}</option>
                            ))}
                    </select>
                </div>
                <div>
                    <label className={styles.biggerSpan} htmlFor="minPrice">Minimum price</label><br/>
                    <input type="text" id="minPrice" name="minPrice" placeholder="1" value={fromValues.minPrice} onChange={changeHandler}/><br/>
                </div>
                <div>
                    <label className={styles.biggerSpan} htmlFor="maxPrice">Maximum price</label><br/>
                    <input type="text" id="maxPrice" name="maxPrice" placeholder="1" value={maxPrice} onChange={changeHandler}/><br/>
                </div>
            </form>
            </div>

            {/*----- Options about the search -----*/}
            <div className={styles.mainContainer}>
                <div className={styles.sortContainer}>
                    <form action="Get">
                    <div>
                    <label className={styles.biggerSpan} htmlFor="productSorting">Sort by</label><br/>
                    <select id="productSorting" name="productSorting" onChange={changeHandler} >
                        <option key={16} value={16}>16</option>
                        <option key={20} value={20}>20</option>
                        <option key={24} value={24}>24</option>
                          
                    </select>
                    </div>
                        <div>
                            <p>Sort by</p>
                            <select name="productSorting" id="productSorting"></select>
                        </div>
                        <div>
                            <p>Show by</p>
                            <select name="productsPerPage" id="productsPerPage"></select>
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
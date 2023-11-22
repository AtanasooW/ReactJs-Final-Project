import ApiUrl from "../../Common/Url";
import { useEffect, useState } from "react";
import styles from "./ShopComponent.module.css"
import ProductCard from "./ProductCardComponent/ProductCard";

export default function ShopComponent(){
    const [data, setData] = useState([])
    useEffect(() => {
        fetch(`${ApiUrl}/api/Shop/All`)
        .then(responese => responese.json())
        .then(d => setData(d))
    }, []);  
console.log(data);
    return(
        <div>
            <div className={styles.optionsContainer}>

            </div>
            <div className={styles.mainContainer}>
                <div className={styles.sortContainer}>
                    <div>
                        <p>Sort by</p>
                        <select name="productSorting" id="productSorting"></select>
                    </div>
                    <div>
                        <p>Show by</p>
                        <select name="productsPerPage" id="productsPerPage"></select>
                    </div>
                </div>
                <div className={styles.productsContainer}>
                    {/* {data.products.forEach(product => {
                    })}; */}
                    <ProductCard></ProductCard>
                </div>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import ApiUrl from "../../Common/Url";
import styles from "./DetailsComponent.module.css"
import {Button} from "react-bootstrap"
export default function DetailsComponent(){
    const [data, setData] = useState();
    const [quantity, setQuantity] = useState("0");
    const params = useParams();
    console.log(params)

    useEffect(() => {
        fetch(`${ApiUrl}/api/Shop/Details?id=${params.id}`)
        .then(responese => responese.json())
        .then(d => setData(d))
    }, []);  

    function StockStatus(quantity) {
        if (quantity >= 3) {
          return <span style={{ color: "limegreen" }}>In stock</span>;
        } else if (quantity > 0 && quantity < 3) {
          return <span style={{ color: "orange" }}>{quantity} in stock</span>;
        } else {
          return <span style={{ color: "red" }}>Out of stock</span>;
        }
    }
    function increaseQuantity(){
        setQuantity(state=> Number(state) + 1);
    }
    function changeHandler(e){
        let value = Number(e.target.value);
        if(value <= 0){
            setQuantity(0);
        }else{
            setQuantity(value)
        }
    }
    function decreaseQuantity(){
        if(quantity <= 0){
            setQuantity(0);
        }
        else{
            setQuantity(state=> state - 1);
        }    
    }
    console.log(data);
    return(
        <div>
            <div className={styles.imgsContainer}>
                <div className={styles.bigImage}>
                    <img src={data !== undefined ? data.imgUrls[0] : null} alt="" />
                </div>
                <div className={styles.smallImages}>
                    {data && data.imgUrls.map(img => (
                         <img key={img} src={img} alt="" />
                    ))}
                </div>
            </div>
                {data !== undefined ? (
                <div>

                <div className={styles.infoContainer}>
                    <h1 className={styles.productName}>{data.type} for {data.make} {data.model}</h1>
                    <div className={styles.ratingContainer}>
                        <div>
                            {Array.from({ length: Math.floor(data.rating) }).map((_, index) => (
                                <i key={index} className="fa fa-star"></i>
                            ))}
                            {data.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
                            {Array.from({ length: 5 - Math.ceil(data.rating) }).map((_, index) => (
                                <i key={index} className="far fa-star"></i>
                            ))}
                        </div>
                        <h4>{data.rating}</h4>
                        <p>
                            <i class="fa-regular fa-circle fa-xs"></i>
                        </p>
                        <h4><i class="fa-solid fa-basket-shopping fa-lg"></i>154 orders</h4>
                    </div>
                    <div className={styles.isAvailable}>
                        {StockStatus(data.quantity)}
                    </div>
                    {data.color != null ? (
                        <div>
                            <label htmlFor="">Color</label>
                            <select name="color" id="color">
                            <option key={data.color} value={data.id}>{data.color}</option>
                            {data.colors.map(({ productId, colorName }) => (
                                <option key={productId} value={productId}>
                                    {colorName}
                                </option>
                            ))}
                            </select>
                        </div>
                    ) : null}
                </div>
                <div className={styles.checkOutCard}>
                    {data.discount.isDiscount === true ? (
                        <div>
                            <h1 className={styles.price}>${data.price - ((data.price * data.discount.discountRate) / 100)}</h1>
                            <h1 className={styles.oldPrice}>${data.price}</h1>
                        </div>
                    ) : (<h1 className={styles.price}>${data.price}</h1>)}
                    <div>
                        <h2>Quantity</h2>
                        <Button onClick={decreaseQuantity}>-</Button>
                        <input type="text" id="quantity" name="quantity" value={quantity} onChange={changeHandler}/>
                        <Button onClick={increaseQuantity}>+</Button>
                    </div>
                </div>
                </div>
                ) : null}
        </div>
    )
}
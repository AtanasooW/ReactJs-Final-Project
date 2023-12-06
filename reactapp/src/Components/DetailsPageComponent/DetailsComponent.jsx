import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import ApiUrl from "../../Common/Url";
import styles from "./DetailsComponent.module.css"
import * as React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
export default function DetailsComponent(){
    const [data, setData] = useState();
    const [quantity, setQuantity] = useState("0");
    const [selectedImage, setSelectedImage] = useState(null); 
    const navigate = useNavigate();

    var userRole = JSON.parse(localStorage.getItem("UserRole"));
    var check = JSON.parse(localStorage.getItem('currentUser')); //IsUser
    if( check === null) {
        navigate("/")
    } 

    const params = useParams();
    console.log(params)

    useEffect(() => {
        fetch(`${ApiUrl}/api/Shop/Details?id=${params.id}`)
        .then(responese => responese.json())
        .then(d => (setData(d), setSelectedImage(d.imgUrls[0])))
    }, [params.id]);  

    function StockStatus(quantity) {
        if (quantity >= 3) {
          return <span style={{ color: "limegreen" }}><i class="fa-solid fa-check" style={{color: "limegreen"}}></i>In stock</span>;
        } else if (quantity > 0 && quantity < 3) {
          return <span style={{ color: "orange" }}>{quantity} in stock</span>;
        } else {
          return <span style={{ color: "red" }}><i class="fa-solid fa-x" style={{color: "red"}}></i>Out of stock</span>;
        }
    }
    function increaseQuantity(){
        console.log(quantity)

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
    async function setRating(e) {
        console.log(e.target.value)
        const response = await fetch(`${ApiUrl}/api/Shop/Rating?id=${data.id}&ratingValue=${e.target.value}&userId=${check.id}`);
          if(response.status === 200){
            navigate(`/shop/${data.id}`);
          }
          else{
            console.error("Error ocures while rating")
          }
    }
    function decreaseQuantity(){
        console.log(quantity)

        if(quantity <= 0){
            setQuantity(0);
        }
        else{
            setQuantity(state=> state - 1);
        }    
    }
    function handleSmallImageClick(img) {
        setSelectedImage(img);
    }
    function changeColor(e){
        navigate(`/shop/${e.target.value}`)
    }
    async function deleteProduct() {
        const response = await fetch(`${ApiUrl}/api/product/Delete?productId=${data.id}`);
          if(response.status === 200){
            navigate("/");
          }
          else{
            console.error("Error ocures while deleting")
          }
    }
    console.log(data);
    return(
        <div className={styles.container}>
            <div className={styles.imgsContainer}>
                <div className={styles.bigImage}>
                    <img src={selectedImage || (data !== undefined ? data.imgUrls[0] : null)} alt="" />
                </div>
                <div className={styles.smallImages}>
                    {data && data.imgUrls.map(img => (
                         <img key={img} src={img} onClick={() => handleSmallImageClick(img)} alt="" />
                    ))}
                </div>
            </div>
                {data !== undefined ? (
                <>
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
                                <h4 className={styles.ratingValue}>{data.rating}</h4>
                            </div>
                            <p>
                                <i class="fa-regular fa-circle fa-xs"></i>
                            </p>
                            <h4 className={styles.orders}><i class="fa-solid fa-basket-shopping fa-lg"></i>154 orders</h4>
                        </div>
                        <div className={styles.isAvailable}>
                            {StockStatus(data.quantity)}
                        </div>
                        {data.color != null ? (
                            <div className={styles.colorContainer}>
                                <h4>Color:</h4>
                                <select name="color" id="color" onChange={changeColor.bind(this)}>
                                <option key={data.color} value={data.id}>{data.color}</option>
                                {data.colors.map(({ productId, colorName }) => (
                                    <option key={productId} value={productId}>
                                        {colorName}
                                    </option>
                                ))}
                                </select>
                            </div>
                        ) : null}
                        <div className={styles.infoList}>
                            <ul>
                                <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                                <li>Sint totam molestiae dolorum laborum neque excepturi.</li>
                                <li>Rem perferendis accusantium ea iste aliquam aperiam,</li>
                                <li>obcaecati commodi quos ex, eligendi animi aliquid dignissimos.</li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.checkOutCard}>
                        {data.discount.isDiscount === true ? (
                            <div>
                                <h1 className={styles.price}>${(data.price - ((data.price * data.discount.discountRate) / 100)).toFixed(2)}<span className={styles.oldPrice}>${data.price.toFixed(2)}</span></h1>
                                
                            </div>
                        ) : (<h1 className={styles.price}>${data.price.toFixed(2)}</h1>)}
                        <p>Price per product</p>
                        <div className={styles.quantityContainer}>
                            <h2>Quantity:</h2>
                            <div className={styles.quantityFunc}>
                                <button onClick={decreaseQuantity}><i class="fa-solid fa-minus fa-xl"></i></button>
                                <input className={styles.quantityInput} type="text" id="quantity" name="quantity" value={quantity} onChange={changeHandler}/>
                                <button onClick={increaseQuantity}><i class="fa-solid fa-plus fa-xl"></i></button>
                            </div>
                        </div>
                        <div className={styles.btnsContainer}>
                            <button className={styles.addToCardBtn}>Add to card</button>
                            <button className={styles.buyNowBtn}>Buy now</button>
                            {userRole === "Moderator" ? (
                              <button className={styles.deleteProduct} onClick={deleteProduct}>Delete</button>
                              ) : (null)}
                        </div>
                        <div className={styles.ratingStars}>
                            <h4 className={styles.ratingLabel} htmlFor="rating">Rating:</h4>
                            <Stack spacing={1}>
                                <Rating name="half-rating" defaultValue={0.5} precision={0.5} onChange={setRating}/>
                            </Stack>
                        </div>
                        <div>
                            <p><i class="fa-solid fa-truck"></i> Worldwide shipping</p>
                            <p><i class="fa-solid fa-shield"></i> Secure payment</p>
                            <p><i class="fa-solid fa-medal"></i>2 years full warranty</p>
                        </div>
                    </div>
                </>
                ) : null}
        </div>
    )
}
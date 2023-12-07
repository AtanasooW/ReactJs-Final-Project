import styles from "./ProductCard.module.css"
import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function ProductCard(product){
  console.log("a");
  console.log(product.id)
  console.log(product);
  return (
    <Card className={styles.card}>
      <Card.Img variant="top" src={product.imgUrl} />
      <Card.Body>
        <Card.Title>{product.type} for {product.make} {product.model}</Card.Title>
        <Card.Text>
          {product.rating !== null && (
             <div className={styles.stars}>
              <h6>Rating:</h6>
             {Array.from({ length: Math.floor(product.rating) }).map((_, index) => (
                 <i key={index} class="fa-solid fa-star fa-xs" style={{color: "#fbff00"}}></i>
             ))}
             {product.rating % 1 !== 0 && <i class="fa-solid fa-star-half-stroke fa-xs" style={{color: "#fbff00"}}></i>}
             {Array.from({ length: 5 - Math.ceil(product.rating) }).map((_, index) => (
                 <i key={index} class="fa-regular fa-star fa-xs" style={{color: "#fbff00"}}></i>
             ))}
         </div>
          )}
         
          
        </Card.Text>
        <Card.Text className={styles.price}>
        {product.isDiscount === true ? (
                            <div>
                               Price:<span className={styles.whiteSpan}> ${(product.price - ((product.price * product.discountRate) / 100)).toFixed(2)}<span className={styles.oldPrice}>${product.price.toFixed(2)}</span></span>
                            </div>
                        ) : (<span>Price: <span className={styles.whiteSpan}>${product.price}</span></span>)}
        </Card.Text>
        <div className={styles.buttonContainer}>
          
        <a href={`/shop/${product.id}`}><Button className={styles.redButton}>View Details</Button></a>
        <a href={`/shop/${product.id}`}><Button className={styles.blueButton}>Buy now</Button></a>
        </div>
      </Card.Body>
    </Card>
  );
}
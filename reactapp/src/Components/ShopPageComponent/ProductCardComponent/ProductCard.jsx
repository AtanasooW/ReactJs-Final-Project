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
          Rating:
        </Card.Text>
        <Card.Text className={styles.price}>
          Price: <span className={styles.whiteSpan}>${product.price}</span>
        </Card.Text>
        <div className={styles.buttonContainer}>
          
        <a href={`/shop/${product.id}`}><Button className={styles.redButton}>View Details</Button></a>
        <Button className={styles.blueButton}>Buy now</Button>
        </div>
      </Card.Body>
    </Card>
  );
}
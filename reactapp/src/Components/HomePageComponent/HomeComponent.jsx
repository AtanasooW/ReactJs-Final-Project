import styles from "./HomeComponent.module.css"
import { Link } from "react-router-dom";
export default function HomeComponent(){
    const shopUrl = "/shop"
    return(
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img className={styles.backgroundImg} src="./images/BackgroundImgMK3.png" alt="" />
                <div className={styles.onTopText}>
                    <h1>ASN<span className={styles.redSpan}>Club</span></h1>
                    <h3>Best quality in Bul<span style={{color: "lightgreen"}}>ga</span><span style={{color: "#cf2c44"}}>ria</span></h3>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate ab eius fuga repellendus inventore alias similique minima sint nisi commodi minus totam rerum distinctio, eum iste, vitae aliquid tempora laborum.</p>
                    <a href={shopUrl}><button  className={styles.redButton}>Shop Now</button></a>
                </div>
            </div>
            <div className={styles.lowPricesContainer}>
                <div>
                    <img className={styles.dark} src="./images/Cz75.png" alt="" />
                    <div>
                        <h2>Special Offers</h2>
                        <a href={shopUrl}><button href={shopUrl} className={styles.redButton}>Shop Now</button></a>
                    </div>
                </div>
                <div>
                    <img className={styles.dark} src="./images/WaltherPPK.png" alt="" />
                    <div>
                        <h2>Special Offers</h2>
                        <a href={shopUrl}><button href={shopUrl} className={styles.redButton}>Shop Now</button></a>
                    </div>
                </div>
            </div>
            <div className={styles.categories}>
                <div>Categories</div>
                <ul>
                    <li><Link>Grips</Link></li>
                    <li><Link>Magazine bottoms</Link></li>
                    <li><Link>Kits</Link></li>
                    <li><Link>Parts</Link></li>
                </ul>
            </div> 
        </div>
    );
}
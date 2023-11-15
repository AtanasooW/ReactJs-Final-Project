import {Link} from "react-router-dom"
import styles from "./NavigationBar.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCartShopping, faUser} from '@fortawesome/free-solid-svg-icons'

export default function NavigationBar(){
    return (
        <header className = {styles.navbarHeader}>
            <div className={styles.logoContainer}>
                <Link to="/">
                <img src="ASNLogo.jpg" alt="logo" />
                <h2>ASN<span>Club</span></h2>
                </Link>
            </div>
            <div className={styles.navsContainer}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/shop">Shop</Link></li>
                    <li><Link to="/contacts">Contacts</Link></li>
                </ul>
            </div>
            <div className={styles.userContainer}>
                <div>
                    <Link to="/profile">
                        <FontAwesomeIcon icon={faUser} size="xl"/>
                    </Link>
                </div>
                <div className={styles.shoppingCartContainer}>
                <Link to="/shoppingCart">
                    <div>
                        <FontAwesomeIcon icon={faCartShopping} size="xl" />
                    </div>
                    <h5>0.00$</h5>
                </Link>
                </div>
            </div>
        </header>
    ) ;
}
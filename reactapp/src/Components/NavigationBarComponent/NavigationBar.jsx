import {Link, useNavigate} from "react-router-dom"
import styles from "./NavigationBar.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCartShopping, faUser} from '@fortawesome/free-solid-svg-icons'
import { useEffect } from "react";

export default function NavigationBar(){
    const navigate = useNavigate();
    var storedUser = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        localStorage.setItem('currentUser', JSON.stringify(storedUser));
      }, [storedUser]);
      function Logout(){
          localStorage.clear();
          window.location.reload(false);
          navigate("/")
        }
    return (
        <header className = {styles.navbarHeader}>
            <div className={styles.logoContainer}>
                <Link to="/">
                <img src="ASNLogo.jpg" alt="logo" />
                <h2>ASN<span className={styles.redSpan}>Club</span></h2>
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
                {storedUser !== null ?(
                    <>
                    <div className={styles.shoppingCartContainer}>
                        <Link to="/shoppingCart">
                        <div>
                            <FontAwesomeIcon icon={faCartShopping} size="2xl" />
                        </div>
                        <h4>5.00$</h4>
                        </Link>
                    </div>
                    <h4 className={styles.h4ForName}>Welcome: <span className={styles.spanForName}>{storedUser.userName}</span></h4>
                    <button className={styles.logoutBtn} onClick={Logout}>Logout</button>
                    </>
                ): (
                    <div>
                        <Link to="/singup">
                            <h4>Sing Up</h4>
                        </Link>
                        <Link to="/singin">
                            <h4>Sing In</h4>
                        </Link>
                    </div>

                )}
                
            </div>
        </header>
    ) ;
}
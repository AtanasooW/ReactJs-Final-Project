import styles from "./HomeComponent.module.css"
import { Link } from "react-router-dom";
export default function HomeComponent(){
    return(
        <div className={styles.container}>
            <div className={styles.imgContainer}>

                <div className={styles.background}>
                        <div>
                            <h1>ASNCLUb</h1>
                        </div>
                </div>
            </div>
            <aside className={styles.categories}>
                <div>Categories</div>
                <ul>
                    <li><Link>Grips</Link></li>
                    <li><Link>Magazine bottoms</Link></li>
                    <li><Link>Kits</Link></li>
                    <li><Link>Parts</Link></li>
                </ul>
            </aside>
        </div>
    );
}
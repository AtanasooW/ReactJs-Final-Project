import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import ApiUrl from "../../Common/Url";
import styles from "./DetailsComponent.module.css"

export default function DetailsComponent(){
    const [data, setData] = useState();

    const params = useParams();
    console.log(params)

    useEffect(() => {
        fetch(`${ApiUrl}/api/Shop/Details?id=${params.id}`)
        .then(responese => responese.json())
        .then(d => setData(d))
    }, []);  

    console.log(data);
    return(
        <div>
            <div className={styles.imgsContainer}>
                <div className={styles.bigImage}>
                    <img src={data !== undefined ? data.imgUrls[0] : null} alt="" />
                </div>
                <div className={styles.smallImages}>
                    {data !== undefined ? (data.imgUrls && data.imgUrls.map(img => {
                        {console.log(img)}
                        <img src={img} alt="" />
                    })) : null}
                </div>
            </div>
        </div>
    )
}
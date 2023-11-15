import { useEffect, useState } from "react";
import Url from "../Common/Url";
export default function AddProduct(){
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(Url + "api/product/Create")
        .then(responese => responese.json())
        .then(d => console.log(d))
      }, []);    

      return(
        <div>

        <h1>Add Product</h1>
        <p>{data}</p>
        {console.log(data)}
        </div>
    );
}
import { useEffect, useState } from "react";
import Url from "../Common/Url";
import styles from "./AddProduct.module.css"

const formInitialState = {
  make : '',
  model : '',
  typeId: 0,
  price: '',
  discount: {
      isDiscount: false,
      name: '',
      discountRate: '',
      startDate: '',
      endDate: ''
  },
  discountId: 0,
  description: '',
  quantity: '',
  categoryId: 0,
  imgs: [],
  imgUrls: [],
  colorId: 0,
}
export default function AddProduct(){
  
  const [data, setData] = useState([]);
  const[checkedDiscount, setChekedDiscount] = useState(false);
  const[checkedColor, setChekedColor] = useState(false);
  const [file, setFile] = useState([]);
  const[formValues, setFormValues] = useState(formInitialState);

  useEffect(() => {
        fetch("https://localhost:7047/api/product/Create")
        .then(responese => responese.json())
        .then(d => setData(d))
      }, []);    
    // Need to fix the discount logic about not going in one object!!!!
      const changeHandler = (e) => {
        let value = e.target.value;
        console.log(value);
        if(e.target.name.startsWith("discount")){
          setFormValues(state => ({
            ...state,
            discount: {[e.target.name]: value},
          }));
        }
        setFormValues(state => ({
          ...state,
          [e.target.name]: value,
        }));
      };
  function DiscountChange(){
    data.discount.isDiscount = !checkedDiscount
    setChekedDiscount(!checkedDiscount);
  }
  function ColorChange(){
    setChekedColor(!checkedColor);
  }
  function ImageUpload(e) {
    const selectedFiles = Array.from(e.target.files);
      
        // Use map to create an array of URLs from the selected files
    const fileUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      
        // Set the file state to the array of file URLs
    setFile(fileUrls);
      
        // Logging the file objects htmlFor further processing if needed
    console.log(selectedFiles);
  }
  function SubmitForm(e) {
    e.preventDefault();
    console.log(formValues);
    return;
    fetch("https://localhost:7047/api/product/Create", {
      method: "POST",
      body: formValues,
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Handle the server response as needed
      })
      .catch(error => {
        console.error("Error creating product:", error);
      });
  }
      return(
        <div>
          <form type="Post" onSubmit={SubmitForm}>

            <div className={styles.container}>
              <h1>Add Product</h1>
              <div>
                <label htmlFor="make">Make of the gun:</label><br/>
                <input type="text" id="make" name="make" placeholder="Browning" value={formValues.make} onChange={changeHandler}/><br/>
              </div>
              <div>
                <label htmlFor="model">Model of the gun:</label><br/>
                <input type="text" id="model" name="model"placeholder="Mk3" value={formValues.model} onChange={changeHandler}/><br/>
              </div>
              <div>
                <label htmlFor="price">Price of the product:</label><br/>
                <input type="number" id="price" name="price" placeholder="300" value={formValues.price} onChange={changeHandler}/><br/>
              </div>
              <div>
                <label htmlFor="description">Description of the gun:</label><br/>
                <textarea type="text" id="description" name="description" placeholder="This product is perf.." value={formValues.description} onChange={changeHandler}/><br/>
              </div>
              <div>
                <label htmlFor="quantity">Quantity of the product:</label><br/>
                <input type="number" id="quantity" name="quantity" placeholder="7" value={formValues.quantity} onChange={changeHandler}/><br/>
              </div>
              <div>
                <label htmlFor="typeId">Type</label><br/>
                <select id="typeId" name="typeId" onChange={changeHandler}>
                  <option></option>
                  {data.types && data.types.map(element => (
                    <option key={element.id} value={element.id} >{element.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="categoryId">Category</label><br/>
                <select id="categoryId" name="categoryId" onChange={changeHandler}>
                <option></option>
                  {data.categories && data.categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>
                    <input id="colorCheckbox" type="checkbox" onChange={ColorChange}/> Add Color
                </label>
              </div>
              {checkedColor ? (<div>
                <label htmlFor="colorId">Color</label><br/>
                <select id="colorId" name="colorId" onChange={changeHandler}>
                <option></option>
                  {data.colors && data.colors.map(color => (
                    <option key={color.id} value={color.id}>{color.name}</option>
                  ))}
                </select>
              </div>) : (null)}
              
              <div>
                <label>
                    <input id="discountCheckbox" type="checkbox" onChange={DiscountChange}/> Add Discount
                </label>
              </div>
               {checkedDiscount ? (
                <div>
                  <div>
                    <label htmlFor="discount.name">Discount Name:</label><br/>
                    <input type="text" id="discount.name" name="discount.name" placeholder="Black Friday 5%" onChange={changeHandler}/><br/>
                  </div>
                  <div>
                    <label htmlFor="discount.discountRate">Discount Rate:</label><br/>
                    <input type="number" id="discount.discountRate" name="discount.discountRate" placeholder="5" onChange={changeHandler}/><br/>
                  </div>
                  <div>
                    <label htmlFor="discount.startDate">Discount Start Date:</label><br/>
                    <input type="date" id="discount.startDate" name="discount.startDate" onChange={changeHandler}/><br/>
                  </div>
                  <div>
                    <label htmlFor="discount.endDate">Discount End Date:</label><br/>
                    <input type="date" id="discount.endDate" name="discount.endDate" onChange={changeHandler}/><br/>
                  </div>
                  <div>
                <label htmlFor="discountId">Discounts</label><br/>
                <select id="discountId" name="discountId" onChange={changeHandler}>
                <option></option>
                  {data.discounts && data.discounts.map(discount => (
                    <option key={discount.id} value={discount.id}>{discount.name}</option>
                  ))}
                </select>
              </div>
                </div>
               ) : (null)} 
                <div>
                    <label >Image upload:</label><br/>
                    <input type="file" multiple onChange={ImageUpload} /><br/>
                    {file.map((imageUrl, index) => (
                      <img key={index} src={imageUrl} alt={`uploaded-${index}`} />
                    ))}
                </div>
                <button type="submit">Add product</button>
            </div>
          </form>
        </div>
    );
}
import { useEffect, useState } from "react";
import ApiUrl from "../Common/Url";
import styles from "./AddProduct.module.css"
import { useNavigate } from "react-router-dom";

const formInitialState = {
  make : '',
  model : '',
  typeId: 0,
  price: '',
  discount: {
      isDiscount: false,
      name: '',
      discountRate: 0,
      startDate: null,
      endDate: null
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
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const[checkedDiscount, setChekedDiscount] = useState(false);
  const[checkedColor, setChekedColor] = useState(false);
  const [file, setFile] = useState([]);
  const[formValues, setFormValues] = useState(formInitialState);
  const[urls,setUrls] = useState([]);
  const[images,setImages] = useState([]);

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
          discount: {...state.discount,
            [(e.target.name).slice(9)]: value},
        }));
      }
      else{
        setFormValues(state => ({
        ...state,
        [e.target.name]: value,
        }));
      }
    };
  function DiscountChange(){
    formValues.discount.isDiscount = !checkedDiscount
    setChekedDiscount(!checkedDiscount);
  }
  function ColorChange(){
    setChekedColor(!checkedColor);
  }
  function ImageUpload(e) {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
    
    const fileUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setFile(fileUrls);
}
  

async function SubmitForm(e) {
  e.preventDefault();

  try {
    // Step 1: Upload images and collect URLs
    const uploadPromises = images.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://localhost:7047/api/product/Photos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error uploading image');
      }

      const returnedData = await response.json();
      setUrls((state) => [...state, returnedData.url]);
      return returnedData;
    });

    const uploadedData = await Promise.all(uploadPromises);

    // Step 2: Use the collected URLs in formValues
    const newImgUrls = uploadedData.map((data) => `${ApiUrl}${data.url}`);
    console.log(formValues);
    console.log(newImgUrls);
    console.log('a');
    formValues.imgUrls = newImgUrls
    console.log(formValues);

    // Step 3: Send the final request
    const finalResponse = await fetch('https://localhost:7047/api/product/Create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    });
    if(finalResponse.ok){
      navigate("/");
    }
    else if (!finalResponse.ok) {
      throw new Error('Error creating product');
    }

    const responseData = await finalResponse.json();
    console.log(responseData); // Handle the server response as needed
  } catch (error) {
    console.error('Error:', error);
  }
}

  return(
    <div className={styles.rootEl}>
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
          <div className={styles.checkBoxContainer}>
            <label id={styles.checkLabel}>Add Color</label>
            <input id="colorCheckbox" type="checkbox" onChange={ColorChange}/> 
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
          <div className={styles.checkBoxContainer}>
            <label id={styles.checkLabel}>Add Discount</label>
            <input id="discountCheckbox" type="checkbox" onChange={DiscountChange}/> 
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
            <div className={styles.imageUploadContainer}>
                <label className={styles.labelBtn} for="file-upload">Image upload
                <input id="file-upload" type="file" multiple onChange={ImageUpload} />
                </label>
                <div className={styles.imageContainer}>
                  {file.map((imageUrl, index) => (
                    <img key={index} src={imageUrl} alt={`uploaded-${index}`} />
                  ))}
                </div>
                
            </div>
            <button type="submit">Add product</button>
        </div>
      </form>
    </div>
  );
}
import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import ApiUrl from "../../Common/Url";
import styles from "../CreateProductComponent/CreateProduct.module.css"
const formInitialState = {
    id: '',
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
    DiscountId: 0,
    description: '',
    quantity: '',
    categoryId: 0,
    imgs: [],
    imgUrls: [],
    colorId: 0,
  }
// const fileInitialState = [{
//     url: '',
//     fileName: ''
// }]
  export default function UpdateProduct(){
    const params = useParams();
    const navigate = useNavigate();

    const[urls,setUrls] = useState([]);
    const[checkedDiscount, setChekedDiscount] = useState(false);
    const[checkedColor, setCheckedColor] = useState(false);
    const[startDateHelper, setStartDateHelper] = useState("");
    const [file, setFile] = useState([]);//fileInitialState
    const[images,setImages] = useState([]);
    const[formValues,setFormValues] = useState(formInitialState)

    var check = JSON.parse(localStorage.getItem('currentUser')); //IsUser
    if( check !== null) {
      var userRole = JSON.parse(localStorage.getItem('UserRole'));
      if(userRole !== "Moderator"){
        navigate("/")
      }
    } 
    else{
      navigate("/")
    }
    
    useEffect(() => {
      fetch(`${ApiUrl}/api/product/Update?id=${params.id}`)
      .then(responese => responese.json())
      .then(d => {setFormValues(d);
        setFile(d.imgUrls);
        onLoadColor(d.colorId);
        onLoadDiscount(d.discount.isDiscount, d.discount.startDate);
      })
    }, []);

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
    function onLoadDiscount(isDiscount, startDate) {
      if(isDiscount){
        const tempObject = new Date(startDate);
        console.log(tempObject);
        const isoDateString = tempObject.toISOString().split('T')[0];
        console.log(isoDateString);
        setStartDateHelper(isoDateString);
        document.getElementById("discountCheckbox").click();
        DiscountChange();
      }
    }
    function DiscountChange(){
        formValues.discount.isDiscount = !checkedDiscount
        setChekedDiscount(!checkedDiscount);
    }
    function onLoadColor(colorId){
      if(colorId !== null){
        document.getElementById("colorCheckbox").click();
        ColorChange();
      }
    }
    function ColorChange(){
        formValues.colorId = !checkedColor === false ? null : formValues.colorId;
        setCheckedColor(!checkedColor);
    }
    function ImageUpload(e) {
      const selectedFiles = Array.from(e.target.files);
      setImages(selectedFiles);
        
        console.log('a')
        const fileUrls = selectedFiles.map((file) => URL.createObjectURL(file));//{url: URL.createObjectURL(file), fileName: file.name}
        formValues.imgUrls.forEach(imgUrl => {
            fileUrls.unshift(imgUrl);//{url: imgUrl, fileName: null}
        });
        setFile(fileUrls);
        console.log(fileUrls)
        console.log(images)
    }
    function ImageRemove(e) {
        const targetImgUrl = e.target.getAttribute("name");
        console.log(targetImgUrl)
        //Remove on uploaded image at the moment
        // console.log(targetImgUrl)
        // console.log(file)
        // if (Array.isArray(images)) {
        //     const updatedImages = images.filter(file => file.name !== targetImgUrl);
        //     setImages(updatedImages);
        // }
        // console.log(images);
        if (Array.isArray(file)) {
            setFile(state => state.filter(imgUrl => imgUrl !== targetImgUrl))
        }

        formValues.imgUrls = formValues.imgUrls.filter(imgUrl => imgUrl !== targetImgUrl);
        console.log(formValues)
    }
    async function SubmitForm(e) {
        e.preventDefault();
        try {
            // Step 1: Upload images and collect URLs
            console.log(images)
            const uploadPromises = images.map(async (file) => {
              const formData = new FormData();
              formData.append('file', file);
        
              const response = await fetch(`${ApiUrl}/api/product/Photos`, {
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
            newImgUrls.forEach(newImgUrl => {
                formValues.imgUrls.unshift(newImgUrl)
            });
            console.log(formValues);
        
            // Step 3: Send the final request
            const finalResponse = await fetch('https://localhost:7047/api/product/Update', {
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
              <h1>Update Product</h1>
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
                <select id="typeId" name="typeId" value={formValues.typeId} onChange={changeHandler}>
                  <option></option>
                  {formValues.types && formValues.types.map(element => (
                    <option key={element.id} value={element.id} >{element.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="categoryId">Category</label><br/>
                <select id="categoryId" name="categoryId" value={formValues.categoryId}  onChange={changeHandler}>
                <option></option>
                  {formValues.categories && formValues.categories.map(category => (
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
                <select id="colorId" name="colorId" value={formValues.colorId} onChange={changeHandler}>
                  {formValues.colors && formValues.colors.map(color => (
                    <option key={color.id} value={color.id}>{color.name}</option>
                  ))}
                </select>
              </div>) : (null)}
              <div className={styles.checkBoxContainer}>
                <label id={styles.checkLabel}>Add Discount</label>
                <input id="discountCheckbox" type="checkbox" onChange={DiscountChange}/> {/* must fix that when something have discount doesnt display  */}
              </div>
               {checkedDiscount ? (
                <div>
                  <div>
                    <label htmlFor="discount.name">Discount Name:</label><br/>
                    <input type="text" id="discount.name" name="discount.name" placeholder="Black Friday 5%" value={formValues.discount.name} onChange={changeHandler}/><br/>
                  </div>
                  <div>
                    <label htmlFor="discount.discountRate">Discount Rate:</label><br/>
                    <input type="number" id="discount.discountRate" name="discount.discountRate" placeholder="5" value={formValues.discount.discountRate} onChange={changeHandler}/><br/>
                  </div>
                  <div>
                    <label htmlFor="discount.startDate">Discount Start Date:</label><br/>
                    <input type="date" id="discount.startDate" name="discount.startDate" value={startDateHelper} onChange={changeHandler}/><br/>
                  </div>
                  <div>
                    <label htmlFor="discount.endDate">Discount End Date:</label><br/>
                    <input type="date" id="discount.endDate" name="discount.endDate" value={Date(formValues.discount.endDate)} onChange={changeHandler}/><br/>
                  </div>
                  <div>
                <label htmlFor="DiscountId">Discounts</label><br/>
                <select id="DiscountId" name="DiscountId" onChange={changeHandler}>
                <option></option>
                  {formValues.discounts && formValues.discounts.map(discount => (
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
                      {file.map((imgUrl, index) => (
                        <img key={index} src={imgUrl} name={imgUrl}  onClick={ImageRemove} />//name={file.fileName !== null ? file.fileName : file.url} alt={`uploaded-${index}`} **** src={file.fileName === undefined ? file : file.url}
                      ))}
                    </div>
                    
                </div>
                <button type="submit">Update product</button>
            </div>
          </form>
        </div>
      );
}
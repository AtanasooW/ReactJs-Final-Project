
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ApiUrl from "../../Common/Url";

const formInitialState = {
    city: '',
    street1 : '',
    street2 : '',
    streetNumber: '',
    postalCode: '',
    productId: 0,
    quantity: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  }
export default function Checkout(){
    const[formValues, setFormValues] = useState();
    const[discountPrice, setDiscountPrice] = useState(0);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(formValues){
            console.log(formValues)
            setDiscountPrice(formValues.price - ((formValues.price * formValues.discountRate) / 100))
        }
    }, [formValues])

    useEffect(() => {
        fetch(`${ApiUrl}/api/shop/CheckoutProduct?id=${params.id}`)
        .then(responese => responese.json())
        .then(d => {setFormValues(d);
          console.log(d);
        })
      }, []);
    function changeHandler(e){
        let value = e.target.value;
        console.log(value);
        formValues.productId = params.id;
        formValues.quantity = params.quantity;
        setFormValues(state => ({
        ...state,
        [e.target.name]: value,
        }));
    }
    async function SubmitForm(e) {
        e.preventDefault();

        // const finalResponse = await fetch(`${ApiUrl}/api/shop/PlaceOrder`, {
        //       method: 'POST',
        //       headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //       },
        //       body: JSON.stringify(formValues),
        //     });
        //     if(finalResponse.ok){
            //     }
            //     else if (!finalResponse.ok) {
                //       throw new Error('Error creating product');
                //     }
        navigate("/");
    } 

    return(
            <div className="container wrapper">
                <link href="//netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>

                <div className="row cart-head">
                    <div className="container">
                        <div className="row">
                            <p></p>
                        </div>
                        <div className="row">
                            <p h3>Finish order</p>
                        </div>
                    </div>
                </div>
                <div className="row cart-body">

                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 col-md-push-6 col-sm-push-6">
                        <div className="panel panel-info" style={{paddingBottom: "8em"}}>
                            <div className="panel-heading">
                                Review Order <div className="pull-right"><small><a asp-controller="ShoppingCart" asp-action="MyShoppingCart" className="afix-1">Edit Cart</a></small></div>
                            </div>

            {formValues && (
            <>
                <div className="panel-body">
                    <div className="panel-body">
                        <div class="form-group product">
                            <div class="col-sm-3 col-xs-3">
                                <img class="img-responsive" src={formValues.imgUrl} />
                            </div>
                            <div class="col-sm-6 col-xs-6">
                                <h3 class="col-xs-12">{formValues.type} For {formValues.make} {formValues.model}</h3>
                                <div class="col-xs-12"><h6>Quantity:<span class="quantity-input h6"> {params.quantity}</span></h6></div>
                                {formValues.color !== null ?
                                    (<div class="col-xs-12"><small>Color:<span>{formValues.color}</span></small></div>) : (null)
                                }
                            </div>
                            <div class="col-sm-3 col-xs-3 text-right">
                                {formValues.isDiscount === true ? (
                                    <div>
                                        <span class="text-muted text-decoration-line-through h5">{formValues.price} BGN</span>
                                        <br />
                                        <span id="price" class="h4">{discountPrice} BGN</span>
                                    </div>)
                                    :(<span id="price" class="h4">{formValues.price} BGN</span>)
                                }
                            </div>
    
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-xs-12">
                        <h2><strong>Order Total</strong></h2>
                        <div className="pull-right"><span id="total" className="h1">{(formValues.price) * params.quantity} BGN</span></div>
                    </div>
                </div>
            </>
    )}
    
            </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 col-md-pull-6 col-sm-pull-6">
            <div className="panel panel-info">
                <div className="panel-heading">Address</div>
                <div className="panel-body">
                    
                     <h4>Finish order</h4>
                    <form method="post" onSubmit={SubmitForm}>
                        <div className="form-group">

                            <label>First name</label>
                            <input className="form-control" placeholder="Ivan..." onChange={changeHandler}/>
                            <span className="small text-danger"></span>
                        </div>

                        <div className="form-group">

                            <label>Last name</label>
                            <input className="form-control" placeholder="Ivanov..." onChange={changeHandler}/>
                            <span className="small text-danger"></span>

                        </div>
                        <div className="form-group">

                            <label>City</label>
                            <input className="form-control" placeholder="Sofia..." onChange={changeHandler}/>
                            <span className="small text-danger"></span>

                        </div>
                        <div className="form-group">

                            <label>Street 1</label>
                            <input className="form-control" placeholder="Tzar Boris 3..." onChange={changeHandler}/>
                            <span className="small text-danger"></span>

                        </div>
                        <div className="form-group">

                            <label>Street 2</label>
                            <input className="form-control" placeholder="..." onChange={changeHandler}/>
                            <span className="small text-danger"></span>

                        </div>
                        <div className="form-group">

                            <label>Street number</label>
                            <input className="form-control" placeholder="57..." onChange={changeHandler}/>
                            <span className="small text-danger"></span>
                        </div>
                        <div className="form-group">
                            <label>PostalCode</label>
                            <input className="form-control" placeholder="2500..." onChange={changeHandler}/>
                            <span className="small text-danger"></span>
                        </div>
                        <div className="form-group">

                            <label>PhoneNumber</label>
                            <input className="form-control" placeholder="088..." onChange={changeHandler}/>
                            <span className="small text-danger"></span>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input className="form-control" placeholder="example@gmail.com..." onChange={changeHandler}/>
                            <span className="small text-danger"></span>
                        </div>
                        <div className="form-group">
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <button type="submit" className="btn btn-primary btn-submit-fix" value="Save">Place Order</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </div>
    <div className="row cart-footer">
    </div>

</div>
    )
}

import { useParams } from "react-router-dom";
import styles from "./Checkout.module.css"
import { useEffect, useState } from "react";
import ApiUrl from "../../Common/Url";


export default function Checkout(){
    const[formValues, setFormValues] = useState();
    const params = useParams();
    
    useEffect(() => {
        fetch(`${ApiUrl}/api/shop/CheckoutProduct?id=${params.id}`)
        .then(responese => responese.json())
        .then(d => {setFormValues(d);
          console.log(d);
        })
      }, []);
    async function SubmitForm(e) {
        e.preventDefault();
    } 

    return(
            <div className="container wrapper">
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
            <div className="panel panel-info">
                <div className="panel-heading">
                    Review Order <div className="pull-right"><small><a asp-controller="ShoppingCart" asp-action="MyShoppingCart" className="afix-1">Edit Cart</a></small></div>
                </div>

                <div className="panel-body">
                    <div className="panel-body">
                    <div class="form-group product">
    <div class="col-sm-3 col-xs-3">
        <img class="img-responsive" src="@Model.ImgUrl" />
    </div>
    <div class="col-sm-6 col-xs-6">
        <div class="col-xs-12">{formValues.type} For {formValues.make} {formValues.model}</div>
        <div class="col-xs-12"><small>Quantity:<span class="quantity-input">@Model.QuantityFromShoppingCart</span></small></div>
       
        {formValues.color !== null ?
            (<div class="col-xs-12"><small>Color:<span>@Model.Color</span></small></div>) : (null)
        }
    </div>
    <div class="col-sm-3 col-xs-3 text-right">
       
        {formValues.isDiscount === true ? (
            <div>
                <span class="text-muted text-decoration-line-through h6">@Model.Price BGN</span>
                <br />
                <span id="price" class="h5">@discountPrice BGN</span>
            </div>)
            :(<span id="price" class="h5">@Model.Price BGN</span>)
        }
    </div>
</div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-xs-12">
                        <strong>Order Total</strong>
                        <div className="pull-right"><span id="total" className="h4"></span></div>
                    </div>
                </div>
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
                            <input className="form-control" placeholder="Ivan..."/>
                            <span className="small text-danger"></span>
                        </div>

                        <div className="form-group">

                            <label>Last name</label>
                            <input className="form-control" placeholder="Ivanov..."/>
                            <span className="small text-danger"></span>

                        </div>
                        <div className="form-group">

                            <label>City</label>
                            <input className="form-control" placeholder="Sofia..."/>
                            <span className="small text-danger"></span>

                        </div>
                        <div className="form-group">

                            <label>Street 1</label>
                            <input className="form-control" placeholder="Tzar Boris 3..."/>
                            <span className="small text-danger"></span>

                        </div>
                        <div className="form-group">

                            <label>Street 2</label>
                            <input className="form-control" placeholder="..."/>
                            <span className="small text-danger"></span>

                        </div>
                        <div className="form-group">

                            <label>Street number</label>
                            <input className="form-control" placeholder="57..."/>
                            <span className="small text-danger"></span>
                        </div>
                        <div className="form-group">
                            <label>PostalCode</label>
                            <input className="form-control" placeholder="2500..."/>
                            <span className="small text-danger"></span>
                        </div>
                        <div className="form-group">

                            <label>PhoneNumber</label>
                            <input className="form-control" placeholder="088..."/>
                            <span className="small text-danger"></span>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input className="form-control" placeholder="example@gmail.com..."/>
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
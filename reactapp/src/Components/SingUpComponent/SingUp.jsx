import { useEffect, useState } from "react";
import styles from "./SingUp.module.css"
import ApiUrl from "../../Common/Url";
import { useNavigate } from "react-router-dom";

const formInitialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  }
export default function SingUp(){
    const[formValues,setFormValues] = useState(formInitialState)
    const navigate = useNavigate();

    var check = JSON.parse(localStorage.getItem('currentUser')); //IsUser
    if( check !== null) {
        navigate("/")
    } 

  async function SubmitForm(e) {
      e.preventDefault() 
    console.log(e.target)
    try {
        const response = await fetch(`${ApiUrl}/api/accounts/Register`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body: JSON.stringify(formValues), 
        });
    
        console.log("After fetch");
    
        if (response.status !== 201) {
          console.log(response.status);
          if(formValues.password !== formValues.confirmPassword) {
            alert("Passwords must match!")
          }
          else {
            alert("Validation error, please try again!")
          }
        } else {
          console.log("Registration successful");
          navigate("/login");
        }
      } catch (error) {
        if(error.name === "")
        if (error.name === 'AbortError') {
          console.error('Request timed out');
        } else {
          console.error('Error during registration:', error);
        }
      } 
  }
    const changeHandler = (e) => {
        let value = e.target.value;
        console.log(value);
        
        setFormValues(state => ({
          ...state,
          [e.target.name]: value,
        }));
    };

    return(
        <div className={styles.container}>
            
        
<section className="vh-100 gradient-custom">
    <div className='container py-5 h-100'>
        <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5" >
                <div className="card bg-dark text-white">
                    <form type="Post" onSubmit={SubmitForm}>
                        <div className="card-body p-5 text-center">

                            <div className="mb-md-5 mt-md-4 pb-5">

                                <h2 className="fw-bold mb-2 text-uppercase">Sign up</h2>
                                <p className="text-white-50 mb-5">Please enter your login and password and confirm passoword!</p>

                                 
                                <div className="form-outline form-white mb-4">
                                    <input type="username" id="username" name="username" className="form-control form-control-lg" aria-required="true" value={formValues.username} onChange={changeHandler} />
                                    <label htmlFor="username" className="form-label" for="typeEmailX">Username</label>
                                    <span className="text-danger"></span>
                                </div>

                                <div className="form-outline form-white mb-4">
                                    <input type="email" id="email" name="email" className="form-control form-control-lg" autocomplete="username" aria-required="true" value={formValues.email} onChange={changeHandler} />
                                    <label htmlFor="email" className="form-label" for="typeEmailX">Email</label>
                                    <span className="text-danger"></span>
                                </div>

                                <div className="form-outline form-white mb-4">
                                    <input type="password" id="password" name="password" className="form-control form-control-lg" autocomplete="current-password" aria-required="true" value={formValues.password} onChange={changeHandler} />
                                    <label htmlFor="password" className="form-label" for="typePasswordX">Password</label>
                                    <span className="text-danger"></span>
                                </div>
                                <div className ="form-outline form-white mb-4">
                                <input type="password" id="confirmPassword" name="confirmPassword" className="form-control form-control-lg" autocomplete="new-password" aria-required="true" value={formValues.confirmPassword} onChange={changeHandler}/>
                                <label htmlFor="confirmPassword" className="form-label" for="typePasswordX">Confirm password</label>
                                <span className="text-danger"></span>
                                </div>
                                
                                <button id="registerSubmit" className="btn btn-outline-light btn-lg px-5" type="submit">Sign up</button>
                              
                                <div className="d-flex justify-content-center text-center mt-4 pt-1">
                                    <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                                    <a href="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                                    <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                                </div>

                            </div>

                            <div>
                                <p className="mb-0">
                                    Do you have an account? <a href="/signin" className="text-white-50 fw-bold">Sign In</a>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
    </div>
</section>
</div>
    );
}
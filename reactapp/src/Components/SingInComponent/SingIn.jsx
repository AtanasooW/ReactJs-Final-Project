import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiUrl from "../../Common/Url";
import * as jwt from 'jwt-decode';
const formInitialState = {
    email: "",
    password: "",
}

export default function SingIn(){
    const[formValues,setFormValues] = useState(formInitialState)
    const navigate = useNavigate();

    var check = JSON.parse(localStorage.getItem('currentUser')); //IsUser
    if( check !== null) {
        navigate("/")
    } 

    async function SubmitForm(e) {
        e.preventDefault();

        const response = await fetch(`${ApiUrl}/api/accounts/Login`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body: JSON.stringify(formValues),
        });
        
        if (response.status === 200) {
          const data = await response.json();
          console.log("Login successful");
           
    
          // Save the token to localStorage
          localStorage.setItem('token', data.token);
          
          // Decode the token
          const decoded = jwt.jwtDecode(localStorage.getItem('token'))
          const currentuser = await fetch(`${ApiUrl}/api/accounts/GetUser?username=${decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/json'
            },
          }).then(response => response.json())
       
          console.log(currentuser);
        
          localStorage.setItem('currentUser', JSON.stringify(currentuser.user));
          localStorage.setItem('UserRole', JSON.stringify(currentuser.role));
          console.log(currentuser);
         
          // The decoded object will contain the claims in the JWT token
          console.log(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
    
          // You can access specific claims like this:
     
    
          // Redirect to the desired page
          navigate("/");
          window.location.reload(false);
        } else {
          console.log("Login failed");
          console.log(response.status);
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
<section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <div class="card bg-dark text-white">
                    <form type="Post" onSubmit={SubmitForm}>
                        <div class="card-body p-5 text-center">

                            <div class="mb-md-5 mt-md-4 pb-5">

                                <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                                <p class="text-white-50 mb-5">Please enter your login and password!</p>

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

                                <p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>


                                <button class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>

                                <div class="d-flex justify-content-center text-center mt-4 pt-1">
                                    <a href="#!" class="text-white"><i class="fab fa-facebook-f fa-lg"></i></a>
                                    <a href="#!" class="text-white"><i class="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                                    <a href="#!" class="text-white"><i class="fab fa-google fa-lg"></i></a>
                                </div>

                            </div>

                            <div>
                                <p class="mb-0">
                                    Don't have an account? <a href="/Identity/Account/Register" class="text-white-50 fw-bold">Sign Up</a>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
    );
}
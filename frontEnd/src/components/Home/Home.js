import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
 import logo from '../homepageImage.jpg';

class Home extends Component {
    //call the constructor method
    constructor(props) {
        // Call the constructor of Super class i.e The Component
        super(props);

        // maintain the state required for this component
        this.state = {
            profileInfo: [],
            selectedFile: '',
            selectedFile: '',
            images: '',
            foodName: '',
            nextPage: false,
            foodPic : null,
            recipe: false,
            lat: 0,
            long: 0
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.findRestaurants = this.findRestaurants.bind(this);
        this.findRecipe = this.findRecipe.bind(this);
        this.findRecipeSearch = this.findRecipeSearch.bind(this);
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
        this.findLocation = this.findLocation.bind(this);
        // Bind the handlers to this class
    }

    uploadFile = (e) => {
        e.preventDefault();
        document.getElementById('getFile').click();
    }
    async findRestaurants () {
        await this.findLocation();
        this.setState({
        nextPage: true
       });
    }
    async findLocation(){
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition((position)=>{
                console.log(position.coords.latitude);
                console.log(position.coords.longitude);
                localStorage.setItem('latitude', position.coords.latitude);
                localStorage.setItem('longitude', position.coords.longitude);
            });
        }
        else {
            alert("Denied Permission");
        }
    }
    async findRecipe () {
        this.setState({
            recipe: true
        });
    }
    async findRecipeSearch () {
        this.setState({
            recipe: true
        });
        localStorage.setItem("foodName", this.state.foodName);
    }

    async searchChangeHandler(e) {
        this.setState({
            foodName: e.target.value
        })
    }

    onChange = (async (e) => {
        if (e.target.name == 'selectedFile') {
            console.log(e.target.files);
            this.setState({
                selectedFile: e.target.files[0],
                foodPic: URL.createObjectURL(e.target.files[0])
            }, (async() => {
                const { selectedFile } = this.state;
                let formData = new FormData();
                formData.append('selectedFile', selectedFile);
                console.log("selectedFile file",this.state.selectedFile);
               
                console.log("image file",formData);
                axios.defaults.withCredentials = true;
                await axios.post('http://localhost:3001/upload_file', formData)
                .then(async (result) => {
                  // access results...
                  this.handleSubmit();
                });
            }))
        }
    })

     async handleSubmit() {
         console.log("on submit");
         await axios.post('http://localhost:3001/recognizeImage')
            .then(response => {
                 this.setState ({
                     foodName: response.data
                 });
                 localStorage.setItem("foodName", response.data);
            });
    }

   

    render = () => {
        let redirectVar = null;
        let foodPicImage = null;
        const { description, selectedFile } = this.state;
        if(this.state.foodName.length) {
        }
        if (this.state.nextPage) {
            redirectVar = <Redirect to= "/NearbyRestaurants"/>
        }
        else if(this.state.recipe){
            redirectVar = <Redirect to= "/RecipePage"/>
        }
        else {
            if(this.state.foodPic != null && this.state.foodName.length) {
                foodPicImage = 
                <div>
                <span className = "imageBackground">
                    <img className="float-left" src = {this.state.foodPic} width="200" height="200"/>
                    <h3 className="float-left mt-10">&nbsp;&nbsp;&nbsp;&nbsp;{this.state.foodName}</h3>
                </span>
                <button type="button"  onClick={this.findRestaurants} className="btn btn-primary mt-5">Find Restaurants that Serve this Dish</button>
                <button type="button"  onClick={this.findRecipe} className="btn btn-success mt-5" id="cookYourself">Cook it Yourself!</button>
                </div>
            }
            // else {
            //     foodPicImage =
            //         <div>
            //             <span className="imageBackground">
            //                 {/* <img className="float-left" src={this.state.foodPic} width="200" height="200" /> */}
            //                 <h3 className="float-left mt-10">&nbsp;&nbsp;&nbsp;&nbsp;Sorry! If You're Sure This is a Food Item, Shoot us an Email and we'll Fix it ASAP</h3>
            //             </span>
            //             <button type="button" onClick={this.findRestaurants} className="btn btn-primary mt-5">Find Restaurants that Serve this Dish</button>
            //             <button type="button" onClick={this.findRecipe} className="btn btn-success mt-5" id="cookYourself">Cook it Yourself!</button>
            //         </div> 
            // }
            console.log(foodPicImage);
            redirectVar =  <div class="container">
                <div className="navbar navbar-dark bg-primary mb-0 container sticky-top">

        <div class="navbar-header sticky-top">
            <button type="button" data-target="#navbarCollapse" data-toggle="collapse" class="navbar-toggle">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a href="#" class="navbar-brand" id="navText">SeeFood</a>
        </div>
                    <div id="navbarCollapse" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                    <li class="active"><a href="#" id="navText">Home</a></li>
                {/* <li><a href="#">Profile</a></li>
                <li class="dropdown">
                    <a data-toggle="dropdown" class="dropdown-toggle" href="#">Messages <b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <li><a href="#">Inbox</a></li>
                        <li><a href="#">Drafts</a></li>
                        <li><a href="#">Sent Items</a></li>
                        <li class="divider"></li>
                        <li><a href="#">Trash</a></li>
                    </ul>
                </li> */}
            </ul>
            <form class="navbar-form navbar-left" onSubmit={this.findRecipeSearch}>
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search Recipes" onChange={this.searchChangeHandler}/>
                    <span class="input-group-btn">
                        <button type="button" class="btn btn-default"><span class="glyphicon glyphicon-search"></span></button>
                    </span>
                </div>
            </form>
        </div>
    </div>
            <div className="bodyContainer">
                <div className="background-image">
                     {/* <img src = {this.props.profile.profilePic} height="50" className="profileimage"/> */}
                     {/* <div className="pt-15"><input type="text" onChange = {this.searchChangeHandler} className="col-xs-3 ml-25" placeholder="Where do you want to go?"/></div> */}
                     <div className="">
                        
                        <input  id="getFile" name="file" type="file" name="selectedFile" className = "hide" onChange={this.onChange} multiple/>
                            <div className="pageTitle">
                                <h1>Like What You See? </h1>
                                <h1>Don't Know What It Is?</h1>
                                <h3>Upload An Image to find out!</h3>
                            </div>
                        <button type="submit" onClick={this.uploadFile} className="btn btn-primary mt-20">Upload</button>
                    </div>
                    
                </div>
                <br/>
                <div className="box2">
                {foodPicImage}
                
                </div>
            </div>
                </div>;
        }
        return(
            <div>
                {redirectVar}
            </div>
           
        )
    }
}

export default Home;

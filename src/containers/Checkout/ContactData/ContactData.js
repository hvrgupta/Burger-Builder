import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';


class ContactData extends Component{
    state = {
        name: '',
        email: '',
        address: {
            street:'',
            postalCode:''
        },
        loading: false 
    }

    orderHandler = (event) => {
    event.preventDefault();
      this.setState({loading: true});
      const order = {
        ingredients:this.props.ingredients,
        price:this.props.price,
        customer:{
          name:'Harsh Gupta',
          address:{
            street:'PY Rd',
            zipCode:'45201',
            country:'India'
          },
          email:'test@test.com'
        },
        deliveryMethod:'Fastest'
      }
      axios.post('/orders.json',order)
      .then(response => {
        this.setState({loading:false});
        this.props.history.push('/');
      })
      .catch(error => {
        this.setState({loading:false})
      });
    }

    render(){
        let form = (
        <form>
            <input type="text" name="name" placeholder="Your Name" />
            <input type="email" name="email" placeholder="Your Email" />
            <input type="text" name="street" placeholder="Street" />
            <input type="text" name="postal" placeholder="Pincode" />
            <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
        </form>);

        if(this.state.loading){
            form = <Spinner />
        }
        return(
            <div className={classes.ContactData}>
                {console.log('contact',this.props)}
                <h4>Enter your Contact Details</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;
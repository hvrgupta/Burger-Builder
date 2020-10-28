import React, { Component } from 'react';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
    
    render(){
        const ingredientSummary = Object.keys(this.props.ingredients).map((igKey) => {
            return (<li key={igKey}>
            <span style={{textTransform:"capitalize"}}>{igKey}</span>:{this.props.ingredients[igKey]}
            </li>);
        });
        return(<Auxiliary>
            <h3>Your Order</h3>
            <p>A Delecious Burger with following Ingredients</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: {this.props.price}</strong></p>
            <p>Continue to Checkout?</p>
            <Button btnType="Danger" clicked={this.props.purchaseCanceled}>CANCEL</Button>
            <Button btnType="Success"clicked={this.props.purchaseContinue}>CONTINUE</Button>
        </Auxiliary>);
    } 
}

export default OrderSummary;
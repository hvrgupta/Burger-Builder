import React, {Component} from 'react';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component{
  
  // constructor(props){
  //   super(props);
  //   this.state = {...}
  // }
  state = {
    purchasing: false,
    loading: false,
    error:false
  }

  componentDidMount(){
    // console.log('props',this.props);

    // axios.get('ingredients.json')
    // .then(response => {
    //   this.setState({ingredients:response.data})
    // }).catch(error => this.setState({error:true}));
  }
  purchaseHandler = () => {
    this.setState({
      purchasing:true
    })
  }
  updatePurchaseState = (ingredients) => {
     const sum = Object.keys(ingredients).map(igKey => {
       return ingredients[igKey];
     }).reduce((sum,el) => {
        return sum + el;
     },0);
     return sum>0;
  }

  // addIngredientHandler = (type) => {
  //   const oldCount = this.state.ingredients[type];
  //   const updatedCount = oldCount + 1;
  //   const updatedIngredients = {...this.state.ingredients};
  //   updatedIngredients[type] = updatedCount;
  //   const priceAddition = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice + priceAddition;
  //   this.setState({
  //     ingredients : updatedIngredients,
  //     totalPrice : newPrice
  //   })
  //   this.updatePurchaseState(updatedIngredients);
  // }

  // removeIngredientHandler = (type) => {
  //   const oldCount = this.state.ingredients[type];
  //   if(oldCount <=0){
  //     return;
  //   }
  //   const updatedCount = oldCount - 1;
  //   const updatedIngredients = {...this.state.ingredients};
  //   updatedIngredients[type] = updatedCount;
  //   const priceDeduction = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice - priceDeduction;
  //   this.setState({
  //     ingredients : updatedIngredients,
  //     totalPrice : newPrice
  //   })
  //   this.updatePurchaseState(updatedIngredients);
  // }

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false,
    })
  }

  purchaseContinueHandler = () => {
      this.props.history.push('/checkout');
  }

  render(){
    const disabledInfo = {...this.props.ings};
    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    if(this.props.ings){
    orderSummary = <OrderSummary ingredients={this.props.ings} 
    purchaseCanceled={this.purchaseCancelHandler}
    purchaseContinue={this.purchaseContinueHandler}
    price={this.props.totalPrice.toFixed(2)}/>; 
    } 
    if(this.state.loading){
      orderSummary = <Spinner />
    }
    let burger = this.state.error ? <p>Ingredients can't be loaded</p>:<Spinner />
    
    if(this.props.ings){
    burger = (<Auxiliary><Burger ingredients={this.props.ings}/>
      <BuildControls 
      ingredientAdded={this.props.onIngredientAdded}
      ingredientRemoved={this.props.onIngredientRemoved}
      disabled={disabledInfo}
      purchasable={this.updatePurchaseState(this.props.ings)}
      price={this.props.totalPrice}
      ordered={this.purchaseHandler}/>
      </Auxiliary>);
    }
    return(
          <Auxiliary>
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
              {orderSummary}
            </Modal>
              {burger}
          </Auxiliary>        
        );
    }
}

const mapStateToProps = state => {
  return{
    ings: state.ingredients,
    totalPrice: state.totalPrice
  };
}

const mapDispatchToProps = dispatch => {
  return{
    onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
    onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(WithErrorHandler(BurgerBuilder,axios));

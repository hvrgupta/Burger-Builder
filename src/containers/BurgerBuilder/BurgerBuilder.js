import React, {Component} from 'react';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad : 0.5,
  cheese : 0.4,
  meat : 1.3,
  bacon : 0.7
}

class BurgerBuilder extends Component{
  
  // constructor(props){
  //   super(props);
  //   this.state = {...}
  // }
  state = {
    ingredients:null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error:false
  }

  componentDidMount(){
    console.log('props',this.props);
    axios.get('ingredients.json')
    .then(response => {
      this.setState({ingredients:response.data})
    }).catch(error => this.setState({error:true}));
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
     this.setState({
       purchasable: sum>0
     })
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {...this.state.ingredients};
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({
      ingredients : updatedIngredients,
      totalPrice : newPrice
    })
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <=0){
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {...this.state.ingredients};
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({
      ingredients : updatedIngredients,
      totalPrice : newPrice
    })
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false,
    })
  }

  purchaseContinueHandler = () => {
     
      const queryParams = [];

      for(let i in this.state.ingredients){
        queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
      }
      queryParams.push('price=' + this.state.totalPrice);
      const queryString = queryParams.join('&');
      this.props.history.push({
        pathname: '/checkout',
        search: '?' + queryString 
      });
  }

  render(){
    const disabledInfo = {...this.state.ingredients};
    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    if(this.state.ingredients){
    orderSummary = <OrderSummary ingredients={this.state.ingredients} 
    purchaseCanceled={this.purchaseCancelHandler}
    purchaseContinue={this.purchaseContinueHandler}
    price={this.state.totalPrice.toFixed(2)}/>; 
    } 
    if(this.state.loading){
      orderSummary = <Spinner />
    }
    let burger = this.state.error ? <p>Ingredients can't be loaded</p>:<Spinner />
    
    if(this.state.ingredients){
      burger = (<Auxiliary><Burger ingredients={this.state.ingredients}/>
    <BuildControls 
    ingredientAdded={this.addIngredientHandler}
    ingredientRemoved={this.removeIngredientHandler}
    disabled={disabledInfo}
    purchasable={this.state.purchasable}
    price={this.state.totalPrice}
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

export default WithErrorHandler(BurgerBuilder,axios);

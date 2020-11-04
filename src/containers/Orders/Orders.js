import React, {Component} from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component{
    state = {
        orders: [],
        loading:true
    }

    componentDidMount(){
        axios.get('/orders.json')
        .then(response => {
            // console.log(response.data);
            this.setState({loading:false,
            orders: Object.values(response.data)})
        }).catch(error => this.setState({loading:false}));
    }
    render(){
        let order;
        if(this.state.loading){
            order = <Spinner />
        }else{
            order = (this.state.orders.map((order) => {
                return <Order key={Math.random()} ingredients={order['ingredients']} 
                price={order['price']}  />
            }));
        }
        return(
            <div>
               {order}
            </div>
        );
    }
}

export default Orders;
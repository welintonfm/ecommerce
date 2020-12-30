import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import stripeConfig from '../config/stripe';

const stripePromise = loadStripe(stripeConfig.publicKey);

const CheckoutButton: React.FC = () =>{
    const handleClick = async (event) => {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            items: [
                {sku: 'sku_123', quantity: 1}
            ],
            successUrl: 'https://example.com/sucess',
            cancelUrl: 'https://example.com/cancel',
        });
    };

    return (
        <button role='link' onClick={handleClick}>
            Comprar
        </button>
    );
    
}

export default CheckoutButton;
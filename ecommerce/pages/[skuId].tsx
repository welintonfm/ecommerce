import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import Stripe from 'stripe';
import stripeConfig from '../config/stripe'
import Link from 'next/link'
import Router from 'next/router'
import { privateEncrypt } from 'crypto';

interface Props {
    sku: Stripe.Product;
    price: Stripe.Price[];
}

export const getStaticPaths: GetStaticPaths = async () => {
    const stripe = new Stripe(stripeConfig.secretKey,  {
        apiVersion: '2020-08-27'
    });

    const skus = await stripe.products.list();

    const paths = skus.data.map((sku) => ({
        params: {
            skuId: sku.id,
        },
    }));

    console.log(skus.data);

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const stripe = new Stripe(stripeConfig.secretKey,  {
        apiVersion: '2020-08-27'
    });

    const { skuId } = params;
    
    const sku = await stripe.products.retrieve(params.skuId as string);
    const price = await stripe.prices.list();

    return {
        props: {
            sku: sku,
            price: price.data
        },
    }
}

const Product: React.FC<Props> = ({ sku, price }) => {
    const stripe = new Stripe(stripeConfig.secretKey,  {
        apiVersion: '2020-08-27'
    });
    let productPrice;

    return (
        <div>
            <h1>{sku.name}</h1>

            {sku.images[0] && <img 
                src={sku.images[0]}
                style={{
                    width: '100px'
                }}
            />}

            {price.forEach(element => {
                if (element.product === sku.id) productPrice = element.unit_amount;
            })}
            
            <h2>R$ {Number(productPrice/100).toFixed(2)}</h2>

            <Link href='/'>Voltar</Link>
        </div>
    )
}

export default Product;

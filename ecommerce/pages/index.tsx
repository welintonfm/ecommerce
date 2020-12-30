import Head from 'next/head'
import Stripe from 'stripe';
import styles from '../styles/Home.module.css'
import { GetStaticPaths, GetStaticProps } from 'next';
import stripeConfig from '../config/stripe'
import Link from 'next/link'
import stripe from '../config/stripe';

interface Props {
  skus: Stripe.Product[];
  price: Stripe.Price[];
}

export const getStaticProps: GetStaticProps = async () => {
  const stripe = new Stripe(stripeConfig.secretKey,  {
      apiVersion: '2020-08-27'
  });

  const skus = await stripe.products.list();
  const price = await stripe.prices.list();
  console.log(price);

  const paths = skus.data.map(sku => ({
      params: {
          skuId: sku.id,
      },
  }))

  return {
      props: {
        skus: skus.data,
        price: price.data
      }
  }
}

const HomePage: React.FC<Props> = ({ skus, price }) => {
  const stripe = new Stripe(stripeConfig.secretKey,  {
    apiVersion: '2020-08-27'
  });

  let productPrice;
  
  return (
    <>
      <h1></h1>

      {skus.map(sku => (
        <div key={sku.id}>
          {price.forEach(element => {
            if (element.product === sku.id) productPrice = element.unit_amount;
          })}
          <h1>{sku.name}</h1>

          {sku.images && <img 
              src={sku.images[0]}
              style={{
                  width: '100px'
              }}
          />}
          
          <h2>R$ {Number(productPrice/100).toFixed(2)}</h2>

          <Link href={'/' + sku.id}>Comprar</Link>
          <hr/>
        </div>
      ))}
    </>
  );
}

export default HomePage;
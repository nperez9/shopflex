'use client'
import { useRef } from 'react';
import styles from './CartDrawer.module.scss'
import classNames from "classnames";
import { IoCloseOutline } from "react-icons/io5";
import ButtonPrimary from '@/components/shared/ButtonPrimary';
import Curve from '../Curve/index';
import Title from '@/components/shared/Title'
import { CartStore, useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Counter from './Counter/index';
import { AiOutlineLock } from "react-icons/ai";
import { getImage } from '@/services/products';
import { FiTrash2 } from "react-icons/fi";
import gsap from 'gsap';
import { FreeShipping } from './FreeShipping';

type CartDrawerProps = {
    isCartOpen: boolean
    toggleCart: () => void
}


export default function CartDrawer({isCartOpen, toggleCart}:CartDrawerProps) {
  const { products, totals } = useCartStore((state:CartStore) => ({
    products: state.products,
    totals: state.totals
  }))
  const containerRef = useRef<HTMLDivElement | null>(null);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { updateQuantity, remove } = useCartStore();

  const handleRemoveProduct = (productId: number, index: number) => {
    const productElement = productRefs.current[index];
    if (productElement) {
      gsap.to(productElement, {
        opacity: 0,
        x: 100,
        duration: 0.3,
        height: 0,
        ease: "hop",
        onComplete: () => {
          remove(productId);
        },
      });
    }
  };
  
  return (
    <div className={classNames("h-[100vh] w-[31.5vw] fixed top-0 z-[999999]",[styles.drawer], {[styles.active]: isCartOpen})}>
      <Curve active={isCartOpen}/>
        <div className={classNames("bg-white z-10 top-0 flex flex-col",[styles.content], {[styles.active]: isCartOpen})}>
          <div className={classNames("absolute right-5 top-5", [styles.closeButton])} onClick={() => toggleCart()}>
            <ButtonPrimary text={<IoCloseOutline className='text-[20px]'/>} variant='outlined' size='small'/>
          </div>
          <div className={classNames('p-6',[styles.header])}>
            <Title text='Your bag'/>
            <span className='text-standar-darker px-2'><b>{totals.quantity}</b>{` ${totals.quantity <= 1 ? 'item' : 'items'}`}</span>
          </div>
          <div className='px-6 py-3 border-t border-b border-[#cdcdcd]'>
            <FreeShipping totalPrice={totals.price} />
          </div>
          <div 
            className={classNames('px-6 py-3 flex flex-col overflow-y-auto overflow-x-hidden', [styles.containerProds])}
            ref={containerRef}
          >
            {products.length === 0 && <p className='text-standar-darker flex justify-center h-full items-center'>Your Cart is Empty</p>}
            {products.map((prod, index) => (
              <div
                key={prod.id}
                ref={(el) => { productRefs.current[index] = el; }}
                className={classNames('px-3 gap-3 mb-4', [styles.product])}
              >
                <div className={classNames([styles.imageContainer], 'mt-4 mb-4')}>
                  <Image
                    src={getImage(prod.image)}
                    width={500}
                    height={500}
                    objectFit="none"
                    alt='clothes'
                  />
                </div>
                <div className='w-3/4 flex flex-col justify-around relative mt-4 mb-4'>
                  <p className='text-standar-darker font-bold mb-2 text-sm'>{prod.title}</p>
                  <p className='text-standar-darker mb-2 text-sm'>USD {prod.price}</p>
                  <div>
                    <div className={styles.productCounter}>
                      <button onClick={() => updateQuantity(prod.id, false)}>-</button>
                      <Counter number={prod.quantity} />
                      <button onClick={() => updateQuantity(prod.id, true)}>+</button>
                    </div>
                  </div>
                  <button className='text-standar-darker absolute top-0 right-0' onClick={() => handleRemoveProduct(prod.id, index)}>
                    <FiTrash2 className='text-[16px] text-black' />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {products.length > 0 && (
            <div className='bg-black p-6 absolute bottom-0 right-0 w-full' >
              <div className='flex justify-between w-full mb-2'>
                <h3 className='text-white text-3xl'>
                  Total
                </h3>
                <h3 className='text-white text-2xl'>
                  <b>{totals.price}usd</b>
                </h3>
              </div>
              <span className='text-white'>Shipping calculated at checkout</span>
              <div className='mt-3'>
                <ButtonPrimary 
                    action={() => console.log()} 
                    theme='light' 
                    variant='lessRounded' 
                    size='full'
                    text={
                      <span className={'flex relative'}>Checkout<AiOutlineLock className='text-[20px] ml-2'/></span>
                    } 
                  />

              </div>
            </div>
          )}
        </div>
    </div>
  );
}

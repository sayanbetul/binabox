"use client";

import { useState } from 'react';
import Link from "next/link";
import { TypeAnimation } from 'react-type-animation';
import { Swiper, SwiperSlide } from "swiper/react";
import CounterUp from "../elements/CounterUp";
const swiperOptions = {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
};

export default function Slider1() {
    const [birthdate, setBirthdate] = useState('');

    const handleMint = () => {
        if (!birthdate) {
            alert('Please enter your birthdate!');
            return;
        }

        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then(() => {
                // Burada NFT minting işlemi gerçekleştirilir
                alert(`NFT minting started for birthdate: ${birthdate}`);
            });
        } else {
            alert('MetaMask is not installed!');
        }
    };

    return (
        <>
            <section className="tf-slider home3">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="swiper-container slider-home ">
                                <Swiper {...swiperOptions} className="swiper-wrapper">
                                    <SwiperSlide>
                                        <div className="slider-item">
                                            <div className="tf-slider-item style-3">
                                                <div className="content-inner">
                                                    <h1 className="heading mb0" style={{ color: '#000' }}> Discover 
                                                        <span className="animationtext clip">
                                                            <TypeAnimation
                                                                sequence={[
                                                                    ' THETA',
                                                                    1000,
                                                                    ' NFT',
                                                                    1000,
                                                                    ' COLLECTION',
                                                                    1000,
                                                                ]}
                                                                wrapper="span"
                                                                speed={50}
                                                                style={{ display: 'inline-block', marginLeft: "15px" }}
                                                                repeat={Infinity}
                                                                className="cd-words-wrapper ms-3">
                                                            </TypeAnimation>
                                                        </span>
                                                    </h1>
                                                    <h1 className="heading" style={{ color: '#000' }}> Your Celestial Identity!</h1>
                                                    <p className="sub-heading" style={{ color: '#000' }}>ASTROLOGY NFT</p>
                                                    <div className="counter-wrap">
                                                        <div className="tf-counter">
                                                            <div className="content">
                                                                <CounterUp count={2240} style={{ color: '#000' }} />+
                                                            </div>
                                                            <h6 style={{ color: '#000' }}>Total Items</h6>
                                                        </div>
                                                        <div className="tf-counter">
                                                            <div className="content">
                                                                <CounterUp count={1000} style={{ color: '#000' }} />+
                                                            </div>
                                                            <h6 style={{ color: '#000' }}>Profiles Whitelisted</h6>
                                                        </div>
                                                    </div>
                                                    <div className="btn-slider ">
                                                        <div className="birthdate-form">
                                                            <input 
                                                                type="date" 
                                                                value={birthdate}
                                                                onChange={(e) => setBirthdate(e.target.value)}
                                                                className="birthdate-input"
                                                                style={{ padding: '10px', marginBottom: '10px' }}
                                                            />
                                                            <button 
                                                                className="tf-button"
                                                                onClick={handleMint}
                                                                style={{ display: 'block' }}
                                                            >
                                                                MINT NFT
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="image">
                                                    <img src="/assets/images/slider/slider-8.png" alt="Image" className="img ani5" />
                                                    <img src="/assets/images/slider/slider-7.png" alt="Image" className="ani4 img-1" />
                                                    <img src="/assets/images/slider/slider-6.png" alt="Image" className="ani5 img-2" />
                                                </div>
                                            </div>
                                        </div>{/* item */}
                                    </SwiperSlide>
                                    {/* Diğer SwiperSlide öğelerini buraya ekleyin */}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

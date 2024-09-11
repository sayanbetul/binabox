"use client";
import { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Swiper, SwiperSlide } from "swiper/react";
import CounterUp from "../elements/CounterUp";
import { ethers } from 'ethers';

import TOKEN_ABI from '../../contract/ThetaCollectibles.json'; // Yolu proje yapınıza göre ayarlayın
import config from '../../contract/config.json'; // Yolu proje yapınıza göre ayarlayın

const swiperOptions = {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
};

export default function Slider1() {
    const [birthdate, setBirthdate] = useState('');
    const [status, setStatus] = useState('');
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            try {
                const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(web3Provider);

                window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
                    console.log('Connected account:', accounts[0]);
                }).catch((err) => {
                    console.error("Error requesting accounts:", err);
                });
            } catch (err) {
                console.error("Error initializing Web3Provider:", err);
            }
        } else {
            console.error('MetaMask is not installed!');
            alert('Please install MetaMask!');
        }
    }, []);

    const handleMint = async () => {
        if (!birthdate) {
            alert('Please enter your birthdate!');
            return;
        }

        if (!window.ethereum) {
            alert('MetaMask is not installed!');
            window.location.href = 'https://metamask.io/download.html';
            return;
        }

        try {
            if (!provider) {
                alert('Provider not initialized!');
                return;
            }

            const signer = provider.getSigner();
            const contract = new ethers.Contract(config.contractAddress, TOKEN_ABI.abi, signer);

            // Mint işlemi için ücret (0.001 ETH)
            const mintPrice = ethers.parseEther("0.001");

            // Sözleşmeden mintTheta fonksiyonunu çağır
            const tx = await contract.mintTheta({ value: mintPrice });
            setStatus("Transaction sent: " + tx.hash);
            await tx.wait();
            setStatus("Minting completed!");

        } catch (error) {
            console.error("Minting error:", error);
            setStatus("Error: " + error.message);
        }
    };

    return (
        <section className="tf-slider home3">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="swiper-container slider-home">
                            <Swiper {...swiperOptions} className="swiper-wrapper">
                                <SwiperSlide>
                                    <div className="slider-item">
                                        <div className="tf-slider-item style-3">
                                            <div className="content-inner">
                                                <h1 className="heading mb0" style={{ color: '#000' }}>
                                                    Discover
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
                                                            style={{ display: 'inline-block', marginLeft: '15px' }}
                                                            repeat={Infinity}
                                                            className="cd-words-wrapper ms-3"
                                                        />
                                                    </span>
                                                </h1>
                                                <h1 className="heading" style={{ color: '#000' }}>Your Celestial Identity!</h1>
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
                                                <div className="btn-slider">
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
                                    </div>
                                </SwiperSlide>
                                {/* Diğer SwiperSlide öğelerini buraya ekleyin */}
                            </Swiper>
                        </div>
                    </div>
                </div>
                <p className="text-center">{status}</p>
            </div>
        </section>
    );
}

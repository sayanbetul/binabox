'use client'
import { useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { Swiper, SwiperSlide } from "swiper/react"
import CounterUp from "../elements/CounterUp"
import TOKEN_ABI from '../../contract/ThetaCollectibles.json'; // Yolu proje yapınıza göre ayarlayın
import config from '../../contract/config.json';
import { ethers } from 'ethers';
const swiperOptions = {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
}

export default function Slider1() {
    const [connected, setConnected] = useState(false);
    const [birthdate, setBirthdate] = useState('');
    const [minting, setMinting] = useState(false);
    const [status, setStatus] = useState(false);


    
    const handleConnect = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setConnected(true);
                alert('Wallet connected successfully!');
            } catch (error) {
                console.error('Error connecting wallet:', error);
                alert('Error connecting wallet.');
            }
        } else {
            alert('MetaMask is not installed!');
        }
    };
    const handleMint = async () => {
        if (!window.ethereum) {
          alert("Please install MetaMask.");
          window.location.href = 'https://metamask.io/download.html';
          return;
        }
    
        if (!birthdate) {
          alert("Please enter your birthdate.");
          return;
        }
    
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
    
        try {
          const contractAddress = config.contractAddress;
          const contract = new ethers.Contract(contractAddress, TOKEN_ABI.abi, signer);
          // setContract(contract); // Save the contract instance to state
         
          const mintPrice = ethers.utils.parseEther("0.0011");
          console.log(mintPrice);
          const stringToConvert = "https://brown-impressive-ptarmigan-546.mypinata.cloud/ipfs/QmVQMZmoffk1FMvipFZWiUD7aG9buvoGNMEUHQ5BMLejYk";
          const bytes32Hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(stringToConvert));
    
          await contract.getMinterRole();
    
          const tx = await contract.mintTheta(bytes32Hash, bytes32Hash, { value: mintPrice});
          setStatus("Transaction sent: " + tx.hash);
          console.log("Transaction sent: ", tx.hash);
          await tx.wait();
          setStatus("Minting completed!");
          console.log("Minting completed!");
        
          const response = await fetch(`https://brown-impressive-ptarmigan-546.mypinata.cloud/ipfs/QmW6m9KWUe84zZkyWMrXBDfJXSyWPsfd3VEA8qLJ3gGu2J`);
          const metadata = await response.json();
          setNftImage(metadata.image); // Extract image URL from metadata
        } catch (error) {
          console.error(error);
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
                                                <h1 className="heading mb0">WITH
                                                    <span className="animationtext clip">
                                                        <TypeAnimation
                                                            sequence={[
                                                                ' THETA',
                                                                1000,
                                                                ' NFTBOX',
                                                                1000,
                                                                ' BOXNFT',
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
                                                <h1 className="heading">EXPLORE NFT COLLECTION</h1>
                                                <p className="sub-heading">We are the best way to check the rarity of NFT collection</p>
                                                <div className="counter-wrap">
                                                    <div className="tf-counter">
                                                        <div className="content">
                                                            <CounterUp count={2240} />+
                                                        </div>
                                                        <h6>Total Items</h6>
                                                    </div>
                                                    <div className="tf-counter">
                                                        <div className="content">
                                                            <CounterUp count={1000} />+
                                                        </div>
                                                        <h6>Profiles Whitelisted</h6>
                                                    </div>
                                                </div>
                                                <div className="btn-slider">
                                                    {!connected ? (
                                                        <button className="tf-button" onClick={handleConnect}>
                                                            CONNECT WALLET
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <div className="mint-form">
                                                                <input
                                                                    type="date"
                                                                    value={birthdate}
                                                                    onChange={(e) => setBirthdate(e.target.value)}
                                                                    placeholder="Enter your birthdate"
                                                                />
                                                                <button
                                                                    className="tf-button"
                                                                    onClick={handleMint}
                                                                    disabled={minting}
                                                                >
                                                                    {minting ? 'MINTING...' : 'MINT NFT'}
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="image">
                                                <img src="/assets/images/slider/slider-8.png" alt="Image" className="img ani5" />
                                                <img src="/assets/images/slider/slider-7.png" alt="Image" className="ani4 img-1" />
                                                <img src="/assets/images/slider/slider-6.png" alt="Image" className="ani5 img-2" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Diğer SwiperSlide öğelerini buraya ekleyin */}
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

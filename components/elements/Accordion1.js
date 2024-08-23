'use client'
import { useState } from 'react'
export default function Accordion1() {
    const [isActive, setIsActive] = useState(1)

    const handleClick = (key) => {
        setIsActive(prevState => prevState === key ? null : key)
    }
    return (
        <>
            <div className="tf-flat-accordion2">
                <div className="flat-toggle2 active">
                    <h6  className={isActive === 1 ? "toggle-title active" : "toggle-title"} onClick={() => handleClick(1)}>What are the NFTs?</h6>
                    <div className="toggle-content" style={{ display: `${isActive === 1 ? "block" : "none"}` }}>
                        <p>Welcome to Theta Collectibles – where your astrological data transforms into a one-of-a-kind digital treasure! Each NFT encapsulates your unique astrological profile, representing:




                        </p>
                    </div>
                </div>
                <div className="flat-toggle2">
                    <h6  className={isActive === 2 ? "toggle-title active" : "toggle-title"} onClick={() => handleClick(2)}>How do i get NFTs?</h6>
                    <div className="toggle-content" style={{ display: `${isActive === 2 ? "block" : "none"}` }}>
                        <p>🌟 Your Birth Chart: An exclusive snapshot of the stars at the moment you were born.
                        🪐 Celestial Influences: The 8 ruling planets and their alignment in your personal astrological journey.
                        🔮 Astrological Outcomes: The 12 signs and their impact on your destiny.
                        </p>
                    </div>
                </div>
                <div className="flat-toggle2">
                    <h6  className={isActive === 3 ? "toggle-title active" : "toggle-title"} onClick={() => handleClick(3)}>How we can buy and invest NFT ?</h6>
                    <div className="toggle-content" style={{ display: `${isActive === 3 ? "block" : "none"}` }}>
                        <p>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

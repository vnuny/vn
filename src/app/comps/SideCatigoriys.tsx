"use client";
import React, { useState } from "react";
import '../css/sideCati.css';

export default function SideCatigoriys({ onSelectCategory }:any) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sliderHeight, setSliderHeight] = useState('65px');

    const handleClick = (event:any) => {
        const innerText = event.target.innerText;
        setSelectedCategory(innerText);
        switch (innerText) {
            case 'Movies':
                setSliderHeight('66px');
                break;
            case 'Series':
                setSliderHeight('105px');
                break;
            case 'Animes':
                setSliderHeight('146px');
                break;
            case 'Action':
                setSliderHeight('186px');
                break;
            case 'Adventure':
                setSliderHeight('226px');
                break;
            case 'Fantasy':
                setSliderHeight('266px');
                break;
            default:
                setSliderHeight('65px');
        }
        onSelectCategory && onSelectCategory(innerText);
    };

    return (
        <div className="sideCatigoriys">
            <div className="sideCategoriesBox">
                <div className="slider" style={{ top: sliderHeight }}></div>
                <h3>Categories</h3>
                    <li onClick={handleClick}>Movies <i className="fa-solid fa-camera-movie"></i></li>
                    <li onClick={handleClick}>Series <i className="fa-solid fa-tv-retro"></i></li>
                    <li onClick={handleClick}>Animes <i className="fa-solid fa-otter"></i></li>
                    <li onClick={handleClick}>Action <i className="fa-solid fa-gun"></i></li>
                    <li onClick={handleClick}>Adventure <i className="fa-solid fa-tree-palm"></i></li>
                    <li onClick={handleClick}>Fantasy <i className="fa-solid fa-alien"></i></li>
            </div>
        </div>
    );
}

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./comps/Header";
import Main from "./comps/Main";
import SideCatigoriys from "./comps/SideCatigoriys";
import "./css/main.css";
import Footer from "./comps/Footer";

export default function App() {
    const [searchValue, setSearchValue] = useState<string>('');
    const [movies, setMovies] = useState<any[]>([]);
    const [moviesHeader, setMoviesHeader] = useState<string>('');
    const [catiLoading, setCatiLoading] = useState<boolean>(true);
    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('/api/homeMovies');
                await setMovies(response.data.data);
                setMoviesHeader('Popular Movies');
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchMovies();
    }, [])
    const handleCategorySelect = async (selectedCategory: string) => {
        setCatiLoading(true);
        if (selectedCategory === 'Movies') {
            try {
                const response = await axios.get('/api/homeMovies');
                await setMovies(response.data.data);
                setMoviesHeader('Popular Movies');
            } catch (error) {
                console.error("Error fetching movies:", error);
            }finally {
                setCatiLoading(false);
            }
        }else if(selectedCategory === 'Action') {
            try {
                const response = await axios.get('/api/actionmovies');
                await setMovies(response.data.data);
                setMoviesHeader('Action');
            } catch (error) {
                console.error("Error fetching movies:", error);
            }finally {
                setCatiLoading(false);
            }
        }else if(selectedCategory === 'Animes') {
            try {
                const response = await axios.get('/api/anime');
                await setMovies(response.data.data);
                setMoviesHeader('Anime');
            } catch (error) {
                console.error("Error fetching movies:", error);
            }finally {
                setCatiLoading(false);
            }
        }else if(selectedCategory === 'Series') {
            try {
                const response = await axios.get('/api/seriescati');
                await setMovies(response.data.data);
                setMoviesHeader('Series');
            } catch (error) {
                console.error("Error fetching movies:", error);
            }finally {
                setCatiLoading(false);
            }
        }else if(selectedCategory === 'Fantasy') {
            try {
                const response = await axios.get('/api/fantasy');
                await setMovies(response.data.data);
                setMoviesHeader('Fantasy');
            } catch (error) {
                console.error("Error fetching movies:", error);
            }finally {
                setCatiLoading(false);
            }
        }else if(selectedCategory === 'Adventure') {
            try {
                const response = await axios.get('/api/adventure');
                await setMovies(response.data.data);
                setMoviesHeader('Adventure');
            } catch (error) {
                console.error("Error fetching movies:", error);
            }finally {
                setCatiLoading(false);
            }
        }
    };
    
    return (
        <div>
            <div className="glow"></div>
            <Header onSearchChange={handleSearchChange} />
            <div className="Mainapp">
                <div className="app">
                    <SideCatigoriys onSelectCategory={handleCategorySelect} />
                    <Main movies={movies} moviesHeader={moviesHeader} loadingState={catiLoading}/>
                </div>
            </div>
        </div>
    );
}

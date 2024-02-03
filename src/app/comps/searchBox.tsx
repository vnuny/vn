"use client";
import React, { useState, useEffect, useRef } from 'react';
import poster from '../../../public/poster.jpg';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
interface SearchBoxProps {
    onSearchChange?: (value: string) => void;
}




export default function SearchBox({ onSearchChange }: SearchBoxProps) {
    const [movies, setMovies] = useState<any[]>([]);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [NoMovies, setNoMovies] = useState(false);
    const router = useRouter();


    // const handleInputLoading = () => {
        
    // }
    const movieSelect = async(movieurl:any) =>{
        if(movieurl){
            const url = movieurl;
            if(movieurl.includes('/series/')){
                var watchIndex = url.indexOf("/series/");
                const final = url.substring(watchIndex + 8);
                router.push(`/series/${final}`);
            }else{
                var watchIndex = url.indexOf("/watch/");
                const final = url.substring(watchIndex + 7);
                const check = await axios.get(`/api/checkmovieorepisode/${final}`);
                if(check.data.type === 'episode'){
                    router.push(`/episode/${final}`);
                } else if(check.data.type === 'movie'){
                    router.push(`/movie/${final}`);
                }
            }
        }else{
            console.log('no movie url');
        }
    }

    const handleChange = async (event:any) => {
        const value = event.target.value;
        setLoading(true);
        if (value === '') {
            setShowResult(false);
            setMovies([]);
            return;
        } else {
            try {
                if (event.keyCode === 13 && value !== '') { // 13 is the keycode for the Enter key
                    setLoading(true);
                    const response = await axios.get(`/api/search?q=${encodeURIComponent(value)}`);
                    if (response.data.data.length === 0) {
                        setNoMovies(true);
                        setMovies([]);
                        return;
                    } else {
                        setNoMovies(false);
                    }
                    setMovies(response.data.data);
                    setNoMovies(false);
                    setLoading(false);
                  }
            } catch (error) {

            } finally {
                setLoading(false);
            }
            setShowResult(true);
            if (typeof onSearchChange === 'function') {
                onSearchChange(value);
            }
        }
    };

    const handleFocus = (e: any) => {
        // setLoading(true);
        if (e.target.value !== '' && movies.length === 0) {
            setShowResult(false);
        }
    };
    

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const searchContainer = document.querySelector('.searchContainer');
            if (searchContainer && !searchContainer.contains(event.target as Node)) {
                setShowResult(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="searchContainer">
            <div className="searchBox">
                <input
                    type="text"
                    placeholder="search"
                    onFocus={handleFocus}
                    onKeyDown={handleChange}
                    ref={inputRef}
                />
                <i className="fa-regular fa-magnifying-glass"></i>
            </div>
            <div className="searchResult" style={{ display: showResult ? 'block' : 'none' }}>
                {NoMovies && <div className='searchBoxLoading'><h3 style={{color: 'white'}}>No Movies Found</h3></div>}
                {loading && <div className='searchBoxLoading'><i className="fa-solid fa-spinner-third fa-spin moviesLoadingS"></i></div>}
                {!loading && movies && movies.map((movie) => (
                    <div className="movieCard" onClick={movieSelect.bind(null, movie.movieUrl)}>
                        <div className="moviePoster"><img src={movie.posterUrl} alt={movie.movieName} onError={(event:any) => {event.target.src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg'}}/></div>
                        <div className="info">
                            <h3>{movie.movieName}</h3>
                            <div className="movieDetails">
                                <h4>{movie.movieYear} • Movie</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

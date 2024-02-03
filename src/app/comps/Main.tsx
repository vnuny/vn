"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import poster from '../../../public/poster.jpg';
import { useRouter } from "next/navigation";
import axios from "axios";
import https from 'https';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function Main({movies, moviesHeader, loadingState}:any) {
    const [loading, setLoading] = useState(loadingState);
    const router = useRouter();
    const movieCardLoadingRefs = useRef<boolean[]>([]); // Ref to hold loading states for each movie card

    useEffect(() => {
        setLoading(loadingState); // Update loading state when loadingState prop changes
    }, [loadingState]);

    useEffect(() => {
        if (movies && movies.length > 0 && loading === true) {
            setLoading(false);
        }
        
        // Initialize movieCardLoadingRefs with false values
        movieCardLoadingRefs.current = new Array(movies.length).fill(false);
    }, [movies]);

    const selectedMovie = async (movieurl:any, index: number, e:any) => {
        movieCardLoadingRefs.current[index] = true;
        setLoading(true); // Set loading state for the clicked movie card
        if(movieurl){
            const url = movieurl;
            console.log(movieurl);
            if(movieurl.includes('/series/')){
                var watchIndex = url.indexOf("/series/");
                const final = url.substring(watchIndex + 8);
                router.push(`/series/${final}`);
            } else {
                var watchIndex = url.indexOf("/watch/");
                const final = url.substring(watchIndex + 7);
                const check = await axios.get(`/api/checkmovieorepisode/${final}`);
                if(check.data.type === 'episode'){
                    router.push(`/episode/${final}`);
                } else if(check.data.type === 'movie'){
                    router.push(`/movie/${final}`);
                }
            }
        } else {
            movieCardLoadingRefs.current[index] = false; // Reset loading state for the clicked movie card
            setLoading(false);
            console.log('no movie url');
        }
    }

    return (
        <div className="main">
            <h1 className="allMoviesTitle">{moviesHeader}</h1>
            <div className="moviesGrid">
            {loading ? (
                <i className="fa-solid fa-spinner-third fa-spin moviesLoading"></i>
            ) : (
                movies && movies.map((movie: any, index: number) => (
                    <div className="movieCard" key={index + 1} onClick={(e) => selectedMovie(movie.movieUrl, index, e.currentTarget)}>
                        <div style={{visibility: movieCardLoadingRefs.current[index] ? 'visible' : 'hidden'}} className="movieCardLoading"><i className="fa-solid fa-spinner-third fa-spin"></i></div>
                        <img onError={(event:any) => {event.target.src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg'}} className="moviePoster" src={movie.posterUrl} alt="poster" />
                        <div className="info">
                            <h3>{movie.movieName}</h3>
                            <div className="movieDetails">
                                <h4>{movie.movieYear} • Movie</h4>
                            </div>
                        </div>
                    </div>
                ))
            )}
            </div>
        </div>
    )
}

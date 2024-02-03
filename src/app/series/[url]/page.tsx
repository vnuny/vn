"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "@/app/comps/Header";
import '../../css/seriesHome.css'
// import { Router } from "next/router";
export default function MainSeriesPage({params}:any) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>({});
    const [year, setYear] = useState<any>('');
    const [seasonsState, setSeasonsState] = useState<any>([]);
    const router = useRouter();
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/moviehome/${params.url}`);
                setData(response.data.data);
                setIsLoading(false);
                console.log(response.data.data)
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, [params.url]);

    const seasonSelect = async(seasonUrl:any)=>{
        try {
            setIsLoading(true);
            if(seasonUrl){
                const url = seasonUrl;
                var watchIndex = url.indexOf("/series/");
                const final = url.substring(watchIndex + 8);
                const response = await axios.get(`/api/moviehome/${final}`);
                setData(response.data.data);
                setIsLoading(false);
                if(response.data.data.seasons.length > 0){
                    setSeasonsState(true);
                }else{
                    setSeasonsState(false);
                }
            }else{
                console.log('no movie url');
            }
        } catch (error) {
            
        }
    }
    const selectEpisode = async(episodeUrl:any)=>{
        try {
                var watchIndex = episodeUrl.indexOf("/watch/");
                const final = episodeUrl.substring(watchIndex + 7);
                const response = await axios.get(`/api/episode/${final}`);
                if(response.data.status === 200){
                    router.push(`/episode/${final}`)
                }
                console.log(response.data);
                
        } catch (err:any) {
            console.log(err);
        }
    }
    return (
        <>
        <Header />
        {isLoading? (
            <div className="seriesHomeLoading"><i className="fa-solid fa-spinner fa-spin"></i></div>
        ):(
            <>
            <div className="main">
                <div className="home">
                    <div className="poster">
                        <img src={data.posterUrl} alt="poster" />
                    </div>
                    <div className="info">
                        <h2>{data.name}</h2>
                        <div className="movieDetails">
                            <h3 className="story">{data.story}</h3>
                            <div className="details">
                                <h4>Series</h4>
                                <h4>{year}</h4>
                                {data.genres && data.genres.length > 0 ? (
                                    data.genres.map((genre: string, index: number) => (
                                        <h4 key={index}>{genre}</h4>
                                    ))
                                ) : (
                                    <p>No genres available</p>
                                )}
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="seasonsBox">
                    <div className="seasons">
                            <div className="seasonsBtnsBox">
                                {data.seasons &&  data.seasons.map((season: any, index: number) => (
                                <button onClick={(e)=>{seasonSelect(season.url)}}>{season.season}</button>
                                ))}
                            </div>
                    </div>
                    <div className="episodes">
                        {data.episodes && data.episodes.map((episode: any, index: number) => (
                            <div className="episode" onClick={()=>{selectEpisode(episode.url)}}>
                                <h3 key={index}>{episode.episodeTitle}<i className="fa-regular fa-play"></i></h3>
                            </div>  
                        ))}
                    </div>
                </div>
            </div>
        </>
        )}
    </>
    )
}
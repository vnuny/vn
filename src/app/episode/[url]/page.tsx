"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "@/app/comps/Header";
import '../../css/seriesHome.css'
import '../../css/moviePage.css'
export default function MainSeriesPage({params}:any) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>({});
    const [year, setYear] = useState<any>('');
    const [seasonsState, setSeasonsState] = useState<any>([]);
    const [server, setServer] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        const fetchServer = async () => {
            const url = params.url;
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/episode/${url}`);
                console.log(response.data.data)
                setData(response.data.data);
                setServer(response.data.data.watchServers[0].url);
                const yearRegex = /\((\d{4})\)/;
                const match = data.englishName.match(yearRegex);
                const year = match ? match[1] : '';
                setYear(year);
            } catch (error) {
                setError("An error occurred while fetching data.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchServer();
    }, [])

    const selectEpisode = async(episodeUrl:any)=>{
        try {
            if(episodeUrl){
                var watchIndex = episodeUrl.indexOf("/watch/");
                const final = episodeUrl.substring(watchIndex + 7);
                router.push(`/episode/${final}`);
            }else{
                console.log('no movie url');
            }
        } catch (error) {
            
        }
    }

    const seasonSelect = async(seasonUrl:any)=>{
        try {
            setIsLoading(true);
            if(seasonUrl){
                const url = seasonUrl;
                var watchIndex = url.indexOf("/series/");
                const final = url.substring(watchIndex + 8);
                router.push(`/series/${final}`);
                setIsLoading(false);
            }else{
                console.log('no movie url');
            }
        } catch (error) {
            console.log(error)
        }
    }
    const changeServer = (e: any) => {
        setServer(e);
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
                        <h2>{data.movieName}</h2>
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
                                    <p></p>
                                )}
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="downloads">
                    <h3>download</h3>
                    <div className="links">
                        {data.downloadEpisodesServers.map((server: any, index: number) => (
                            <a href={server.downloadLink}>{server.resolution}<i className="fa-solid fa-file-arrow-down"></i></a>
                        ))}
                    </div>
                </div>
                <div className="seasonsBox">
                    <div className="seasons">
                            <div className="seasonsBtnsBox">
                                {data.Allseasons &&  data.Allseasons.map((season: any, index: number) => (
                                <button onClick={(e)=>{seasonSelect(season.url)}}>{season.name}</button>
                                ))}
                            </div>
                    </div>
                    <div className="episodes">
                        <h3 className="episodesTitle">:{data.episodesTitle}</h3>
                        {data.ThisSeasonEpisodes && data.ThisSeasonEpisodes.map((episode: any, index: number) => (
                            
                            <div className="episode" onClick={(e)=>{selectEpisode(episode.url)}}>
                                <h3 key={episode.url}>{episode.title}<i className="fa-regular fa-play"></i></h3>
                            </div>  
                        ))}
                    </div>
                </div>
                
                <div className="watch">
                    <h2>watching servers</h2>
                    <div className="servers">
                        {data.watchServers.map((server: any, index: number) => (
                            <button onClick={() => changeServer(server.url)}>{server.name}<i className="fa-solid fa-server"></i></button>
                        ))}
                    </div>
                    <iframe style={{border: '1px solid var(--secondaryColor)', borderRadius: '10px'}} allowFullScreen={true} src={server}></iframe>
                </div>
            </div>
        </>
        )}
    </>
    )
}
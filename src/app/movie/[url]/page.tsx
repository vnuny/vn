"use client";
import { useEffect, useState } from "react";
import Header from "@/app/comps/Header";
import Image from "next/image";
import posterUrl from '../../../../public/poster.jpg';
import '../../css/moviePage.css'
import axios from "axios";
export default function Page({ params }: any) {
    const url = params.url;
    const [server, setServer] = useState<string>('');
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [year, setYear] = useState<any>('');

    useEffect(() => {
        const fetchServer = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/moviePage?url=${url}`);
                setData(response.data.data);
                setServer(response.data.data.watchServers[0].serverUrl);
                const yearRegex = /\((\d{4})\)/;
                const match = data.englishName.match(yearRegex);
                const year = match ? match[1] : '';
                setYear(year);
            } catch (error) {
                setError("An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        }
        fetchServer();
    }, [])

    const changeServer = (e: any) => {
        setServer(e);
    }
    
    return (
        <>
        <Header />
        {loading || !data? (
            <div className="loadingMP"><i className="fa-solid fa-spinner-third fa-spin moviesLoading"></i></div>

        ): (
            <>
            <div className="main">
                <div className="home">
                    <div className="poster">
                        <img src={data.posterUrl} alt="poster" />
                    </div>
                    <div className="info">
                        <h2>{data.englishName}</h2>
                        <div className="movieDetails">
                            <h3 className="story">{data.story}</h3>
                            <div className="details">
                                <h4>{year}</h4>
                                <h4>Movie</h4>
                                <h4>{data.duration}</h4>
                                {data.genres.map((genre: string, index: number) => (
                                    <h4>{genre}</h4>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="downloads">
                    <h3>download</h3>
                    <div className="links">
                        {data.downloadServers.map((server: any, index: number) => (
                            <a href={server.downloadUrl}>{server.resolution}<i className="fa-solid fa-file-arrow-down"></i></a>
                        ))}
                    </div>
                </div>
                <div className="watch">
                    <h2>watching servers</h2>
                    <div className="servers">
                        {data.watchServers.map((server: any, index: number) => (
                            <button onClick={() => changeServer(server.serverUrl)}>{server.serverName}<i className="fa-solid fa-server"></i></button>
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
import axios from "axios";
import cheerio from 'cheerio';
import { NextRequest, NextResponse } from "next/server";
import domain from "@/app/domain";
async function Episode(episodeUrl:any){
    try {
        const response = await axios.get(episodeUrl);
        const html = response.data;
        const $ = cheerio.load(html);
        const movieFullName = $('.Title--Content--Single-begin h1').text();
        const yearRegex = /\((\d{4})\)/;
        const match = movieFullName.match(yearRegex);
        const seasons = <any>[];
        const episodes = <any>[];
        const watchServers = <any>[];
        const downloadEpisodesServers = <any>[];
        const downloadSeasonServers = <any>[];
        let year;
        if (match && match[1]) {
            year = match[1];
        }
    const data = {
        movieName: movieFullName,
        year: year,
        posterUrl: $('meta[itemprop="thumbnailUrl"]').attr('content'),
        genres: $('ul.Terms--Content--Single-begin li:contains("النوع") p a.unline').toArray().map(elem => $(elem).text().trim()),
        story: $('.PostItemContent').text().trim(),
        Allseasons: seasons,
        ThisSeasonEpisodes: episodes,
        episodesTitle: $('singlesection.Series--Section a h2').text(),
        nextEpisode: $('.EpisodeNavigation .NextEpisode').attr('href'),
        watchServers: watchServers,
        downloadEpisodesServers: downloadEpisodesServers,
        downloadSeasonServers: downloadSeasonServers
    }
    $('.List--Seasons--Episodes a').each((index, element) => {
        const seasonName = $(element).text();
        const seasonHref = $(element).attr('href');
        seasons.push({ name: seasonName, url: seasonHref });
    });
    $('.Episodes--Seasons--Episodes a').each((index, element) => {
        const episodeTitle = $(element).find('episodeTitle').text();
        const episodeHref = $(element).attr('href');
        episodes.push({ title: episodeTitle, url: episodeHref });
    });
    $('.WatchServersList li').each((index, element) => {
        const serverName = $(element).find('strong').text().trim();
        const serverUrl = $(element).find('btn').attr('data-url');
        watchServers.push({ name: serverName, url: serverUrl });
    });
    $('.Download--Wecima--Single .List--Download--Wecima--Single:first-of-type li').each((index, element) => {
        const downloadLink = $(element).find('a').attr('href');
        const quality = $(element).find('quality').text().trim();
        const resolution = $(element).find('resolution').text().trim();
        downloadEpisodesServers.push({ downloadLink, quality, resolution });
    });
    $('.Download--Wecima--Single .List--Download--Wecima--Single:last-of-type li').each((index, element) => {
        const downloadLink = $(element).find('a').attr('href');
        const quality = $(element).find('quality').text().trim();
        const resolution = $(element).find('resolution').text().trim();
        downloadSeasonServers.push({ downloadLink, quality, resolution });
    });        
    return data;
    } catch (error) {
        console.log(error);
    }
} 

export async function GET(request: NextRequest, { params }: any) {
    
    try {
        const url = params.url;
        const domainHome = await domain();
        const fullUrl = `${domainHome}watch/${url}`;
        const data = await Episode(fullUrl);
        return NextResponse.json({ data, status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error });
    }
}
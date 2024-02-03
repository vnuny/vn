import { NextRequest, NextResponse } from "next/server";
import domain from "@/app/domain";
import axios from "axios";
import cheerio from 'cheerio';
import fs from 'node:fs'
async function extractEpisodeData(html:any) {
    const seasons = <any>[];
    const episodes = <any>[];
    function getGenres($:any) {
        const genres = <any>[];
        $('.Terms--Content--Single-begin li:contains("النوع") p a').each((index:any, element:any) => {
            genres.push($(element).text().trim());
        });
        return genres;
    }
    const $ = cheerio.load(html);
    const styleAttribute = $('.separated--top').attr('style');
    const matchc = styleAttribute?.match(/url\(([^)]+)\)/) || '';
    const posterUrl = matchc ? matchc[1] : null;
    const EpisodesSeason = $('.Series--Section h2').text().trim();
    $('.List--Seasons--Episodes a').each((seasonIndex, seasonElement) => {
        const seasonUrl = $(seasonElement).attr('href');
        seasons.push({
            season: seasonIndex + 1,
            url: seasonUrl,
        });
    });
    $('.Episodes--Seasons--Episodes a').each((episodeIndex, episodeElement) => {
        const episodeUrl = $(episodeElement).attr('href');
        const episodeTitle = $(episodeElement).find('episodeTitle').text().trim();
        episodes.push({
            episodeTitle: episodeTitle,
            url: episodeUrl,
        });
    });
    const episodeData = {
        name: $('.Title--Content--Single-begin h1').text().trim(),
        arabicName: $('.Terms--Content--Single-begin li:contains("الإسم بالعربي") p').text().trim(),
        series: $('.Terms--Content--Single-begin li:contains("المسلسل") p a').text().trim(),
        genres: getGenres($),
        quality: $('.Terms--Content--Single-begin li:contains("الجودة") p a').text().trim(),
        alsoKnownAs: $('.Terms--Content--Single-begin li:contains("معروف ايضاََ بـ") p').text().trim(),
        story: $('.PostItemContent').text().trim(),
        watchServers: [],
        downloadLinks: [],
        posterUrl: posterUrl,
        episodesTitle: $('singlesection.Series--Section a h2').text(),
        seasons: seasons,
        episodes: episodes,
        EpisodesSeason: EpisodesSeason,
    };
    let allSeasonDownloadProcessed = false;
    $('.List--Download--Wecima--Single li').each((index, element) => {
        if ($(element).closest('.SeasonDownload').length > 0 && !allSeasonDownloadProcessed) {
            const allSeasonDownloadLinks = <any>[];
            $(element).closest('.List--Download--Wecima--Single').find('li').each((index, innerElement) => {
                const quality = $(innerElement).find('quality').text().trim();
                const resolution = $(innerElement).find('resolution').text().trim();
                const link = $(innerElement).find('a').attr('href');
                allSeasonDownloadLinks.push({ quality, resolution, link });
            });
            allSeasonDownloadProcessed = true;
        }
    });
    return episodeData;
}



export async function GET(request: NextRequest, { params }: any) {
    try {
        const { url: paramsUrl } = params;
        const domainHome = await domain();
        const fullUrl = `${domainHome}series/${paramsUrl}`;
        const response = await axios.get(fullUrl);
        const data = await extractEpisodeData(response.data);
        return NextResponse.json({ data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message });
    }
}
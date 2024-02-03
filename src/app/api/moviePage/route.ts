import axios from 'axios';
import domain from '@/app/domain';
import cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
interface Server {
    serverName: any;
    serverUrl: any;
}
interface DownloadLink {
    quality: any;
    resolution: any;
    downloadUrl: string;
}
async function extractMovieData(html: any) {
    const $ = cheerio.load(html);
    const watchServers: Server[] = $('.WatchServersList li').toArray().map(li => {
        const $li = $(li);
        const serverName = $li.find('strong').text().trim();
        const serverUrl = $li.find('btn').attr('data-url')?.trim() ?? '';
        return { serverName, serverUrl };
    });

    const downloadServers = $('.List--Download--Wecima--Single li a').toArray().map(a => {
        const $a = $(a);
        const quality = $a.find('quality').text().trim();
        const resolution = $a.find('resolution').text().trim();
        const downloadUrl = $a.attr('href')?.trim();
        return { quality, resolution, downloadUrl };
    });

    const posterUrl: string = ($('wecima.separated--top').attr('data-lazy-style')?.match(/url\(([^)]+)\)/)?.[1] || '');

    const movieData = {
        englishName: $('div.Title--Content--Single-begin h1[itemprop="name"]').text().trim(),
        posterUrl,
        story: $('.StoryMovieContent').text().trim(),
        name: $('ul.Terms--Content--Single-begin li:contains("الإسم بالعربي") p').text().trim(),
        rating: $('ul.Terms--Content--Single-begin li:contains("التصنيف") p a.unline').text().trim(),
        countryAndLanguage: $('ul.Terms--Content--Single-begin li:contains("البلد و اللغة") p a.unline').toArray().map(elem => $(elem).text().trim()),
        duration: $('ul.Terms--Content--Single-begin li:contains("المدة") p').text().trim(),
        genres: $('ul.Terms--Content--Single-begin li:contains("النوع") p a.unline').toArray().map(elem => $(elem).text().trim()),
        quality: $('ul.Terms--Content--Single-begin li:contains("الجودة") p a.unline').text().trim(),
        awards: $('ul.Terms--Content--Single-begin li:contains("الجوائز") p a.unline').text().trim(),
        productionCompanies: $('ul.Terms--Content--Single-begin li:contains("شركات الإنتاج") p a.unline').toArray().map(elem => $(elem).text().trim()),
        alsoKnownAs: $('ul.Terms--Content--Single-begin li:contains("معروف ايضاََ بـ") p').text().trim(),
        filmingLocations: $('ul.Terms--Content--Single-begin li:contains("مواقع التصوير") p').text().trim(),
        watchServers,
        downloadServers,
    };

    return movieData;
}

async function getPage(movieUrl:any) {
    try {
        const response = await axios.get(movieUrl);
        const html = response.data;
        const data = await extractMovieData(html);
        return data;
    } catch (error) {
        console.error('Error fetching movie data:', error);
        throw error;
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const movieUrl = searchParams.get('url');
        const domainHome = await domain();
        const url = `${domainHome}/watch/${movieUrl}`;
        const data = await getPage(url);
        return NextResponse.json({ data },{status: 200});
    } catch (error:any) {
        return NextResponse.json({ error: error.message });
    }
}
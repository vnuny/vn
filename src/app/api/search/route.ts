import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import cheerio from 'cheerio';
import domain from '@/app/domain';

async function search(searchValue:any) {
    try {
        const domainHost = await domain();
        const searchEndpoints = [
            `${domainHost}/search/${searchValue}`,
            `${domainHost}/search/${searchValue}/list/anime`,
            `${domainHost}/search/${searchValue}/list/series`
        ];

        const allMovies: any[] = [];

        // Make requests to all search endpoints concurrently
        const responses = await Promise.all(searchEndpoints.map(endpoint => axios.get(endpoint)));

        // Process each response and extract movie information
        responses.forEach(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            
            $('.GridItem').each((index, element) => {
                const movieUrl = $(element).find('.Thumb--GridItem a').attr('href');
                const movieName = $(element).find('.hasyear').text().trim();
                const movieYear = $(element).find('.hasyear .year').text().replace('(', '').replace(')', '').trim();
                const posterUrlAttr = $(element).find('.BG--GridItem').attr('data-lazy-style');
                const posterUrl = posterUrlAttr ? (posterUrlAttr.match(/url\((.*?)\)/) || [])[1] : undefined;

                allMovies.push({
                    movieUrl,
                    movieName,
                    movieYear,
                    posterUrl,
                });
            });
        });

        return allMovies;
    } catch (error) {
        return error;
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const searchValue = searchParams.get('q');
        const data = await search(searchValue);
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: error });
    }
}
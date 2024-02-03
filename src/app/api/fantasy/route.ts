import axios from "axios";
import domain from "@/app/domain";
import { NextRequest, NextResponse } from "next/server";
import cheerio from "cheerio";

async function fantasy() {
    try {
        const domainHost = await domain();
        const searchEndpoints = [`${domainHost}/category/%d8%a3%d9%81%d9%84%d8%a7%d9%85/%d8%a7%d9%81%d9%84%d8%a7%d9%85-%d9%88%d8%ab%d8%a7%d8%a6%d9%82%d9%8a%d8%a9-documentary-films/`];
        const allMovies: any[] = [];
        const responses = await Promise.all(searchEndpoints.map(endpoint => axios.get(endpoint)));
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
        const data = await fantasy();
        return NextResponse.json({ data });
        
    } catch (error) {
        return NextResponse.json({ error: error });
    }
}
import domain from "@/app/domain";
import cheerio from "cheerio";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
    const domainHome = await domain();
    const url = `${domainHome}watch/${params.url}`;
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const check = $('.List--Seasons--Episodes').length > 0;
        if(check){
            return NextResponse.json({ type: 'episode' });
        }else{
            return NextResponse.json({ type: 'movie' });
        }
    } catch (error) {
        return NextResponse.json({ error: error });
    }
}
import { NextResponse } from "next/server";

const API = "https://www.googleapis.com/youtube/v3";

export async function GET() {
    try {
        const key = process.env.YOUTUBE_API_KEY!;
        const channelId = process.env.YOUTUBE_CHANNEL_ID;
        const explicitPlaylist = process.env.YOUTUBE_PLAYLIST_ID;

        if (!key) {
            return NextResponse.json(
                { error: "Missing YOUTUBE_API_KEY" },
                { status: 400 },
            );
        }

        // Resolve uploads playlist if channel ID provided
        let playlistId = explicitPlaylist || null;
        if (!playlistId && channelId) {
            const ch = await fetch(
                `${API}/channels?part=contentDetails&id=${channelId}&key=${key}`,
                { next: { revalidate: 300 } },
            );
            const chData = await ch.json();
            playlistId =
                chData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ||
                null;
        }

        if (!playlistId) {
            return NextResponse.json(
                {
                    error: "Set YOUTUBE_CHANNEL_ID (UC…) or YOUTUBE_PLAYLIST_ID (UU…/PL…)",
                },
                { status: 400 },
            );
        }

        const pl = await fetch(
            `${API}/playlistItems?part=contentDetails,snippet&maxResults=50&playlistId=${playlistId}&key=${key}`,
            { next: { revalidate: 300 } },
        );

        if (!pl.ok) {
            const txt = await pl.text();
            return NextResponse.json(
                { error: `YouTube API error: ${pl.status} ${txt}` },
                { status: 502 },
            );
        }

        const data = await pl.json();
        const videos = (data?.items ?? [])
            .map((it: any) => ({
                id: it.contentDetails?.videoId,
                title: it.snippet?.title,
                thumb:
                    it.snippet?.thumbnails?.medium?.url ||
                    it.snippet?.thumbnails?.default?.url,
                publishedAt:
                    it.contentDetails?.videoPublishedAt ||
                    it.snippet?.publishedAt,
            }))
            .filter((v) => v.id)
            .sort(
                (a: any, b: any) =>
                    new Date(b.publishedAt).getTime() -
                    new Date(a.publishedAt).getTime(),
            );

        return NextResponse.json({ videos });
    } catch (e) {
        return NextResponse.json(
            { error: "YouTube fetch failed" },
            { status: 500 },
        );
    }
}

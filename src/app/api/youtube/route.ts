import { NextResponse } from "next/server";

const API = "https://www.googleapis.com/youtube/v3";

type YTThumbnail = { url?: string; width?: number; height?: number };

interface YTPlaylistItem {
    contentDetails?: { videoId?: string; videoPublishedAt?: string };
    snippet?: {
        title?: string;
        publishedAt?: string;
        thumbnails?: { medium?: YTThumbnail; default?: YTThumbnail };
    };
}

interface YTPlaylistResponse {
    items?: YTPlaylistItem[];
}

interface YTChannelsResponse {
    items?: {
        contentDetails?: { relatedPlaylists?: { uploads?: string } };
    }[];
}

type VideoSummary = {
    id: string;
    title?: string;
    thumb?: string;
    publishedAt?: string;
};

export async function GET() {
    try {
        const key = process.env.YOUTUBE_API_KEY;
        const channelId = process.env.YOUTUBE_CHANNEL_ID;
        const explicitPlaylist = process.env.YOUTUBE_PLAYLIST_ID;

        if (!key) {
            return NextResponse.json(
                { error: "Missing YOUTUBE_API_KEY" },
                { status: 400 },
            );
        }

        // resolve uploads playlist if channel ID provided
        let playlistId: string | null = explicitPlaylist ?? null;

        if (!playlistId && channelId) {
            const chRes = await fetch(
                `${API}/channels?part=contentDetails&id=${channelId}&key=${key}`,
                { next: { revalidate: 300 } },
            );
            if (!chRes.ok) {
                const txt = await chRes.text();
                return NextResponse.json(
                    { error: `YouTube channels error: ${chRes.status} ${txt}` },
                    { status: 502 },
                );
            }
            const chData = (await chRes.json()) as YTChannelsResponse;
            playlistId =
                chData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ??
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

        const plRes = await fetch(
            `${API}/playlistItems?part=contentDetails,snippet&maxResults=50&playlistId=${playlistId}&key=${key}`,
            { next: { revalidate: 300 } },
        );
        if (!plRes.ok) {
            const txt = await plRes.text();
            return NextResponse.json(
                {
                    error: `YouTube playlistItems error: ${plRes.status} ${txt}`,
                },
                { status: 502 },
            );
        }

        const plData = (await plRes.json()) as YTPlaylistResponse;

        const videos: VideoSummary[] = (plData.items ?? []).flatMap(
            (it: YTPlaylistItem): VideoSummary[] => {
                const id = it.contentDetails?.videoId;
                if (!id) return [];
                const title = it.snippet?.title;
                const thumb =
                    it.snippet?.thumbnails?.medium?.url ??
                    it.snippet?.thumbnails?.default?.url;
                const publishedAt =
                    it.contentDetails?.videoPublishedAt ??
                    it.snippet?.publishedAt;
                return [{ id, title, thumb, publishedAt }];
            },
        );

        videos.sort((a, b) => {
            const at = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
            const bt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
            return bt - at;
        });

        return NextResponse.json({ videos });
    } catch (_err) {
        return NextResponse.json(
            { error: "YouTube fetch failed" },
            { status: 500 },
        );
    }
}

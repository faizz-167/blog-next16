import {NextResponse} from "next/server";
import {fetchAuthMutation} from "@/lib/auth-server";
import {api} from "@/convex/_generated/api";

export async function POST() {
    try {
        const uploadUrlObj = await fetchAuthMutation(api.blogs.generateImageUpload, {});
        return NextResponse.json(uploadUrlObj);
    } catch (err) {
        console.error("error getting upload url:", err);
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}
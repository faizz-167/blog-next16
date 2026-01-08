"use client"
import React from 'react'
import usePresence from "@convex-dev/presence/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import FacePile from "@convex-dev/presence/facepile";

interface Props{
    roomId: Id<'blog'>
    userId: string
}

export const PostPresence = ({roomId, userId}: Props) => {
    const presenceState = usePresence(api.presence, roomId, userId);
    if (!presenceState || presenceState.length === 0) {
        return null
    }
    return (
        <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Viewers</p>
            <div className="text-black">
                <FacePile presenceState={presenceState} />
            </div>
        </div>
    )
}

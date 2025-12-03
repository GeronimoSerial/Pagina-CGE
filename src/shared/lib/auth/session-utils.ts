import {cache} from "react"
import {auth} from "@/shared/lib/auth/auth"

import {headers} from "next/headers"
export const getCachedSession = cache(async () => {
    return await auth.api.getSession({ headers: await headers() });
})
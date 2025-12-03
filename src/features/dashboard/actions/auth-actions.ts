"use server";

import { auth } from "@/shared/lib/auth/auth";
import { headers } from "next/headers";

export async function createUser(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // @ts-ignore
    const currentUserRole = session?.user?.role;

    if (currentUserRole !== 'owner') {
        return { error: "Unauthorized" };
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    if (!email || !password || !name || !role) {
        return { error: "Missing fields" };
    }

    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
                // @ts-ignore
                role,
            }
        });
        return { success: true };
    } catch (error: any) {
        console.error("Error creating user:", error);
        return { error: error.body?.message || "Failed to create user" };
    }
}

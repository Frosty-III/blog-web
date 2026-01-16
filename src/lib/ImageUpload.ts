import { supabase } from "./supabaseClient";

export async function uploadImage(file: File,
    bucket: "blog-images" | "comment-images"){
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            throw new Error("User not authenticated");
        }

        const {error} = await supabase.storage
        .from(bucket)
        .upload(`${user.id}/${fileName}`, file)

        if (error) throw error

        const {data} = supabase.storage
        .from(bucket)
        .getPublicUrl(`${user.id}/${fileName}`)

        return data.publicUrl
    }

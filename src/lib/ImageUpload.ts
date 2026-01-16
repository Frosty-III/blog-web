
import { supabase } from "./supabaseClient";

export async function uploadImage(file: File,
    bucket: "blog-images" | "comment-images"){
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`

        const {error} = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

        if (error) throw error

        const {data} = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

        return data.publicUrl
    }

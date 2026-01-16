import {supabase} from '../lib/supabaseClient';
import { uploadImage } from '../lib/ImageUpload';


interface CreateCommentParams {
    blogId: string;
    userId: string;
    content: string;
    imageFile?: File;
}

export async function createComment({blogId, userId, content, imageFile}: CreateCommentParams) {
    let imageUrl: string | null = null; 

    if  (imageFile) {
        imageUrl = await uploadImage (imageFile, 'comment-images');
    }

    const {data, error} = await supabase.from('comments').insert([
        {blog_id: blogId, user_id: userId, content, image_url: imageUrl, created_at: new Date().toISOString()}
    ])

    if (error) throw error;
    return data;
}



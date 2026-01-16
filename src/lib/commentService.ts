import {supabase} from './supabaseClient';
import { uploadImage } from './ImageUpload';

interface CreateCommentParams {
    blogId: string;
    content: string;
    imageFile?: File;
}

export async function createComment({blogId, content, imageFile}: CreateCommentParams) {
   
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        throw new Error("User not authenticated");
    }

    let imageUrl: string | null = null; 

    if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'comment-images');
    }

    const {data, error} = await supabase.from('comments').insert([
        {blog_id: blogId, user_id: user.id, comment_text: content, image_url: imageUrl, created_at: new Date().toISOString()}
    ]).select();

    if (error) throw error;
    return data;
}

export async function getComments(blogId: string) {
    const {data, error} = await supabase
        .from('comments')
        .select('*')
        .eq('blog_id', blogId)
        .order('created_at', {ascending: false});

    if (error) throw error;
    return data;
}



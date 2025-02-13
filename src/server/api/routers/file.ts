import { z } from "zod";
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import {storage} from "@/lib/gcp-storage"

const bucket = storage.bucket(process.env.GCP_CHAT_IMAGE_BUCKET_NAME!)
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB


const getSignedUrl = async (path: string) => {
  const [url] = await storage.bucket(process.env.GCP_CHAT_IMAGE_BUCKET_NAME!)
    .file(path)
    .getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 3600 * 1000 // 1 hour
    });
  return url;
};

export const fileRouter = createTRPCRouter({


  getSignerImageUrl : publicProcedure
  .input(z.object({
    path : z.string()
  }))
  .query(async ({input}) => {
    return getSignedUrl(input.path)
  }
  ),
 
chatImageUpload : protectedProcedure
    .input(z.object({
       
      file: z.string().refine((val) => {
        const header = val.split(',')[0];
        const mime = header?.match(/:(.*?);/)?.[1];
        return ACCEPTED_IMAGE_TYPES.includes(mime || '');
      }, "Unsupported file type"),
       
        chatRoomId : z.string()
    }))
    .mutation(async ({ ctx,input }) => {

        const file = input.file;
        const chatId = input.chatRoomId

        const base64Data = file.split(',')[1];
        const buffer = Buffer.from(base64Data!, 'base64');

        if (buffer.length > MAX_FILE_SIZE) {
          throw new Error("Max image size is 5MB");
        }
           // Process image
      const processedBuffer = await sharp(buffer)
      .resize({ width: 1920, height: 1080, fit: 'inside' })
      .webp()
      .toBuffer();

        
        const fileName = `${uuidv4()}.webp`

        const fileRef = bucket.file(`chats/${chatId}/${fileName}`) 

        await fileRef.save(processedBuffer, {
            metadata: {
              contentType: 'image/webp',
              metadata: {
                uploadedBy: ctx.dbUser!.id!,
                chatId: chatId,
              }
            }
          })



    const dbImage = await ctx.db.chatImage.create({
        data: {
            chatRoomId: chatId,
            userId: ctx.dbUser!.id!,
            path: fileRef.name,
        }
    })



        return { 
          success: true, 
          id: dbImage.id,
          path : dbImage.path,
          url: await getSignedUrl(dbImage.path) 
        };


    }),


    chatImagesGet : protectedProcedure
    .input(z.object({
        chatRoomId : z.string()
    }))
    .query(async ({input,ctx}) => {

        const images = await ctx.db.chatImage.findMany({
            where: {
                chatRoomId: input.chatRoomId
            }
        })

        const imageLinks = images.map(async (image) => {

          const [url] = await bucket.file(image.path).getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          })
          return url
        })

        return imageLinks
    })


    
  })


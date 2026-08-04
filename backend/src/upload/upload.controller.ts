import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage()
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    
    try {
      const apiKey = "8166b3054b13a77ee652fc69e7eeaecd"; // ImgBB API Key do usuário
      const base64Image = file.buffer.toString('base64');
      
      const formData = new URLSearchParams();
      formData.append('image', base64Image);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return {
          url: data.data.url // ImgBB retorna a URL direta da imagem aqui
        };
      } else {
        throw new BadRequestException('Falha no upload de imagem');
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro de comunicação com o servidor de imagens');
    }
  }
}

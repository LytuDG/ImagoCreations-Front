import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SAVE_IMAGE_ENDPOINT } from '@/core/constants/endpoints/utils/utils';
import { CloudinaryUploadResponse } from '@/core/models/product/create-product.dto';

@Injectable({
    providedIn: 'root'
})
export class ImageUploadService {
    private http = inject(HttpClient);

    /**
     * Upload an image to Cloudinary via the backend API
     * @param file - The image file to upload
     * @param subfolder - Optional subfolder path in Cloudinary (e.g., 'product/electronics')
     * @param path - Optional path parameter (currently unused by API)
     * @returns Observable of Cloudinary upload response
     */
    uploadImage(file: File, subfolder: string = 'product'): Observable<CloudinaryUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subfolder', subfolder);

        return this.http.post<CloudinaryUploadResponse>(SAVE_IMAGE_ENDPOINT, formData);
    }

    /**
     * Validate image file before upload
     * @param file - The file to validate
     * @param maxSizeMB - Maximum file size in megabytes (default: 10MB)
     * @returns Object with isValid flag and optional error message
     */
    validateImageFile(file: File, maxSizeMB: number = 10): { isValid: boolean; error?: string } {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            return {
                isValid: false,
                error: 'Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.'
            };
        }

        if (file.size > maxSizeBytes) {
            return {
                isValid: false,
                error: `File size exceeds ${maxSizeMB}MB. Please upload a smaller image.`
            };
        }

        return { isValid: true };
    }
}

import axios from 'axios'
import api from './api'

// 25MB per part keeps the part count reasonable for a multi-GB 4K movie
// (S3 allows up to 10,000 parts) while still giving frequent progress updates.
const PART_SIZE = 25 * 1024 * 1024

// Real S3 multipart upload: parts go straight to S3 via presigned URLs, never
// through API Gateway (which caps request bodies at 10MB - useless for a
// movie file). Progress is the real sum of bytes uploaded across all parts.
export async function uploadVideoMultipart(file, onProgress) {
  const initRes = await api.post('/file-upload/multipart/initiate', {
    filename: file.name,
    contentType: file.type || 'video/mp4',
  })
  const { uploadId, key } = initRes.data

  const totalParts = Math.ceil(file.size / PART_SIZE)
  const partBytesUploaded = new Array(totalParts).fill(0)
  const parts = []

  const reportProgress = () => {
    const uploaded = partBytesUploaded.reduce((sum, v) => sum + v, 0)
    onProgress(Math.min(99, Math.floor((uploaded / file.size) * 100)))
  }

  try {
    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const start = (partNumber - 1) * PART_SIZE
      const end = Math.min(start + PART_SIZE, file.size)
      const chunk = file.slice(start, end)

      const presignRes = await api.post('/file-upload/multipart/presign-part', {
        key,
        uploadId,
        partNumber,
      })

      const uploadRes = await axios.put(presignRes.data.url, chunk, {
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        onUploadProgress: (evt) => {
          partBytesUploaded[partNumber - 1] = evt.loaded
          reportProgress()
        },
      })

      const etag = uploadRes.headers.etag || uploadRes.headers.ETag
      parts.push({ ETag: etag, PartNumber: partNumber })
    }

    await api.post('/file-upload/multipart/complete', { key, uploadId, parts })
    onProgress(100)
    return key
  } catch (error) {
    await api.post('/file-upload/multipart/abort', { key, uploadId }).catch(() => {})
    throw error
  }
}

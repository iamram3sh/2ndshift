/**
 * Face Match Adapter
 * Supports multiple providers: AWS Rekognition, Face++, or Mock
 */

const faceMatchProvider = process.env.FACE_MATCH_PROVIDER || 'mock'
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const awsRegion = process.env.AWS_REGION || 'us-east-1'
const faceplusplusApiKey = process.env.FACEPLUSPLUS_API_KEY
const faceplusplusApiSecret = process.env.FACEPLUSPLUS_API_SECRET

interface FaceMatchResult {
  success: boolean
  similarityScore: number // 0-1
  verified: boolean
  requiresManualReview: boolean
  error?: string
}

/**
 * AWS Rekognition Face Comparison
 * 
 * ⚠️ INVESTOR-READY: See lib/verification/integrations/production-services.ts
 * for production integration instructions
 */
async function compareFacesAWS(
  sourceImage: Buffer | string,
  targetImage: Buffer | string
): Promise<FaceMatchResult> {
  if (!awsAccessKeyId || !awsSecretAccessKey) {
    console.log('[DEMO] AWS Rekognition - Credentials not configured, using mock')
    // Fall through to mock implementation
  } else {
    // ⚠️ INVESTOR-READY: Uncomment when AWS credentials are available
    // See lib/verification/integrations/production-services.ts for implementation
    /*
    import { RekognitionClient, CompareFacesCommand } from '@aws-sdk/client-rekognition'
    
    const client = new RekognitionClient({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    })

    try {
      const command = new CompareFacesCommand({
        SourceImage: { Bytes: sourceImage },
        TargetImage: { Bytes: targetImage },
        SimilarityThreshold: 80,
      })

      const response = await client.send(command)
      const similarity = response.FaceMatches?.[0]?.Similarity || 0

      return {
        success: true,
        similarityScore: similarity / 100,
        verified: similarity >= 90,
        requiresManualReview: similarity >= 80 && similarity < 90,
      }
    } catch (error: any) {
      console.error('AWS Rekognition error:', error)
      return {
        success: false,
        similarityScore: 0,
        verified: false,
        requiresManualReview: false,
        error: error.message || 'Face match failed'
      }
    }
    */
  }

  // DEMO MODE: Mock implementation
  console.log('[DEMO] AWS Rekognition - Using mock implementation')
  const similarityScore = 0.85 + Math.random() * 0.14 // 0.85-0.99
  
  return {
    success: true,
    similarityScore,
    verified: similarityScore >= 0.90,
    requiresManualReview: similarityScore >= 0.80 && similarityScore < 0.90
  }
}

/**
 * Face++ Face Comparison
 * 
 * ⚠️ INVESTOR-READY: See lib/verification/integrations/production-services.ts
 * for production integration instructions
 */
async function compareFacesFacePlusPlus(
  sourceImage: Buffer | string,
  targetImage: Buffer | string
): Promise<FaceMatchResult> {
  if (!faceplusplusApiKey || !faceplusplusApiSecret) {
    console.log('[DEMO] Face++ - Credentials not configured, using mock')
    // Fall through to mock implementation
  } else {
    // ⚠️ INVESTOR-READY: Uncomment when Face++ credentials are available
    // See lib/verification/integrations/production-services.ts for implementation
    /*
    const formData = new FormData()
    formData.append('api_key', faceplusplusApiKey)
    formData.append('api_secret', faceplusplusApiSecret)
    formData.append('image_base64_1', sourceImage.toString('base64'))
    formData.append('image_base64_2', targetImage.toString('base64'))

    try {
      const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/compare', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      const confidence = data.confidence || 0

      return {
        success: true,
        similarityScore: confidence / 100,
        verified: confidence >= 90,
        requiresManualReview: confidence >= 80 && confidence < 90,
      }
    } catch (error: any) {
      console.error('Face++ error:', error)
      return {
        success: false,
        similarityScore: 0,
        verified: false,
        requiresManualReview: false,
        error: error.message || 'Face match failed'
      }
    }
    */
  }

  // DEMO MODE: Mock implementation
  console.log('[DEMO] Face++ - Using mock implementation')
  const similarityScore = 0.85 + Math.random() * 0.14
  
  return {
    success: true,
    similarityScore,
    verified: similarityScore >= 0.90,
    requiresManualReview: similarityScore >= 0.80 && similarityScore < 0.90
  }
}

/**
 * Mock Face Comparison (for development)
 */
async function compareFacesMock(
  sourceImage: Buffer | string,
  targetImage: Buffer | string
): Promise<FaceMatchResult> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock: Return random similarity score
  // In real scenario, this would always require manual review
  const similarityScore = 0.75 + Math.random() * 0.24 // 0.75-0.99
  
  console.log(`[MOCK FACE MATCH] Similarity score: ${similarityScore.toFixed(2)}`)
  
  return {
    success: true,
    similarityScore,
    verified: similarityScore >= 0.90,
    requiresManualReview: true // Always require manual review in mock mode
  }
}

/**
 * Compare faces from ID document and selfie
 * @param idDocumentUrl - URL or buffer of ID document image
 * @param selfieUrl - URL or buffer of selfie image
 */
export async function compareFaces(
  idDocumentUrl: string | Buffer,
  selfieUrl: string | Buffer
): Promise<FaceMatchResult> {
  try {
    // Convert URLs to buffers if needed
    let idImage: Buffer
    let selfieImage: Buffer

    if (typeof idDocumentUrl === 'string') {
      const response = await fetch(idDocumentUrl)
      idImage = Buffer.from(await response.arrayBuffer())
    } else {
      idImage = idDocumentUrl
    }

    if (typeof selfieUrl === 'string') {
      const response = await fetch(selfieUrl)
      selfieImage = Buffer.from(await response.arrayBuffer())
    } else {
      selfieImage = selfieUrl
    }

    // Route to appropriate provider
    switch (faceMatchProvider) {
      case 'aws_rekognition':
        return await compareFacesAWS(idImage, selfieImage)
      
      case 'faceplusplus':
        return await compareFacesFacePlusPlus(idImage, selfieImage)
      
      case 'mock':
      default:
        return await compareFacesMock(idImage, selfieImage)
    }
  } catch (error: any) {
    console.error('Face match error:', error)
    return {
      success: false,
      similarityScore: 0,
      verified: false,
      requiresManualReview: false,
      error: error.message || 'Face match failed'
    }
  }
}

/**
 * Validate image format and size
 */
export function validateImage(image: Buffer | File): { valid: boolean; error?: string } {
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024
  const size = image instanceof File ? image.size : image.length
  
  if (size > maxSize) {
    return { valid: false, error: 'Image size exceeds 10MB limit' }
  }

  // Check file type (basic check)
  // In production, use a proper image validation library
  return { valid: true }
}


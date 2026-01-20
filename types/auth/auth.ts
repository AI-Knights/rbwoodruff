export interface IRegister {
    message: string;
    email: string;
    user_type: string

}


export type UserType =
    | "general"
    | "agency_referred"
    | "employer"
    | "training_provider"
    | "agency";


export interface BaseRegistration {
    full_name: string;
    email: string;
    password: string;
    user_type: UserType;
}

export interface GeneralUserData {
    phone_number: string;
}

export interface GeneralUserRegistration extends BaseRegistration {
    user_type: "general";
    data: GeneralUserData;
}


export interface AgencyReferredUserData {
    phone_number: string;
    court_name: string;
    case_name: string;
}

export interface AgencyReferredUserRegistration extends BaseRegistration {
    user_type: "agency_referred";
    data: AgencyReferredUserData;
}



export interface EmployerData {
    company_name: string;
    office_location: string;
}

export interface EmployerRegistration extends BaseRegistration {
    user_type: "employer";
    data: EmployerData;
}

export interface TrainingProviderData {
    specialization: string;
    experience: string; // can be number if needed
    skills: string[] | string;
    bio: string;
}

export interface TrainingProviderRegistration extends BaseRegistration {
    user_type: "training_provider";
    data: TrainingProviderData;
}

export interface AgencyData {
    agency_name: string;
    agency_id: string;
    address: string;
    documents: {public_id: string; url: string }[];
}

export interface AgencyRegistration extends BaseRegistration {
    user_type: "agency";
    data: AgencyData;
}


export type UserRegistrationPayload =
    | GeneralUserRegistration
    | AgencyReferredUserRegistration
    | EmployerRegistration
    | TrainingProviderRegistration
    | AgencyRegistration;


export interface CloudinaryUploadResponse {
    /** Unique asset identifier */
    asset_id: string;

    /** Public ID of the uploaded asset (e.g., "pending/filename") */
    public_id: string;

    /** Version timestamp */
    version: number;

    /** Version ID */
    version_id: string;

    /** Signature for secure delivery verification */
    signature: string;

    /** Width in pixels (for images; for PDFs it's page width) */
    width: number;

    /** Height in pixels (for images; for PDFs it's page height) */
    height: number;

    /** File format (e.g., "pdf", "jpg", "png") */
    format: string;

    /** Resource type: "image", "video", "raw" */
    resource_type: "image" | "video" | "raw";

    /** Upload timestamp */
    created_at: string; // ISO 8601 format

    /** Array of tags (optional) */
    tags: string[];

    /** Number of pages (only for PDF) */
    pages?: number;

    /** File size in bytes */
    bytes: number;

    /** Upload type: "upload", "fetch", etc. */
    type: string;

    /** ETag for caching */
    etag: string;

    /** Whether it's a placeholder */
    placeholder: boolean;

    /** Direct HTTP URL (non-secure) */
    url: string;

    /** Secure HTTPS URL (recommended) */
    secure_url: string;

    /** Folder name in Cloudinary */
    folder: string;

    /** Access mode: "public" or "authenticated" */
    access_mode: string;

    /** Original filename uploaded by user */
    original_filename?: string;

    /** Optional: If you use signed uploads, API key might be returned */
    api_key?: string;
}
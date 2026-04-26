export interface ShareResult {
    shareId: string;
    content: string; 
}

export interface ShamirSplitResponse {
    secretId: string;
    threshold: number;
    shares: ShareResult[];
}

export interface ShareDataPoint {
    x: number;
    content: string;
}

export interface DBShare {
    id: string;
    content: string;
    xIndex: number;
    secretId: string;
}